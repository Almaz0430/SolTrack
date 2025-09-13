# 🚀 Music NFT - Развертывание на Devnet

## ✅ Статус развертывания

**Программа успешно развернута на Solana Devnet!**

- **Program ID**: `9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T`
- **Сеть**: Solana Devnet
- **RPC URL**: `https://api.devnet.solana.com`
- **Статус**: ✅ Активна и готова к использованию

## 📊 Информация о программе

```
Program ID: 9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T
Owner: BPFLoaderUpgradeab1e11111111111111111111111
Data Length: 36 bytes
Executable: true
```

## 🔧 Конфигурация

### Anchor.toml
```toml
[programs.devnet]
music_nft = "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"
```

### Solana CLI
```bash
# Настройка для devnet
solana config set --url devnet

# Проверка конфигурации
solana config get
```

## 🧪 Тестирование

### Простая проверка
```bash
node simple-test.js
```

### Полное тестирование
```bash
# Запуск локального кластера
solana-test-validator --reset

# В другом терминале
anchor test
```

## 📱 Интеграция с фронтендом

### JavaScript/TypeScript
```javascript
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

// Подключение к devnet
const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T');

// Загрузка IDL
const idl = require('./target/idl/music_nft.json');
const program = new Program(idl, programId, provider);
```

### Web3.js
```javascript
// Создание NFT
const tx = await program.methods
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
```

## 🔗 Полезные ссылки

- **Solana Explorer**: https://explorer.solana.com/address/9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T?cluster=devnet
- **Solana Devnet Faucet**: https://faucet.solana.com/
- **Anchor Documentation**: https://www.anchor-lang.com/

## 📋 Доступные функции

### 1. create_music_nft
Создает новый музыкальный NFT с метаданными.

**Параметры:**
- `title: String` - Название трека
- `symbol: String` - Символ NFT
- `uri: String` - URI метаданных в IPFS
- `genre: String` - Жанр музыки
- `price: u64` - Цена в lamports
- `bpm: u16` - BPM трека
- `key: String` - Тональность

### 2. buy_music_nft
Покупает существующий NFT.

### 3. update_nft_price
Изменяет цену NFT (только для владельца).

## 🛠️ Развертывание на Mainnet

Для развертывания на mainnet:

1. Измените кластер в `Anchor.toml`:
```toml
[provider]
cluster = "mainnet-beta"
```

2. Убедитесь, что у вас есть достаточно SOL для развертывания

3. Разверните программу:
```bash
anchor deploy --provider.cluster mainnet-beta
```

## 📞 Поддержка

Если у вас есть вопросы или проблемы:
- Создайте Issue в GitHub
- Обратитесь к документации Solana
- Проверьте логи транзакций в Solana Explorer

---

**🎵 Music NFT Marketplace - Готов к использованию на Devnet!**
