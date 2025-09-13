import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// Настройка для devnet
const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
const keypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(require('fs').readFileSync('/home/yaroslav/.config/solana/id.json', 'utf8')))
);
const wallet = new anchor.Wallet(keypair);
const provider = new anchor.AnchorProvider(connection, wallet, {});
anchor.setProvider(provider);

// Загружаем IDL
const idl = require("./target/idl/music_nft.json");
const programId = new PublicKey("9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T");
const program = new anchor.Program(idl, provider);

async function testDevnet() {
  console.log("🚀 Тестирование Music NFT на devnet...");
  console.log("Program ID:", programId.toString());
  console.log("Wallet:", provider.wallet.publicKey.toString());

  try {
    // Создаем mint для NFT
    const mint = anchor.web3.Keypair.generate();
    console.log("Mint:", mint.publicKey.toString());

    // Создаем mint-аккаунт
    const lamportsForMint = await provider.connection.getMinimumBalanceForRentExemption(82);
    const createMintTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: 82,
        lamports: lamportsForMint,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        provider.wallet.publicKey,
        provider.wallet.publicKey
      )
    );
    
    console.log("Создаем mint-аккаунт...");
    const mintTx = await provider.sendAndConfirm(createMintTx, [mint]);
    console.log("Mint создан! Transaction:", mintTx);

    // Создаем ATA для кошелька
    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      provider.wallet.publicKey
    );
    
    console.log("ATA Address:", tokenAccount.toString());
    
    // Проверяем, существует ли ATA
    try {
      await provider.connection.getAccountInfo(tokenAccount);
      console.log("ATA уже существует");
    } catch (error) {
      console.log("Создаем ATA...");
      const createAtaTx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey,
          tokenAccount,
          provider.wallet.publicKey,
          mint.publicKey
        )
      );
      await provider.sendAndConfirm(createAtaTx);
    }

    // Находим PDA для NFT данных
    const [nftDataPda] = await PublicKey.findProgramAddress(
      [Buffer.from("music_nft"), mint.publicKey.toBuffer()],
      programId
    );

    console.log("NFT Data PDA:", nftDataPda.toString());

    // Создаем NFT
    console.log("Создаем музыкальный NFT...");
    const tx = await program.methods
      .createMusicNft(
        "Devnet Track",                 // title
        "DVT",                          // symbol
        "ipfs://QmFakeMetaUri",         // uri
        "Electronic",                   // genre
        new anchor.BN(1000000000),      // price в lamports (1 SOL)
        128,                            // bpm
        "C Major"                       // key
      )
      .accounts({
        authority: provider.wallet.publicKey,
        payer: provider.wallet.publicKey,
        mint: mint.publicKey,
        tokenAccount: tokenAccount,
        nftData: nftDataPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ NFT создан! Transaction:", tx);
    console.log("🎉 Тест успешно завершен!");

  } catch (error) {
    console.error("❌ Ошибка:", error);
  }
}

testDevnet();
