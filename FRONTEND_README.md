# 🎵 Music NFT - Руководство для фронтенд-разработчика

## 📋 Быстрый старт

### 1. Установка зависимостей

```bash
npm install @solana/web3.js @coral-xyz/anchor @solana/spl-token
npm install @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-phantom @solana/wallet-adapter-solflare
```

### 2. Основные данные смарт-контракта

```javascript
const PROGRAM_ID = "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T";
const NETWORK = "devnet";
const RPC_URL = "https://api.devnet.solana.com";
```

### 3. Настройка приложения

```jsx
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

function App() {
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MusicNFTMarketplace />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

## 🎯 Новые возможности с системой роялти

### Создание NFT с роялти:

```javascript
const nftData = {
  title: "My Track",
  symbol: "MUS",
  uri: "ipfs://QmFakeMetaUri",
  genre: "Electronic",
  price: 0.1, // 0.1 SOL
  bpm: 128,
  key: "C Major",
  artistRoyalty: 500, // 5% роялти (500 базисных пунктов)
  platformWallet: "PLATFORM_WALLET_ADDRESS" // Кошелек площадки
};

const result = await createNFT(nftData);
```

### Покупка NFT с автоматическим распределением платежей:

```javascript
const signature = await buyNFT(
  nftDataPda,
  sellerTokenAccount,
  artistWallet,    // Кошелек артиста для роялти
  platformWallet   // Кошелек площадки для комиссии
);
```

### Изменение роялти (только для владельца):

```javascript
const signature = await updateRoyalty(
  nftDataPda,
  1000 // 10% роялти (1000 базисных пунктов)
);
```

## 🛠️ Готовые компоненты

### Используйте готовые файлы:

1. **`frontend-hooks.js`** - React хуки для работы с смарт-контрактом
2. **`MusicNFTComponent.jsx`** - Готовые React компоненты
3. **`frontend-config.js`** - Конфигурация приложения

### Пример использования:

```jsx
import { MusicNFTMarketplace } from './MusicNFTComponent';
import { useCreateMusicNFT, useBuyMusicNFT } from './frontend-hooks';

function App() {
  return <MusicNFTMarketplace />;
}
```

## 🎼 Основные функции

### 1. Создание NFT

```javascript
const { createNFT, loading } = useCreateMusicNFT();

const nftData = {
  title: "My Track",
  symbol: "MUS", 
  uri: "ipfs://QmFakeMetaUri",
  genre: "Electronic",
  price: 0.1, // в SOL
  bpm: 128,
  key: "C Major"
};

const result = await createNFT(nftData);
```

### 2. Покупка NFT

```javascript
const { buyNFT, loading } = useBuyMusicNFT();

const signature = await buyNFT(nftDataPda, sellerTokenAccount);
```

### 3. Получение NFT

```javascript
const { nfts, loading } = useAvailableNFTs(); // Все доступные NFT
const { nfts: userNFTs } = useUserNFTs(); // NFT пользователя
```

## 📱 Полный пример приложения

```jsx
import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { MusicNFTMarketplace } from './MusicNFTComponent';

function App() {
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
            <header>
              <h1>🎵 Music NFT Marketplace</h1>
            </header>
            <main>
              <MusicNFTMarketplace />
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

## 🎨 Стилизация

Добавьте CSS стили из `MusicNFTComponent.jsx` в ваш CSS файл:

```css
/* Скопируйте стили из styles в MusicNFTComponent.jsx */
.marketplace { /* ... */ }
.nft-card { /* ... */ }
.form-container { /* ... */ }
/* и т.д. */
```

## 🔧 Настройка окружения

Создайте файл `.env`:

```env
REACT_APP_SOLANA_NETWORK=devnet
REACT_APP_RPC_URL=https://api.devnet.solana.com
REACT_APP_PROGRAM_ID=9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T
REACT_APP_PINATA_API_KEY=your_pinata_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret
```

## 📊 Структура данных NFT

```javascript
const nftData = {
  title: "String",           // Название трека
  symbol: "String",          // Символ NFT
  uri: "String",             // URI метаданных в IPFS
  genre: "String",           // Жанр музыки
  price: "u64",              // Цена в lamports
  bpm: "u16",                // BPM трека
  key: "String",             // Тональность
  owner: "Pubkey",           // Владелец NFT
  mint: "Pubkey",            // Mint аккаунт
  amount: "u32",             // Общее количество копий
  amountSold: "u32",         // Количество проданных копий
  isForSale: "bool"          // Продается ли NFT
};
```

## 🚀 Развертывание

### Для разработки (devnet):
```bash
npm start
```

### Для продакшена (mainnet):
1. Обновите `frontend-config.js`:
```javascript
const CONFIG = {
  NETWORK: "mainnet-beta",
  RPC_URL: "https://api.mainnet-beta.solana.com",
  // ... остальные настройки
};
```

2. Соберите приложение:
```bash
npm run build
```

## 🔗 Полезные ссылки

- **Solana Explorer**: https://explorer.solana.com/address/9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T?cluster=devnet
- **Документация Solana**: https://docs.solana.com/
- **Anchor Framework**: https://www.anchor-lang.com/
- **Wallet Adapter**: https://github.com/solana-labs/wallet-adapter

## 📝 Важные заметки

1. **Цены**: Всегда конвертируйте SOL в lamports (1 SOL = 1,000,000,000 lamports)
2. **Обработка ошибок**: Обязательно используйте try-catch для всех вызовов
3. **Подтверждение транзакций**: Используйте `confirmTransaction` для надежности
4. **Обновление данных**: Используйте `refetch` для обновления списков NFT
5. **PDA**: PDA для NFT данных создается как `["music_nft", mint_pubkey]`

## 🆘 Поддержка

Если у вас есть вопросы:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что кошелек подключен
3. Проверьте, что у пользователя достаточно SOL
4. Обратитесь к документации Solana

---

**Готово к использованию! 🎉**
