const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");

// Настройка для devnet
const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
const keypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(require('fs').readFileSync('/home/yaroslav/.config/solana/id.json', 'utf8')))
);
const wallet = new anchor.Wallet(keypair);
const provider = new anchor.AnchorProvider(connection, wallet, {});

async function testProgram() {
  console.log("🚀 Проверка Music NFT программы на devnet...");
  console.log("Wallet:", provider.wallet.publicKey.toString());

  try {
    // Проверяем, что программа развернута
    const programId = new PublicKey("9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T");
    const programInfo = await connection.getAccountInfo(programId);
    
    if (programInfo) {
      console.log("✅ Программа развернута!");
      console.log("Program ID:", programId.toString());
      console.log("Owner:", programInfo.owner.toString());
      console.log("Data Length:", programInfo.data.length, "bytes");
      console.log("Executable:", programInfo.executable);
    } else {
      console.log("❌ Программа не найдена");
    }

    // Проверяем баланс кошелька
    const balance = await connection.getBalance(provider.wallet.publicKey);
    console.log("💰 Баланс кошелька:", balance / 1e9, "SOL");

    console.log("🎉 Тест завершен успешно!");

  } catch (error) {
    console.error("❌ Ошибка:", error);
  }
}

testProgram();
