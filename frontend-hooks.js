// React хуки для работы с Music NFT смарт-контрактом
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction
} from '@solana/spl-token';

// Константы
const PROGRAM_ID = "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T";
const RPC_URL = "https://api.devnet.solana.com";

// Инициализация
const connection = new Connection(RPC_URL, 'confirmed');
const programId = new PublicKey(PROGRAM_ID);

// Загрузите IDL из target/idl/music_nft.json
const idl = require('./target/idl/music_nft.json');

// Создание программы
const createProgram = (wallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });
  return new Program(idl, programId, provider);
};

// Хук для создания NFT
export function useCreateMusicNFT() {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const createNFT = useCallback(async (nftData) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Кошелек не подключен');
    }

    setLoading(true);
    try {
      const program = createProgram({ publicKey, signTransaction });
      const mint = web3.Keypair.generate();
      
      // Получаем lamports для mint
      const lamportsForMint = await connection.getMinimumBalanceForRentExemption(82);
      
      // Создаем ATA
      const tokenAccount = await getAssociatedTokenAddress(
        mint.publicKey,
        publicKey
      );

      // Находим PDA для NFT данных
      const [nftDataPda] = await PublicKey.findProgramAddress(
        [Buffer.from("music_nft"), mint.publicKey.toBuffer()],
        programId
      );

      // Создаем транзакцию
      const transaction = new Transaction();

      // Добавляем создание mint аккаунта
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          space: 82,
          lamports: lamportsForMint,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mint.publicKey,
          0,
          publicKey,
          publicKey
        )
      );

      // Добавляем создание ATA
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          tokenAccount,
          publicKey,
          mint.publicKey
        )
      );

      // Добавляем вызов смарт-контракта
      const createNFTIx = await program.methods
        .createMusicNft(
          nftData.title,
          nftData.symbol,
          nftData.uri,
          nftData.genre,
          new anchor.BN(nftData.price * 1e9), // цена в lamports
          nftData.bpm,
          nftData.key
        )
        .accounts({
          authority: publicKey,
          payer: publicKey,
          mint: mint.publicKey,
          tokenAccount: tokenAccount,
          nftData: nftDataPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      transaction.add(createNFTIx);

      // Отправляем транзакцию
      const signature = await connection.sendTransaction(transaction, [mint], {
        preflightCommitment: 'processed',
      });

      await connection.confirmTransaction(signature, 'processed');
      
      return {
        signature,
        mint: mint.publicKey.toString(),
        nftDataPda: nftDataPda.toString()
      };

    } catch (error) {
      console.error('Ошибка создания NFT:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction]);

  return { createNFT, loading };
}

// Хук для покупки NFT
export function useBuyMusicNFT() {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const buyNFT = useCallback(async (nftDataPda, sellerTokenAccount) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Кошелек не подключен');
    }

    setLoading(true);
    try {
      const program = createProgram({ publicKey, signTransaction });
      
      // Получаем данные NFT
      const nftData = await program.account.MusicNftData.fetch(nftDataPda);
      
      // Создаем ATA для покупателя
      const buyerTokenAccount = await getAssociatedTokenAddress(
        nftData.mint,
        publicKey
      );

      // Проверяем, существует ли ATA покупателя
      const buyerTokenAccountInfo = await connection.getAccountInfo(buyerTokenAccount);
      if (!buyerTokenAccountInfo) {
        // Создаем ATA если не существует
        const createAtaIx = createAssociatedTokenAccountInstruction(
          publicKey,
          buyerTokenAccount,
          publicKey,
          nftData.mint
        );
        
        const transaction = new Transaction().add(createAtaIx);
        await connection.sendTransaction(transaction, []);
      }

      // Покупаем NFT
      const signature = await program.methods
        .buyMusicNft()
        .accounts({
          buyer: publicKey,
          sellerAuthority: nftData.owner,
          sellerTokenAccount: sellerTokenAccount,
          buyerTokenAccount: buyerTokenAccount,
          nftData: nftDataPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return signature;

    } catch (error) {
      console.error('Ошибка покупки NFT:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction]);

  return { buyNFT, loading };
}

// Хук для изменения цены NFT
export function useUpdateNFTPrice() {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const updatePrice = useCallback(async (nftDataPda, newPrice) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Кошелек не подключен');
    }

    setLoading(true);
    try {
      const program = createProgram({ publicKey, signTransaction });
      
      const signature = await program.methods
        .updateNftPrice(new anchor.BN(newPrice * 1e9)) // цена в lamports
        .accounts({
          authority: publicKey,
          nftData: nftDataPda,
        })
        .rpc();

      return signature;

    } catch (error) {
      console.error('Ошибка изменения цены:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction]);

  return { updatePrice, loading };
}

// Хук для получения NFT пользователя
export function useUserNFTs() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserNFTs = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      // Получаем все токен аккаунты пользователя
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const userNFTs = [];

      for (const account of tokenAccounts.value) {
        const mint = account.account.data.parsed.info.mint;
        
        // Находим PDA для NFT данных
        const [nftDataPda] = await PublicKey.findProgramAddress(
          [Buffer.from("music_nft"), new PublicKey(mint).toBuffer()],
          programId
        );

        try {
          // Получаем данные NFT
          const program = createProgram({ publicKey });
          const nftData = await program.account.MusicNftData.fetch(nftDataPda);
          
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

      setNfts(userNFTs);
    } catch (error) {
      console.error('Ошибка получения NFT:', error);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchUserNFTs();
  }, [fetchUserNFTs]);

  return { nfts, loading, refetch: fetchUserNFTs };
}

// Хук для получения всех доступных NFT
export function useAvailableNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableNFTs = useCallback(async () => {
    setLoading(true);
    try {
      // Создаем программу без кошелька для чтения
      const program = new Program(idl, programId, connection);
      
      // Получаем все аккаунты программы
      const accounts = await program.account.MusicNftData.all();
      
      const availableNFTs = accounts
        .filter(account => account.account.isForSale)
        .map(account => ({
          mint: account.account.mint.toString(),
          nftData: account.account,
          nftDataPda: account.publicKey.toString(),
        }));

      setNfts(availableNFTs);
    } catch (error) {
      console.error('Ошибка получения доступных NFT:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableNFTs();
  }, [fetchAvailableNFTs]);

  return { nfts, loading, refetch: fetchAvailableNFTs };
}

// Хук для получения конкретного NFT
export function useNFT(nftDataPda) {
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNFT = useCallback(async () => {
    if (!nftDataPda) return;

    setLoading(true);
    try {
      const program = new Program(idl, programId, connection);
      const nftData = await program.account.MusicNftData.fetch(nftDataPda);
      
      setNft({
        nftData: nftData,
        nftDataPda: nftDataPda,
      });
    } catch (error) {
      console.error('Ошибка получения NFT:', error);
    } finally {
      setLoading(false);
    }
  }, [nftDataPda]);

  useEffect(() => {
    fetchNFT();
  }, [fetchNFT]);

  return { nft, loading, refetch: fetchNFT };
}

// Утилиты
export const utils = {
  // Конвертация lamports в SOL
  lamportsToSol: (lamports) => lamports / 1e9,
  
  // Конвертация SOL в lamports
  solToLamports: (sol) => Math.floor(sol * 1e9),
  
  // Форматирование цены
  formatPrice: (lamports) => `${(lamports / 1e9).toFixed(4)} SOL`,
  
  // Получение PDA для NFT данных
  getNFTDataPDA: async (mint) => {
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("music_nft"), new PublicKey(mint).toBuffer()],
      programId
    );
    return pda;
  }
};
