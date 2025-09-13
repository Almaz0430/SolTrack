import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createInitializeMintInstruction } from '@solana/spl-token';

import { CONFIG } from './config';

// Константы смарт-контракта
export const PROGRAM_ID = new PublicKey(CONFIG.PROGRAM_ID);
export const NETWORK = CONFIG.NETWORK;
export const RPC_URL = CONFIG.RPC_URL;

// IDL интерфейс (будет загружен динамически)
export interface MusicNftData {
  title: string;
  symbol: string;
  uri: string;
  genre: string;
  price: number;
  bpm: number;
  key: string;
  owner: PublicKey;
  mint: PublicKey;
  amount: number;
  amountSold: number;
  isForSale: boolean;
}

export interface CreateNftParams {
  title: string;
  symbol: string;
  uri: string;
  genre: string;
  price: number; // в SOL
  bpm: number;
  key: string;
}

export class SolanaContractService {
  private static connection: Connection;
  private static program: Program;

  static initialize(connection: Connection, program: Program) {
    this.connection = connection;
    this.program = program;
  }

  static async createMusicNFT(
    wallet: any,
    params: CreateNftParams
  ): Promise<{ signature: string; mint: string; nftDataPda: string }> {
    if (!this.connection || !this.program) {
      throw new Error('Contract service not initialized');
    }

    if (typeof params.price !== 'number' || params.price < 0) {
      throw new Error('Price must be a non-negative number.');
    }

    // Создаем mint аккаунт
    const mint = web3.Keypair.generate();
    
    // Получаем lamports для mint
    const lamportsForMint = await this.connection.getMinimumBalanceForRentExemption(82);
    
    // Создаем ATA
    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );

    // Находим PDA для NFT данных
    const [nftDataPda] = await PublicKey.findProgramAddress(
      [Buffer.from("music_nft"), mint.publicKey.toBuffer()],
      PROGRAM_ID
    );

    // Создаем транзакцию
    const transaction = new Transaction();

    // Добавляем создание mint аккаунта
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: 82,
        lamports: lamportsForMint,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      )
    );

    // Добавляем создание ATA
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        tokenAccount,
        wallet.publicKey,
        mint.publicKey
      )
    );

    // Добавляем вызов смарт-контракта
    const createNFTIx = await this.program.methods
      .createMusicNft(
        params.title,
        params.symbol,
        params.uri,
        params.genre,
         new BN(Math.floor(params.price * 1e9)), // цена в lamports
        params.bpm,
        params.key
      )
      .accounts({
        authority: wallet.publicKey,
        payer: wallet.publicKey,
        mint: mint.publicKey,
        tokenAccount: tokenAccount,
        nftData: nftDataPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    transaction.add(createNFTIx);

    // Отправляем транзакцию
    const signature = await this.connection.sendTransaction(transaction, [mint], {
      preflightCommitment: 'processed',
    });

    await this.connection.confirmTransaction(signature, 'processed');
    
    return {
      signature,
      mint: mint.publicKey.toString(),
      nftDataPda: nftDataPda.toString()
    };
  }

  static async buyMusicNFT(
    wallet: any,
    nftDataPda: string,
    sellerTokenAccount: string
  ): Promise<string> {
    if (!this.connection || !this.program) {
      throw new Error('Contract service not initialized');
    }

     // Получаем данные NFT
     const nftData = await (this.program.account as any).musicNftData.fetch(nftDataPda);
    
    // Создаем ATA для покупателя
    const buyerTokenAccount = await getAssociatedTokenAddress(
      nftData.mint,
      wallet.publicKey
    );

    // Проверяем, существует ли ATA покупателя
    const buyerTokenAccountInfo = await this.connection.getAccountInfo(buyerTokenAccount);
    if (!buyerTokenAccountInfo) {
      // Создаем ATA если не существует
      const createAtaIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        buyerTokenAccount,
        wallet.publicKey,
        nftData.mint
      );
      
      const transaction = new Transaction().add(createAtaIx);
      await this.connection.sendTransaction(transaction, []);
    }

    // Покупаем NFT
    const signature = await this.program.methods
      .buyMusicNft()
      .accounts({
        buyer: wallet.publicKey,
        sellerAuthority: nftData.owner,
        sellerTokenAccount: new PublicKey(sellerTokenAccount),
        buyerTokenAccount: buyerTokenAccount,
        nftData: new PublicKey(nftDataPda),
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return signature;
  }

  static async updateNFTPrice(
    wallet: any,
    nftDataPda: string,
    newPrice: number
  ): Promise<string> {
    if (!this.connection || !this.program) {
      throw new Error('Contract service not initialized');
    }

    if (typeof newPrice !== 'number' || newPrice < 0) {
      throw new Error('Price must be a non-negative number.');
    }

    const signature = await this.program.methods
       .updateNftPrice(new BN(Math.floor(newPrice * 1e9))) // цена в lamports
      .accounts({
        authority: wallet.publicKey,
        nftData: new PublicKey(nftDataPda),
      })
      .rpc();

    return signature;
  }

  static async getUserNFTs(wallet: PublicKey): Promise<any[]> {
    if (!this.connection || !this.program) {
      throw new Error('Contract service not initialized');
    }

    // Получаем все токен аккаунты пользователя
    const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
      wallet,
      { programId: TOKEN_PROGRAM_ID }
    );

    const userNFTs = [];

    for (const account of tokenAccounts.value) {
      const mint = account.account.data.parsed.info.mint;
      
      // Находим PDA для NFT данных
      const [nftDataPda] = await PublicKey.findProgramAddress(
        [Buffer.from("music_nft"), new PublicKey(mint).toBuffer()],
        PROGRAM_ID
      );

      try {
     // Получаем данные NFT
     const nftData = await (this.program.account as any).musicNftData.fetch(nftDataPda);
        
        userNFTs.push({
          mint: mint,
          nftData: nftData,
          nftDataPda: nftDataPda.toString(),
          tokenAccount: account.pubkey.toString(),
          amount: account.account.data.parsed.info.tokenAmount.uiAmount
        });
      } catch (error) {
        // NFT не найден, пропускаем
        console.log('NFT не найден для mint:', mint);
      }
    }

    return userNFTs;
  }

  static async getAvailableNFTs(): Promise<any[]> {
    if (!this.connection || !this.program) {
      throw new Error('Contract service not initialized');
    }

     // Получаем все аккаунты программы
     const accounts = await (this.program.account as any).musicNftData.all();
    
    const availableNFTs = accounts
      .filter((account: any) => account.account.isForSale)
      .map((account: any) => ({
        mint: account.account.mint.toString(),
        nftData: account.account,
        nftDataPda: account.publicKey.toString(),
      }));

    return availableNFTs;
  }
}
