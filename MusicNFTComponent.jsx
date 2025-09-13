import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  useCreateMusicNFT, 
  useBuyMusicNFT, 
  useUpdateNFTPrice,
  useUpdateArtistRoyalty,
  useAvailableNFTs,
  useUserNFTs,
  utils
} from './frontend-hooks';

// Компонент для создания NFT
export function CreateNFTForm() {
  const { connected } = useWallet();
  const { createNFT, loading } = useCreateMusicNFT();
  const [formData, setFormData] = useState({
    title: '',
    symbol: '',
    uri: '',
    genre: '',
    price: 0,
    bpm: 120,
    key: 'C Major',
    artistRoyalty: 500 // 5% по умолчанию
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createNFT(formData);
      console.log('NFT создан:', result);
      alert('NFT успешно создан!');
      // Сброс формы
      setFormData({
        title: '',
        symbol: '',
        uri: '',
        genre: '',
        price: 0,
        bpm: 120,
        key: 'C Major',
        artistRoyalty: 500
      });
    } catch (error) {
      alert('Ошибка создания NFT: ' + error.message);
    }
  };

  if (!connected) {
    return <div className="form-container">Подключите кошелек для создания NFT</div>;
  }

  return (
    <div className="form-container">
      <h2>🎵 Создать музыкальный NFT</h2>
      <form onSubmit={handleSubmit} className="nft-form">
        <div className="form-group">
          <label>Название трека:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Введите название трека"
            required
          />
        </div>

        <div className="form-group">
          <label>Символ:</label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({...formData, symbol: e.target.value})}
            placeholder="Например: MUS"
            required
          />
        </div>

        <div className="form-group">
          <label>IPFS URI метаданных:</label>
          <input
            type="url"
            value={formData.uri}
            onChange={(e) => setFormData({...formData, uri: e.target.value})}
            placeholder="ipfs://QmFakeMetaUri"
            required
          />
        </div>

        <div className="form-group">
          <label>Жанр:</label>
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
            <option value="Classical">Classical</option>
            <option value="Pop">Pop</option>
            <option value="Blues">Blues</option>
            <option value="Country">Country</option>
          </select>
        </div>

        <div className="form-group">
          <label>Цена (SOL):</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            step="0.01"
            min="0"
            placeholder="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>BPM:</label>
          <input
            type="number"
            value={formData.bpm}
            onChange={(e) => setFormData({...formData, bpm: parseInt(e.target.value)})}
            min="60"
            max="200"
            required
          />
        </div>

        <div className="form-group">
          <label>Тональность:</label>
          <select
            value={formData.key}
            onChange={(e) => setFormData({...formData, key: e.target.value})}
            required
          >
            <option value="C Major">C Major</option>
            <option value="C Minor">C Minor</option>
            <option value="D Major">D Major</option>
            <option value="D Minor">D Minor</option>
            <option value="E Major">E Major</option>
            <option value="E Minor">E Minor</option>
            <option value="F Major">F Major</option>
            <option value="F Minor">F Minor</option>
            <option value="G Major">G Major</option>
            <option value="G Minor">G Minor</option>
            <option value="A Major">A Major</option>
            <option value="A Minor">A Minor</option>
            <option value="B Major">B Major</option>
            <option value="B Minor">B Minor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Роялти артиста (%):</label>
          <input
            type="number"
            value={formData.artistRoyalty / 100}
            onChange={(e) => setFormData({...formData, artistRoyalty: parseInt(e.target.value) * 100})}
            min="0"
            max="50"
            step="0.1"
            placeholder="5.0"
            required
          />
          <small>Максимум 50% (5000 базисных пунктов)</small>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Создание...' : 'Создать NFT'}
        </button>
      </form>
    </div>
  );
}

// Компонент для отображения NFT карточки
export function NFTCard({ nft, onBuy, onUpdatePrice, isOwner = false }) {
  const [newPrice, setNewPrice] = useState('');
  const [newRoyalty, setNewRoyalty] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showRoyaltyForm, setShowRoyaltyForm] = useState(false);
  const { updatePrice, loading: updating } = useUpdateNFTPrice();
  const { updateRoyalty, loading: updatingRoyalty } = useUpdateArtistRoyalty();

  const handleUpdatePrice = async () => {
    if (!newPrice) return;
    try {
      await updatePrice(nft.nftDataPda, parseFloat(newPrice));
      alert('Цена обновлена!');
      setShowUpdateForm(false);
      setNewPrice('');
    } catch (error) {
      alert('Ошибка обновления цены: ' + error.message);
    }
  };

  const handleUpdateRoyalty = async () => {
    if (!newRoyalty) return;
    try {
      await updateRoyalty(nft.nftDataPda, parseInt(newRoyalty) * 100);
      alert('Роялти обновлено!');
      setShowRoyaltyForm(false);
      setNewRoyalty('');
    } catch (error) {
      alert('Ошибка обновления роялти: ' + error.message);
    }
  };

  return (
    <div className="nft-card">
      <div className="nft-image">
        <img 
          src={`https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(nft.nftData.title)}`} 
          alt={nft.nftData.title}
        />
      </div>
      
      <div className="nft-info">
        <h3 className="nft-title">{nft.nftData.title}</h3>
        <p className="nft-symbol">{nft.nftData.symbol}</p>
        
        <div className="nft-details">
          <p><strong>Жанр:</strong> {nft.nftData.genre}</p>
          <p><strong>BPM:</strong> {nft.nftData.bpm}</p>
          <p><strong>Тональность:</strong> {nft.nftData.key}</p>
          <p><strong>Цена:</strong> {utils.formatPrice(nft.nftData.price)}</p>
          <p><strong>Роялти артиста:</strong> {(nft.nftData.artistRoyalty / 100).toFixed(1)}%</p>
          <p><strong>Комиссия площадки:</strong> {(nft.nftData.platformFee / 100).toFixed(1)}%</p>
          <p><strong>Статус:</strong> {nft.nftData.isForSale ? 'В продаже' : 'Продано'}</p>
        </div>

        <div className="nft-actions">
          {isOwner ? (
            <div className="owner-actions">
              {showUpdateForm ? (
                <div className="update-form">
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Новая цена в SOL"
                    step="0.01"
                    min="0"
                  />
                  <button onClick={handleUpdatePrice} disabled={updating}>
                    {updating ? 'Обновление...' : 'Обновить цену'}
                  </button>
                  <button onClick={() => setShowUpdateForm(false)}>
                    Отмена
                  </button>
                </div>
              ) : showRoyaltyForm ? (
                <div className="update-form">
                  <input
                    type="number"
                    value={newRoyalty}
                    onChange={(e) => setNewRoyalty(e.target.value)}
                    placeholder="Новое роялти в %"
                    step="0.1"
                    min="0"
                    max="50"
                  />
                  <button onClick={handleUpdateRoyalty} disabled={updatingRoyalty}>
                    {updatingRoyalty ? 'Обновление...' : 'Обновить роялти'}
                  </button>
                  <button onClick={() => setShowRoyaltyForm(false)}>
                    Отмена
                  </button>
                </div>
              ) : (
                <div className="action-buttons">
                  <button onClick={() => setShowUpdateForm(true)}>
                    Изменить цену
                  </button>
                  <button onClick={() => setShowRoyaltyForm(true)}>
                    Изменить роялти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => onBuy(nft)} 
              disabled={!nft.nftData.isForSale}
              className="buy-btn"
            >
              {nft.nftData.isForSale ? 'Купить' : 'Продано'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Основной компонент маркетплейса
export function MusicNFTMarketplace() {
  const { connected } = useWallet();
  const { buyNFT, loading: buying } = useBuyMusicNFT();
  const { nfts: availableNFTs, loading: loadingAvailable } = useAvailableNFTs();
  const { nfts: userNFTs, loading: loadingUser } = useUserNFTs();
  const [activeTab, setActiveTab] = useState('marketplace');

  const handleBuyNFT = async (nft) => {
    try {
      const signature = await buyNFT(nft.nftDataPda, nft.sellerTokenAccount);
      console.log('NFT куплен:', signature);
      alert('NFT успешно куплен!');
    } catch (error) {
      alert('Ошибка покупки NFT: ' + error.message);
    }
  };

  if (!connected) {
    return (
      <div className="marketplace">
        <h1>🎵 Music NFT Marketplace</h1>
        <div className="connect-wallet-message">
          <p>Подключите кошелек для использования маркетплейса</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <h1>🎵 Music NFT Marketplace</h1>
      
      {/* Навигация */}
      <div className="tabs">
        <button 
          className={activeTab === 'marketplace' ? 'active' : ''}
          onClick={() => setActiveTab('marketplace')}
        >
          Маркетплейс
        </button>
        <button 
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Создать NFT
        </button>
        <button 
          className={activeTab === 'my-nfts' ? 'active' : ''}
          onClick={() => setActiveTab('my-nfts')}
        >
          Мои NFT
        </button>
      </div>

      {/* Контент вкладок */}
      <div className="tab-content">
        {activeTab === 'marketplace' && (
          <div>
            <h2>Доступные NFT</h2>
            {loadingAvailable ? (
              <div className="loading">Загрузка NFT...</div>
            ) : (
              <div className="nft-grid">
                {availableNFTs.map((nft) => (
                  <NFTCard
                    key={nft.mint}
                    nft={nft}
                    onBuy={handleBuyNFT}
                    isOwner={false}
                  />
                ))}
                {availableNFTs.length === 0 && (
                  <div className="no-nfts">NFT не найдены</div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <CreateNFTForm />
        )}

        {activeTab === 'my-nfts' && (
          <div>
            <h2>Мои NFT</h2>
            {loadingUser ? (
              <div className="loading">Загрузка ваших NFT...</div>
            ) : (
              <div className="nft-grid">
                {userNFTs.map((nft) => (
                  <NFTCard
                    key={nft.mint}
                    nft={nft}
                    onUpdatePrice={() => {}}
                    isOwner={true}
                  />
                ))}
                {userNFTs.length === 0 && (
                  <div className="no-nfts">У вас пока нет NFT</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Стили (можно вынести в отдельный CSS файл)
export const styles = `
.marketplace {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tabs button.active {
  border-bottom-color: #667eea;
  color: #667eea;
  font-weight: bold;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.nft-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.nft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.nft-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.nft-card:hover {
  transform: translateY(-5px);
}

.nft-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.nft-info {
  padding: 20px;
}

.nft-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.nft-symbol {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.nft-details {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.nft-details p {
  margin: 5px 0;
}

.nft-actions {
  display: flex;
  gap: 10px;
}

.buy-btn {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  flex: 1;
}

.buy-btn:hover {
  background: #218838;
}

.buy-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.update-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.update-form input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.update-form button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.owner-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.action-buttons button:hover {
  background: #667eea;
  color: white;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-nfts {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.connect-wallet-message {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 10px;
  color: #666;
}
`;
