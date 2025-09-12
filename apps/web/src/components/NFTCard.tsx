'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Music, ExternalLink, User, Clock, Zap, CheckCircle } from 'lucide-react';
import { NFTListing } from '@/hooks/useNFTMarketplace';

interface NFTCardProps {
  nft: NFTListing;
  onBuy: (nft: NFTListing) => Promise<string>;
  isOwned?: boolean;
  isProcessing?: boolean;
  onSuccess?: (nft: NFTListing, signature: string) => void;
  onError?: (nft: NFTListing, error: string) => void;
}

export function NFTCard({ 
  nft, 
  onBuy, 
  isOwned = false, 
  isProcessing = false,
  onSuccess,
  onError
}: NFTCardProps) {
  const { connected } = useWallet();
  const [buying, setBuying] = useState(false);
  const [purchased, setPurchased] = useState(isOwned);

  const handleBuy = async () => {
    if (!connected || purchased || isOwned) return;
    
    setBuying(true);
    try {
      const signature = await onBuy(nft);
      setPurchased(true);
      
      // Вызываем callback успешной покупки
      onSuccess?.(nft, signature);
    } catch (error) {
      console.error('Ошибка покупки:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      onError?.(nft, errorMessage);
    } finally {
      setBuying(false);
    }
  };

  // Обновляем состояние при изменении isOwned
  useEffect(() => {
    setPurchased(isOwned);
  }, [isOwned]);

  const getIconForNFT = (name: string) => {
    if (name.toLowerCase().includes('rock')) return '🎸';
    if (name.toLowerCase().includes('jazz')) return '🎷';
    if (name.toLowerCase().includes('electronic') || name.toLowerCase().includes('midnight')) return '🎹';
    if (name.toLowerCase().includes('beat') || name.toLowerCase().includes('drum')) return '🥁';
    if (name.toLowerCase().includes('vocal')) return '🎤';
    return '🎵';
  };

  return (
    <div className="bg-dark-card rounded-3xl overflow-hidden border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 group hover:border-purple-600/50">
      {/* Изображение NFT */}
      <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-b border-dark relative">
        <div className="text-6xl">
          {getIconForNFT(nft.name)}
        </div>
        
        {/* Индикатор статуса */}
        {(purchased || isOwned) && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {isOwned ? 'В кошельке' : 'Куплено'}
          </div>
        )}
      </div>

      {/* Информация о NFT */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-medium text-xl text-light mb-1">{nft.name}</h3>
          <div className="flex items-center gap-2 text-muted-light text-sm">
            <User className="w-4 h-4" />
            <span>by {nft.creator}</span>
          </div>
        </div>

        <p className="text-muted-light text-sm line-clamp-2">
          {nft.description}
        </p>

        {/* Атрибуты */}
        {nft.metadata.attributes && (
          <div className="flex flex-wrap gap-2">
            {nft.metadata.attributes.slice(0, 2).map((attr, index) => (
              <div key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-lg text-xs">
                {attr.trait_type}: {attr.value}
              </div>
            ))}
          </div>
        )}

        {/* Цена */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-medium text-light">{nft.price} SOL</span>
            <p className="text-sm text-muted-light">≈ ${(nft.price * 72).toFixed(0)}</p>
          </div>
          <div className="flex items-center gap-1 text-muted-light text-xs">
            <Clock className="w-3 h-3" />
            <span>Доступно</span>
          </div>
        </div>

        {/* Кнопка покупки */}
        <div className="space-y-2">
          <button
            onClick={handleBuy}
            disabled={!connected || buying || purchased || isOwned || isProcessing}
            className={`w-full py-3 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              purchased || isOwned
                ? 'bg-green-600 text-white cursor-not-allowed'
                : !connected
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : buying || isProcessing
                ? 'bg-purple-600/50 text-white cursor-not-allowed'
                : 'accent-purple text-white hover:scale-105 shadow-lg shadow-purple-600/25'
            }`}
          >
            {buying || isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Покупка...
              </>
            ) : purchased || isOwned ? (
              <>
                <CheckCircle className="w-4 h-4" />
                {isOwned ? 'В кошельке' : 'Куплено'}
              </>
            ) : !connected ? (
              'Подключите кошелек'
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Купить сейчас
              </>
            )}
          </button>

          {/* Ссылка на детали */}
          <button className="w-full text-muted-light hover:text-purple-400 text-sm py-2 transition-colors flex items-center justify-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
}