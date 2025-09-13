import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { MusicNft } from "../target/types/music_nft";
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("music_nft", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.MusicNft as anchor.Program<MusicNft>;
  const wallet = provider.wallet;

  it("Минт музыкального NFT", async () => {
    const mint = anchor.web3.Keypair.generate();

    // Упрощенная версия без Metaplex

    // Создаем mint-аккаунт
    const lamportsForMint = await provider.connection.getMinimumBalanceForRentExemption(82);
    const createMintTx = new Transaction().add(
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
    await provider.sendAndConfirm(createMintTx, [mint]);

    // Создаем ATA для кошелька
    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );
    const createAtaTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        tokenAccount,
        wallet.publicKey,
        mint.publicKey
      )
    );
    await provider.sendAndConfirm(createAtaTx);

    // Находим PDA для NFT данных
    const [nftDataPda] = await PublicKey.findProgramAddress(
      [Buffer.from("music_nft"), mint.publicKey.toBuffer()],
      program.programId
    );

    // RPC вызов Anchor с расширенными метаданными
    await program.methods
      .createMusicNft(
        "My Track",                    // title
        "MUS",                         // symbol
        "ipfs://QmFakeMetaUri",        // uri
        "Electronic",                  // genre
        new anchor.BN(1000000000),     // price в lamports (1 SOL)
        128,                           // bpm
        "C Major"                      // key
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
      .rpc();

    console.log("✅ NFT заминчен:", mint.publicKey.toBase58());

    // Проверяем данные NFT
    const nftData = await program.account.musicNftData.fetch(nftDataPda);
    console.log("NFT Data:", {
      title: nftData.title,
      genre: nftData.genre,
      price: nftData.price.toString(),
      bpm: nftData.bpm,
      key: nftData.key,
      isForSale: nftData.isForSale
    });
  });

  it("Покупка музыкального NFT", async () => {
    // Создаем NFT для продажи
    const mint = anchor.web3.Keypair.generate();
    const buyer = anchor.web3.Keypair.generate();

    // Даем покупателю SOL
    const airdropSignature = await provider.connection.requestAirdrop(
      buyer.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    // Создаем mint-аккаунт
    const lamportsForMint = await provider.connection.getMinimumBalanceForRentExemption(82);
    const createMintTx = new Transaction().add(
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
    await provider.sendAndConfirm(createMintTx, [mint]);

    // Создаем ATA для продавца
    const sellerTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );
    const createSellerAtaTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        sellerTokenAccount,
        wallet.publicKey,
        mint.publicKey
      )
    );
    await provider.sendAndConfirm(createSellerAtaTx);

    // Создаем ATA для покупателя
    const buyerTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      buyer.publicKey
    );
    const createBuyerAtaTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        buyerTokenAccount,
        buyer.publicKey,
        mint.publicKey
      )
    );
    await provider.sendAndConfirm(createBuyerAtaTx);

    // Находим PDA для NFT данных
    const [nftDataPda] = await PublicKey.findProgramAddress(
      [Buffer.from("music_nft"), mint.publicKey.toBuffer()],
      program.programId
    );

    // Создаем NFT
    await program.methods
      .createMusicNft(
        "Track for Sale",
        "TFS",
        "ipfs://QmFakeMetaUri",
        "Rock",
        new anchor.BN(500000000), // 0.5 SOL
        140,
        "G Major"
      )
      .accounts({
        authority: wallet.publicKey,
        payer: wallet.publicKey,
        mint: mint.publicKey,
        tokenAccount: sellerTokenAccount,
        nftData: nftDataPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Покупаем NFT
    await program.methods
      .buyMusicNft()
      .accounts({
        buyer: buyer.publicKey,
        sellerAuthority: wallet.publicKey,
        sellerTokenAccount: sellerTokenAccount,
        buyerTokenAccount: buyerTokenAccount,
        nftData: nftDataPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    console.log("✅ NFT успешно куплен!");
  });
});
