'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNFTTransactions } from './useNFTTransactions';
import { NFTMetadataService } from '@/lib/nft-metadata';
import { Drop } from '@prisma/client';
import { dropsApi } from '../lib/api';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  creator?: string;
  price?: number;
  mint?: string;
}

export interface NFTListing {
  id: string; // Будет использоваться drop.id
  mint: string; // Пока будет моковый, в будущем - адрес mint'а NFT
  name: string;
  description: string;
  image: string;
  price: number; // в SOL
  creator: string; // Будет использоваться drop.artist
  seller: string; // В будущем - адрес владельца. Пока моковый.
  metadata: NFTMetadata;
}

export function useNFTMarketplace() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { purchaseNFT, isProcessing } = useNFTTransactions();
  const [nfts, setNfts] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [userNFTs, setUserNFTs] = useState<string[]>([]);

  const fetchNFTs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dropsApi.getAll({ status: 'ACTIVE' });
      if (response.success && response.data) {
        // Адаптируем данные дропов под формат NFTListing
        const adaptedNfts = response.data.map((drop: Drop): NFTListing => ({
          id: drop.id,
          mint: `drop_${drop.id}`, // Временный уникальный mint
          name: drop.name,
          description: drop.description || 'Нет описания',
          image: drop.imageUrl || '/api/placeholder/400/400',
          price: parseFloat(drop.price),
          creator: drop.artist,
          seller: publicKey?.toBase58() || '11111111111111111111111111111111', // Адрес продавца (пока моковый)
          metadata: {
            name: drop.name,
            description: drop.description || 'Нет описания',
            image: drop.imageUrl || '',
            creator: drop.artist,
            price: parseFloat(drop.price),
            attributes: [], // Можно будет добавить в будущем
          }
        }));
        setNfts(adaptedNfts);
      } else {
        console.error("Ошибка загрузки дропов для маркетплейса:", response.error);
        setNfts([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки NFT:', error);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  // Получение баланса кошелька
  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(0);
      return;
    }

    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
      setBalance(0);
    }
  }, [connection, publicKey]);

  // Покупка NFT
  const buyNFT = useCallback(async (nft: NFTListing) => {
    if (!publicKey) {
      throw new Error('Кошелек не подключен');
    }

    try {
      const result = await purchaseNFT(nft.mint, nft.price, nft.seller);
      
      if (!result.success || !result.signature) {
        throw new Error(result.error || 'Ошибка покупки NFT');
      }

      // Добавляем NFT в список пользователя
      setUserNFTs(prev => [...prev, nft.mint]);
      
      // Обновляем баланс
      await fetchBalance();

      // Сохраняем транзакцию в БД с реальным dropId
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signature: result.signature,
            type: 'PURCHASE',
            amount: nft.price,
            status: 'CONFIRMED',
            buyerAddress: publicKey.toString(),
            sellerAddress: nft.seller,
            dropId: nft.id, // Используем ID дропа
          }),
        });
      } catch (dbError) {
        console.error('Ошибка сохранения транзакции в БД:', dbError);
      }
      
      return result.signature;
    } catch (error) {
      console.error('Ошибка покупки NFT:', error);
      throw error;
    }
  }, [publicKey, purchaseNFT, fetchBalance]);

  // Получение NFT пользователя
  const fetchUserNFTs = useCallback(async () => {
    if (!publicKey) {
      setUserNFTs([]);
      return;
    }

    try {
      const nfts = await NFTMetadataService.getNFTsForWallet(publicKey.toString());
      const mintAddresses = nfts.map(nft => 
        nft.account.data.parsed.info.mint
      );
      setUserNFTs(mintAddresses);
    } catch (error) {
      console.error('Ошибка получения NFT пользователя:', error);
      setUserNFTs([]);
    }
  }, [publicKey]);

  // Загрузка данных при подключении кошелька
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  useEffect(() => {
    fetchBalance();
    fetchUserNFTs();
  }, [fetchBalance, fetchUserNFTs]);

  useEffect(() => {
    if (typeof window !== 'undefined' && connection) {
      NFTMetadataService.initialize(connection);
    }
  }, [connection]);

  return {
    nfts,
    loading,
    balance,
    userNFTs,
    buyNFT,
    fetchNFTs,
    fetchBalance,
    fetchUserNFTs,
    isProcessing,
  };
}