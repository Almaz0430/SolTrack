const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram, Transaction } = require("@solana/web3.js");
const {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");

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
const program = new anchor.Program(idl, programId, provider);

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
    await provider.sendAndConfirm(createMintTx, [mint]);

    // Создаем ATA для кошелька
    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      provider.wallet.publicKey
    );
    const createAtaTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        tokenAccount,
        provider.wallet.publicKey,
        mint.publicKey
      )
    );
    
    console.log("Создаем ATA...");
    await provider.sendAndConfirm(createAtaTx);

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

    // Проверяем данные NFT
    const nftData = await program.account.musicNftData.fetch(nftDataPda);
    console.log("📊 NFT Data:", {
      title: nftData.title,
      genre: nftData.genre,
      price: nftData.price.toString(),
      bpm: nftData.bpm,
      key: nftData.key,
      isForSale: nftData.isForSale,
      owner: nftData.owner.toString()
    });

    console.log("🎉 Тест успешно завершен!");

  } catch (error) {
    console.error("❌ Ошибка:", error);
  }
}

testDevnet();
