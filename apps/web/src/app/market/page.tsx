'use client';

import { useState, useEffect } from 'react';
import { useNFTMarketplace } from '@/hooks/useNFTMarketplace';
import { useNotifications } from '@/hooks/useNotifications';
import { WalletInfo } from '@/components/WalletInfo';
import { NFTCard } from '@/components/NFTCard';
import { TransactionHistory } from '@/components/TransactionHistory';
import { NotificationContainer } from '@/components/NotificationToast';
import { Loader2, RefreshCw } from 'lucide-react';

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedSort, setSelectedSort] = useState('Сортировка');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const { nfts, loading, balance, userNFTs, buyNFT, fetchNFTs, isProcessing } = useNFTMarketplace();
  const { notifications, removeNotification, success, error } = useNotifications();

  const categories = ['Все категории', 'Электронная музыка', 'Хип-хоп', 'Рок', 'Джаз'];
  const sortOptions = ['Сортировка', 'По цене ↑', 'По цене ↓', 'По популярности', 'Новые'];

  const handlePurchaseSuccess = (nft: any, signature: string) => {
    success(
      'NFT успешно куплен!',
      `"${nft.name}" теперь в вашем кошельке. Транзакция: ${signature.slice(0, 8)}...`
    );
  };

  const handlePurchaseError = (nft: any, errorMessage: string) => {
    error(
      'Ошибка покупки NFT',
      `Не удалось купить "${nft.name}": ${errorMessage}`
    );
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setCategoryOpen(false);
      setSortOpen(false);
    };

    if (categoryOpen || sortOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [categoryOpen, sortOpen]);

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 lg:mb-20 space-y-8 lg:space-y-0">
          <div>
            <h1 className="text-4xl lg:text-6xl font-light text-light mb-4">
              Маркетплейс
            </h1>
            <p className="text-xl lg:text-2xl text-muted-light font-light">
              Откройте для себя и торгуйте уникальными музыкальными NFT
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={fetchNFTs}
              disabled={loading}
              className="flex items-center gap-2 bg-dark-card hover:bg-purple-600/20 text-muted-light hover:text-light border border-dark hover:border-purple-600/50 px-4 py-3 rounded-2xl font-medium transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
            {/* Категории */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setCategoryOpen(!categoryOpen);
                  setSortOpen(false);
                }}
                className="w-full sm:w-auto min-w-[200px] bg-dark-card border border-dark rounded-2xl px-6 py-4 text-left font-light text-muted-light hover:border-purple-600/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span>{selectedCategory}</span>
                <svg
                  className={`w-5 h-5 text-muted-light transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark rounded-2xl shadow-lg shadow-black/50 z-10 overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryOpen(false);
                      }}
                      className={`w-full px-6 py-4 text-left font-light hover:bg-purple-600/20 transition-colors ${selectedCategory === category ? 'text-purple-400 bg-purple-600/20' : 'text-muted-light'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Сортировка */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setCategoryOpen(false);
                }}
                className="w-full sm:w-auto min-w-[180px] bg-dark-card border border-dark rounded-2xl px-6 py-4 text-left font-light text-muted-light hover:border-purple-600/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span>{selectedSort}</span>
                <svg
                  className={`w-5 h-5 text-muted-light transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {sortOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark rounded-2xl shadow-lg shadow-black/50 z-10 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortOpen(false);
                      }}
                      className={`w-full px-6 py-4 text-left font-light hover:bg-purple-600/20 transition-colors ${selectedSort === option ? 'text-purple-400 bg-purple-600/20' : 'text-muted-light'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Информация о кошельке */}
          <div className="lg:col-span-1 space-y-6">
            <WalletInfo balance={balance} />
            <TransactionHistory />
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-3 space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-muted-light">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Загрузка NFT...</span>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onBuy={buyNFT}
                    isOwned={userNFTs.includes(nft.mint)}
                    isProcessing={isProcessing}
                    onSuccess={handlePurchaseSuccess}
                    onError={handlePurchaseError}
                  />
                ))}
              </div>
            )}

            {!loading && nfts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-light text-lg">NFT не найдены</p>
                <button
                  onClick={fetchNFTs}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            )}
          </div>
        </div>
        {!loading && nfts.length > 0 && (
          <div className="text-center">
            <button className="bg-dark-card hover:bg-purple-600/20 text-muted-light hover:text-light border border-dark hover:border-purple-600/50 px-10 py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
              Загрузить еще
            </button>
          </div>
        )}

        {/* Уведомления */}
        <NotificationContainer 
          notifications={notifications} 
          onClose={removeNotification} 
        />
      </div>
    </div>
  );
}