'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNFTTransactions } from './useNFTTransactions';
import { NFTMetadataService } from '@/lib/nft-metadata';

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
  id: string;
  mint: string;
  name: string;
  description: string;
  image: string;
  price: number; // в SOL
  creator: string;
  seller: string;
  metadata: NFTMetadata;
}

// Моковые данные NFT для демонстрации
const MOCK_NFTS: NFTListing[] = [
  {
    id: '1',
    mint: 'DemoMint1111111111111111111111111111111',
    name: 'Midnight Dreams',
    description: 'Электронная композиция в стиле ambient с глубокими басами',
    image: '/api/placeholder/400/400',
    price: 2.5,
    creator: 'ElectroWave',
    seller: '11111111111111111111111111111112',
    metadata: {
      name: 'Midnight Dreams',
      description: 'Электронная композиция в стиле ambient с глубокими басами',
      image: '/api/placeholder/400/400',
      creator: 'ElectroWave',
      price: 2.5,
      attributes: [
        { trait_type: 'Genre', value: 'Electronic' },
        { trait_type: 'Duration', value: '3:45' },
        { trait_type: 'BPM', value: '120' }
      ]
    }
  },
  {
    id: '2',
    mint: 'DemoMint2222222222222222222222222222222',
    name: 'Rock Anthem #42',
    description: 'Мощная рок-композиция с эпическими гитарными соло',
    image: '/api/placeholder/400/400',
    price: 1.8,
    creator: 'RockLegend',
    seller: '11111111111111111111111111111113',
    metadata: {
      name: 'Rock Anthem #42',
      description: 'Мощная рок-композиция с эпическими гитарными соло',
      image: '/api/placeholder/400/400',
      creator: 'RockLegend',
      price: 1.8,
      attributes: [
        { trait_type: 'Genre', value: 'Rock' },
        { trait_type: 'Duration', value: '4:12' },
        { trait_type: 'Instruments', value: 'Guitar, Drums, Bass' }
      ]
    }
  },
  {
    id: '3',
    mint: 'DemoMint3333333333333333333333333333333',
    name: 'Jazz Fusion',
    description: 'Сложная джазовая композиция с импровизацией и соло саксофона',
    image: '/api/placeholder/400/400',
    price: 3.2,
    creator: 'SmoothJazz',
    seller: '11111111111111111111111111111114',
    metadata: {
      name: 'Jazz Fusion',
      description: 'Сложная джазовая композиция с импровизацией и соло саксофона',
      image: '/api/placeholder/400/400',
      creator: 'SmoothJazz',
      price: 3.2,
      attributes: [
        { trait_type: 'Genre', value: 'Jazz' },
        { trait_type: 'Duration', value: '5:30' },
        { trait_type: 'Key', value: 'Bb Major' }
      ]
    }
  },
  {
    id: '4',
    mint: 'DemoMint4444444444444444444444444444444',
    name: 'Beat Drop Supreme',
    description: 'Энергичный трек с мощными ударными и синтезаторами',
    image: '/api/placeholder/400/400',
    price: 0.9,
    creator: 'DrumMaster',
    seller: '11111111111111111111111111111115',
    metadata: {
      name: 'Beat Drop Supreme',
      description: 'Энергичный трек с мощными ударными и синтезаторами',
      image: '/api/placeholder/400/400',
      creator: 'DrumMaster',
      price: 0.9,
      attributes: [
        { trait_type: 'Genre', value: 'Electronic' },
        { trait_type: 'Duration', value: '2:58' },
        { trait_type: 'BPM', value: '140' }
      ]
    }
  },
  {
    id: '5',
    mint: 'DemoMint5555555555555555555555555555555',
    name: 'Vocal Harmony',
    description: 'Красивая вокальная композиция с многослойными гармониями',
    image: '/api/placeholder/400/400',
    price: 4.1,
    creator: 'VoiceAngel',
    seller: '11111111111111111111111111111116',
    metadata: {
      name: 'Vocal Harmony',
      description: 'Красивая вокальная композиция с многослойными гармониями',
      image: '/api/placeholder/400/400',
      creator: 'VoiceAngel',
      price: 4.1,
      attributes: [
        { trait_type: 'Genre', value: 'Pop' },
        { trait_type: 'Duration', value: '3:22' },
        { trait_type: 'Vocal Range', value: 'Soprano' }
      ]
    }
  },
  {
    id: '6',
    mint: 'DemoMint6666666666666666666666666666666',
    name: 'Brass Section',
    description: 'Духовая секция с богатым звучанием трубы и тромбона',
    image: '/api/placeholder/400/400',
    price: 1.5,
    creator: 'BrassKing',
    seller: '11111111111111111111111111111117',
    metadata: {
      name: 'Brass Section',
      description: 'Духовая секция с богатым звучанием трубы и тромбона',
      image: '/api/placeholder/400/400',
      creator: 'BrassKing',
      price: 1.5,
      attributes: [
        { trait_type: 'Genre', value: 'Jazz' },
        { trait_type: 'Duration', value: '4:05' },
        { trait_type: 'Instruments', value: 'Trumpet, Trombone' }
      ]
    }
  }
];

export function useNFTMarketplace() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { purchaseNFT, isProcessing } = useNFTTransactions();
  const [nfts, setNfts] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [userNFTs, setUserNFTs] = useState<string[]>([]);

  // Загрузка NFT (в реальном приложении здесь был бы запрос к программе)
  const fetchNFTs = useCallback(async () => {
    setLoading(true);
    try {
      // Имитация загрузки
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNfts(MOCK_NFTS);
    } catch (error) {
      console.error('Ошибка загрузки NFT:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
      
      if (!result.success) {
        throw new Error(result.error || 'Ошибка покупки NFT');
      }

      // Добавляем NFT в список пользователя
      setUserNFTs(prev => [...prev, nft.mint]);
      
      // Обновляем баланс
      await fetchBalance();
      
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

  // Инициализация NFTMetadataService
  useEffect(() => {
    NFTMetadataService.initialize(connection);
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