'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaService, DropData } from '@/lib/solana';
import { Music, Flame, Clock, CheckCircle } from 'lucide-react';

export default function DropsPage() {
  const wallet = useWallet();
  const [drops, setDrops] = useState<DropData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDrops();
  }, []);

  const loadDrops = async () => {
    try {
      setIsLoading(true);
      const dropsData = await SolanaService.getDrops();
      setDrops(dropsData);
    } catch (err) {
      console.error('Error loading drops:', err);
      setError('Не удалось загрузить дропы');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (dropId: string) => {
    if (!wallet.publicKey) {
      alert('Подключите кошелек для покупки');
      return;
    }

    try {
      const signature = await SolanaService.purchaseNFT(wallet, dropId);
      alert(`NFT успешно куплен! Подпись транзакции: ${signature}`);
      // Обновляем данные дропов
      await loadDrops();
    } catch (err) {
      console.error('Purchase error:', err);
      alert(err instanceof Error ? err.message : 'Ошибка при покупке NFT');
    }
  };

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Завершен';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} дн. ${hours} ч.`;
    return `${hours} ч.`;
  };

  const getDropStatus = (drop: DropData) => {
    const now = Date.now();
    
    if (now < drop.startTime) {
      return { status: 'upcoming', label: 'Скоро', color: 'blue', icon: Clock };
    }
    
    if (now > drop.endTime || drop.currentSupply >= drop.totalSupply) {
      return { status: 'ended', label: 'Завершен', color: 'gray', icon: CheckCircle };
    }
    
    return { status: 'active', label: 'Активный', color: 'green', icon: Flame };
  };

  if (isLoading) {
    return (
      <div className="bg-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-purple-600/30">
              <Music className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>
            <p className="text-xl text-muted-light">Загружаем дропы...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={loadDrops}
              className="accent-purple text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16 lg:mb-20">
          <h1 className="text-4xl lg:text-6xl font-light text-light mb-6">
            Музыкальные дропы
          </h1>
          <p className="text-xl lg:text-2xl text-muted-light font-light max-w-3xl mx-auto leading-relaxed">
            Эксклюзивные релизы от ведущих артистов. Не упустите возможность стать владельцем уникальных музыкальных NFT
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {drops.map((drop) => {
            const dropStatus = getDropStatus(drop);
            const progress = (drop.currentSupply / drop.totalSupply) * 100;
            const isEnded = dropStatus.status === 'ended';
            const isUpcoming = dropStatus.status === 'upcoming';
            
            return (
              <div 
                key={drop.id}
                className={`bg-dark-card rounded-3xl p-8 border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 hover:border-purple-600/50 ${isEnded ? 'opacity-60' : ''}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className={`px-4 py-2 rounded-2xl text-sm font-medium border flex items-center space-x-2 ${
                      dropStatus.color === 'green' 
                        ? 'bg-green-600/20 text-green-400 border-green-600/30'
                        : dropStatus.color === 'blue'
                        ? 'bg-blue-600/20 text-blue-400 border-blue-600/30'
                        : 'bg-gray-800 text-muted-light border-gray-700'
                    }`}>
                      <dropStatus.icon className="w-4 h-4" />
                      <span>{dropStatus.label}</span>
                    </span>
                    <span className="text-sm text-muted-light font-light">
                      {isUpcoming 
                        ? `через ${formatTimeRemaining(drop.startTime)}`
                        : isEnded 
                        ? 'завершен'
                        : `${formatTimeRemaining(drop.endTime)} осталось`
                      }
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-medium text-light">{drop.name}</h3>
                    <p className="text-muted-light font-light">by {drop.artist}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {isUpcoming ? (
                      <>
                        <p className="text-muted-light font-light">{drop.description}</p>
                        <p className="text-2xl font-medium text-light">{drop.price} SOL за NFT</p>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm text-muted-light">
                          <span>Продано: {drop.currentSupply}/{drop.totalSupply}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isEnded ? 'bg-green-500' : 'bg-purple-600'
                            }`}
                            style={{width: `${progress}%`}}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handlePurchase(drop.id)}
                    disabled={isEnded || isUpcoming || !wallet.publicKey}
                    className={`w-full py-4 rounded-2xl font-medium transition-all duration-200 ${
                      isEnded || isUpcoming || !wallet.publicKey
                        ? 'bg-gray-800 text-muted-light cursor-not-allowed border border-dark'
                        : 'accent-purple text-white hover:scale-105 shadow-lg shadow-purple-600/25'
                    }`}
                  >
                    {isUpcoming 
                      ? 'Дроп не начался'
                      : isEnded 
                      ? 'Дроп завершен'
                      : !wallet.publicKey
                      ? 'Подключите кошелек'
                      : `Купить за ${drop.price} SOL`
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-20">
          <p className="text-xl text-muted-light font-light mb-8">Хотите быть в курсе новых дропов?</p>
          <button className="accent-purple text-white px-10 py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25">
            Подписаться на уведомления
          </button>
        </div>
      </div>
    </div>
  );
}