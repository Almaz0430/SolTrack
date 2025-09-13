# 🎵 Music NFT - Интеграция с фронтендом

## 📋 Информация для фронтенд-разработчика

### 🔗 Основные данные смарт-контракта

```javascript
// Основные константы
const PROGRAM_ID = "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T";
const NETWORK = "devnet"; // или "mainnet-beta" для продакшена
const RPC_URL = "https://api.devnet.solana.com";
const EXPLORER_URL = "https://explorer.solana.com/address/9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T?cluster=devnet";
```

## 🛠️ Установка зависимостей

```bash
npm install @solana/web3.js @coral-xyz/anchor @solana/spl-token
npm install @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-phantom @solana/wallet-adapter-solflare
```

## 🔧 Настройка подключения

### 1. Инициализация программы

```javascript
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

// Настройка подключения
const connection = new Connection(RPC_URL, 'confirmed');
const programId = new PublicKey(PROGRAM_ID);

// Загрузка IDL (файл находится в target/idl/music_nft.json)
const idl = require('./target/idl/music_nft.json');

// Создание провайдера (кошелек будет подключен через wallet adapter)
const createProvider = (wallet) => {
  return new AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });
};

const program = new Program(idl, programId);
```

### 2. Настройка Wallet Adapter

```javascript
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Настройка кошельков
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// Обертка приложения
function App() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <YourAppComponent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

## 🎼 Основные функции смарт-контракта

### 1. Создание музыкального NFT

```javascript
import { useWallet } from '@solana/wallet-adapter-react';

function CreateMusicNFT() {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const createNFT = async (nftData) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Кошелек не подключен');
    }

    setLoading(true);
    try {
      // Создаем mint аккаунт
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
      const transaction = new web3.Transaction();

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
          nftData.title,                    // string
          nftData.symbol,                   // string
          nftData.uri,                      // string (IPFS URI)
          nftData.genre,                    // string
          new anchor.BN(nftData.price * 1e9), // u64 (цена в lamports)
          nftData.bpm,                      // u16
          nftData.key                       // string
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
  };

  return { createNFT, loading };
}
```

### 2. Покупка NFT

```javascript
function BuyMusicNFT() {
  const { publicKey, signTransaction } = useWallet();

  const buyNFT = async (nftDataPda, sellerTokenAccount, price) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Кошелек не подключен');
    }

    try {
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
        
        const transaction = new web3.Transaction().add(createAtaIx);
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
    }
  };

  return { buyNFT };
}
```

### 3. Изменение цены NFT

```javascript
function UpdateNFTPrice() {
  const { publicKey } = useWallet();

  const updatePrice = async (nftDataPda, newPrice) => {
    if (!publicKey) {
      throw new Error('Кошелек не подключен');
    }

    try {
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
    }
  };

  return { updatePrice };
}
```

## 📊 Получение данных NFT

### 1. Получение всех NFT пользователя

```javascript
function useUserNFTs() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserNFTs = async () => {
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
  };

  useEffect(() => {
    fetchUserNFTs();
  }, [publicKey]);

  return { nfts, loading, refetch: fetchUserNFTs };
}
```

### 2. Получение всех доступных NFT для покупки

```javascript
function useAvailableNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableNFTs = async () => {
    setLoading(true);
    try {
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
  };

  useEffect(() => {
    fetchAvailableNFTs();
  }, []);

  return { nfts, loading, refetch: fetchAvailableNFTs };
}
```

## 🎨 Пример компонента React

```jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CreateMusicNFT, BuyMusicNFT, useAvailableNFTs } from './hooks';

function MusicNFTMarketplace() {
  const { connected } = useWallet();
  const { createNFT, loading: creating } = CreateMusicNFT();
  const { buyNFT } = BuyMusicNFT();
  const { nfts, loading: loadingNFTs } = useAvailableNFTs();
  const [formData, setFormData] = useState({
    title: '',
    symbol: '',
    uri: '',
    genre: '',
    price: 0,
    bpm: 120,
    key: 'C Major'
  });

  const handleCreateNFT = async (e) => {
    e.preventDefault();
    try {
      const result = await createNFT(formData);
      console.log('NFT создан:', result);
      alert('NFT успешно создан!');
    } catch (error) {
      alert('Ошибка создания NFT: ' + error.message);
    }
  };

  const handleBuyNFT = async (nft) => {
    try {
      const signature = await buyNFT(nft.nftDataPda, nft.sellerTokenAccount, nft.nftData.price);
      console.log('NFT куплен:', signature);
      alert('NFT успешно куплен!');
    } catch (error) {
      alert('Ошибка покупки NFT: ' + error.message);
    }
  };

  if (!connected) {
    return <div>Подключите кошелек для использования</div>;
  }

  return (
    <div className="marketplace">
      <h1>🎵 Music NFT Marketplace</h1>
      
      {/* Форма создания NFT */}
      <form onSubmit={handleCreateNFT}>
        <h2>Создать NFT</h2>
        <input
          type="text"
          placeholder="Название трека"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Символ"
          value={formData.symbol}
          onChange={(e) => setFormData({...formData, symbol: e.target.value})}
          required
        />
        <input
          type="url"
          placeholder="IPFS URI"
          value={formData.uri}
          onChange={(e) => setFormData({...formData, uri: e.target.value})}
          required
        />
        <select
          value={formData.genre}
          onChange={(e) => setFormData({...formData, genre: e.target.value})}
          required
        >
          <option value="">Выберите жанр</option>
          <option value="Electronic">Electronic</option>
          <option value="Rock">Rock</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Jazz">Jazz</option>
        </select>
        <input
          type="number"
          placeholder="Цена в SOL"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
          step="0.01"
          required
        />
        <input
          type="number"
          placeholder="BPM"
          value={formData.bpm}
          onChange={(e) => setFormData({...formData, bpm: parseInt(e.target.value)})}
          required
        />
        <select
          value={formData.key}
          onChange={(e) => setFormData({...formData, key: e.target.value})}
          required
        >
          <option value="C Major">C Major</option>
          <option value="G Major">G Major</option>
          <option value="D Major">D Major</option>
          {/* ... другие тональности */}
        </select>
        <button type="submit" disabled={creating}>
          {creating ? 'Создание...' : 'Создать NFT'}
        </button>
      </form>

      {/* Список доступных NFT */}
      <div className="nft-grid">
        <h2>Доступные NFT</h2>
        {loadingNFTs ? (
          <div>Загрузка...</div>
        ) : (
          nfts.map((nft) => (
            <div key={nft.mint} className="nft-card">
              <h3>{nft.nftData.title}</h3>
              <p>Жанр: {nft.nftData.genre}</p>
              <p>BPM: {nft.nftData.bpm}</p>
              <p>Тональность: {nft.nftData.key}</p>
              <p>Цена: {nft.nftData.price / 1e9} SOL</p>
              <button onClick={() => handleBuyNFT(nft)}>
                Купить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MusicNFTMarketplace;
```

## 🔗 Полезные ссылки

- **Solana Explorer**: https://explorer.solana.com/address/9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T?cluster=devnet
- **Anchor Documentation**: https://www.anchor-lang.com/
- **Solana Web3.js**: https://solana-labs.github.io/solana-web3.js/
- **Wallet Adapter**: https://github.com/solana-labs/wallet-adapter

## 📝 Важные заметки

1. **Цены в lamports**: 1 SOL = 1,000,000,000 lamports
2. **PDA для NFT данных**: `["music_nft", mint_pubkey]`
3. **Обработка ошибок**: Всегда оборачивайте вызовы в try-catch
4. **Подтверждение транзакций**: Используйте `confirmTransaction` для надежности
5. **Обновление данных**: Используйте `refetch` для обновления списков NFT

---

**Готово к интеграции! 🚀**
