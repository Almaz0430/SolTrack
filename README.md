# 🎵 Music NFT Marketplace

Полнофункциональный смарт-контракт для создания, продажи и покупки музыкальных NFT на блокчейне Solana.

## ✨ Возможности

### 🎼 Создание музыкальных NFT
- **Расширенные метаданные**: название, жанр, BPM, тональность, цена
- **Поддержка файлов**: загрузка обложки и аудио файлов в IPFS
- **Автоматический минт**: создание NFT с привязкой к метаданным

### 💰 Торговая функциональность
- **Продажа NFT**: установка цены в SOL
- **Покупка NFT**: безопасные транзакции с переводом средств
- **Управление ценой**: возможность изменения цены владельцем

### 🔒 Безопасность
- **Проверка прав**: только владелец может изменять цену
- **Валидация**: проверка достаточности средств при покупке
- **PDA аккаунты**: безопасное хранение данных NFT

## 🏗️ Архитектура

### Смарт-контракт (Rust + Anchor)
```rust
// Основные функции
pub fn create_music_nft()    // Создание NFT
pub fn buy_music_nft()       // Покупка NFT  
pub fn update_nft_price()    // Изменение цены
```

### Структура данных NFT
```rust
pub struct MusicNftData {
    pub title: String,           // Название трека/альбома
    pub symbol: String,          // Символ
    pub uri: String,             // URI метаданных в IPFS
    pub genre: String,           // Жанр
    pub price: u64,              // Цена в lamports
    pub bpm: u16,                // BPM
    pub key: String,             // Тональность
    pub owner: Pubkey,           // Владелец NFT
    pub mint: Pubkey,            // Mint аккаунт
    pub amount: u32,             // Общее количество копий
    pub amount_sold: u32,        // Количество проданных копий
    pub is_for_sale: bool,       // Продается ли NFT
}
```

## 🚀 Установка и запуск

### Требования
- Rust 1.70+
- Solana CLI 1.16+
- Anchor Framework 0.31+
- Node.js 16+
- Yarn

### Установка зависимостей
```bash
# Установка Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Установка Anchor
npm install -g @coral-xyz/anchor-cli

# Установка зависимостей проекта
yarn install
```

### Запуск тестов
```bash
# Запуск локального кластера
solana-test-validator --reset

# В другом терминале - запуск тестов
anchor test
```

### Сборка и развертывание
```bash
# Сборка программы
anchor build

# Развертывание на devnet
anchor deploy --provider.cluster devnet
```

## 📱 Фронтенд интеграция

### Пример использования с @solana/web3.js
```javascript
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

// Подключение к программе
const program = new Program(idl, programId, provider);

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

// Покупка NFT
const buyTx = await program.methods
  .buyMusicNft()
  .accounts({
    buyer: buyer.publicKey,
    sellerAuthority: seller.publicKey,
    sellerTokenAccount: sellerTokenAccount,
    buyerTokenAccount: buyerTokenAccount,
    nftData: nftDataPda,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Интеграция с кошельками
```javascript
// Phantom Wallet
const provider = window.solana;
if (provider.isPhantom) {
  await provider.connect();
  const publicKey = provider.publicKey;
}

// Solflare Wallet
const provider = window.solflare;
if (provider.isSolflare) {
  await provider.connect();
  const publicKey = provider.publicKey;
}
```

## 🎨 UI/UX Функции

### Форма создания NFT
- Поле для названия трека/альбома
- Поле для описания
- Загрузка обложки (image)
- Загрузка файла трека (mp3/wav)
- Выбор жанра, BPM, тональности
- Установка цены в SOL
- Кнопка "Загрузить и Минтить"

### Отображение NFT
- Карточки с превью
- Название и метаданные
- Цена в SOL
- Кнопка "Купить"
- Статус продажи

### Процесс покупки
1. Открытие модалки кошелька
2. Подтверждение транзакции
3. Перевод NFT в кошелек покупателя
4. Обновление статуса продажи

## 🔧 Конфигурация

### Anchor.toml
```toml
[programs.localnet]
music_nft = "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T"

[provider]
cluster = "http://127.0.0.1:8899"
wallet = "~/.config/solana/id.json"
```

### Переменные окружения
```bash
# .env
SOLANA_RPC_URL=https://api.devnet.solana.com
WALLET_PRIVATE_KEY=your_private_key
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
```

## 📊 Структура проекта

```
music_nft/
├── programs/
│   └── music_nft/
│       └── src/
│           └── lib.rs          # Основной смарт-контракт
├── tests/
│   └── music_nft.ts            # Тесты
├── target/
│   └── deploy/
│       └── music_nft.so        # Скомпилированная программа
├── frontend-example.html        # Пример фронтенда
├── Anchor.toml                  # Конфигурация Anchor
└── README.md                    # Документация
```

## 🧪 Тестирование

### Запуск тестов
```bash
# Все тесты
anchor test

# Только unit тесты
cargo test

# Только integration тесты
yarn test
```

### Покрытие тестами
- ✅ Создание NFT с метаданными
- ✅ Покупка NFT
- ✅ Изменение цены
- ✅ Валидация прав доступа
- ✅ Обработка ошибок

## 🚀 Развертывание

### Локальная разработка
```bash
solana-test-validator --reset
anchor test
```

### Devnet
```bash
solana config set --url devnet
anchor deploy --provider.cluster devnet
```

### Mainnet
```bash
solana config set --url mainnet-beta
anchor deploy --provider.cluster mainnet-beta
```

## 📝 API Reference

### create_music_nft
Создает новый музыкальный NFT с метаданными.

**Параметры:**
- `title: String` - Название трека
- `symbol: String` - Символ NFT
- `uri: String` - URI метаданных в IPFS
- `genre: String` - Жанр музыки
- `price: u64` - Цена в lamports
- `bpm: u16` - BPM трека
- `key: String` - Тональность

### buy_music_nft
Покупает существующий NFT.

**Требования:**
- NFT должен быть в продаже
- У покупателя должно быть достаточно SOL
- Должны быть созданы токен аккаунты

### update_nft_price
Изменяет цену NFT (только для владельца).

**Параметры:**
- `new_price: u64` - Новая цена в lamports

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:
- Создайте Issue в GitHub
- Обратитесь к документации Solana
- Изучите примеры в папке examples/

---

**Создано с ❤️ для музыкального сообщества Solana**
