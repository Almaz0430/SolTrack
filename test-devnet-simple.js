const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey } = require('@solana/web3.js');

async function testDevnet() {
  try {
    console.log('🔍 Проверяем подключение к devnet...');
    
    // Подключаемся к devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Проверяем подключение
    const version = await connection.getVersion();
    console.log('✅ Подключение к devnet успешно!');
    console.log('📊 Версия Solana:', version);
    
    // Проверяем программу
    const programId = new PublicKey('9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T');
    const programInfo = await connection.getAccountInfo(programId);
    
    if (programInfo) {
      console.log('✅ Программа найдена на devnet!');
      console.log('📦 Размер программы:', programInfo.data.length, 'байт');
      console.log('💰 Баланс программы:', programInfo.lamports / 1e9, 'SOL');
    } else {
      console.log('❌ Программа не найдена на devnet');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testDevnet();
