'use client';

import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { SolanaContractService, CreateNftParams } from '@/lib/solana-contract';

// IDL интерфейс
import idl from '@/lib/music_nft.json';

export function useMusicNFT() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [availableNFTs, setAvailableNFTs] = useState<any[]>([]);

  // Инициализация программы
  useEffect(() => {
    const initializeProgram = async () => {
      if (!connection || !publicKey) return;

      try {
        // IDL уже загружен

        const provider = new AnchorProvider(connection, { publicKey, signTransaction } as any, {
          preflightCommitment: 'processed',
        });

        const program = new Program(idl, provider);
        setProgram(program);
        
        // Инициализируем сервис
        SolanaContractService.initialize(connection, program);
      } catch (error) {
        console.error('Ошибка инициализации программы:', error);
      }
    };

    initializeProgram();
  }, [connection, publicKey, signTransaction]);

  // Создание NFT
  const createNFT = useCallback(async (params: CreateNftParams) => {
    if (!program || !publicKey || !signTransaction) {
      throw new Error('Программа или кошелек не инициализированы');
    }

    setLoading(true);
    try {
      const result = await SolanaContractService.createMusicNFT(
        { publicKey, signTransaction },
        params
      );
      
      // Обновляем список NFT пользователя
      await fetchUserNFTs();
      
      return result;
    } catch (error) {
      console.error('Ошибка создания NFT:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, signTransaction]);

  // Покупка NFT
  const buyNFT = useCallback(async (nftDataPda: string, sellerTokenAccount: string) => {
    if (!program || !publicKey || !signTransaction) {
      throw new Error('Программа или кошелек не инициализированы');
    }

    setLoading(true);
    try {
      const signature = await SolanaContractService.buyMusicNFT(
        { publicKey, signTransaction },
        nftDataPda,
        sellerTokenAccount
      );
      
      // Обновляем списки NFT
      await Promise.all([fetchUserNFTs(), fetchAvailableNFTs()]);
      
      return signature;
    } catch (error) {
      console.error('Ошибка покупки NFT:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, signTransaction]);

  // Изменение цены NFT
  const updatePrice = useCallback(async (nftDataPda: string, newPrice: number) => {
    if (!program || !publicKey || !signTransaction) {
      throw new Error('Программа или кошелек не инициализированы');
    }

    setLoading(true);
    try {
      const signature = await SolanaContractService.updateNFTPrice(
        { publicKey, signTransaction },
        nftDataPda,
        newPrice
      );
      
      // Обновляем списки NFT
      await Promise.all([fetchUserNFTs(), fetchAvailableNFTs()]);
      
      return signature;
    } catch (error) {
      console.error('Ошибка изменения цены:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, signTransaction]);

  // Получение NFT пользователя
  const fetchUserNFTs = useCallback(async () => {
    if (!publicKey) {
      setUserNFTs([]);
      return;
    }

    try {
      const nfts = await SolanaContractService.getUserNFTs(publicKey);
      setUserNFTs(nfts);
    } catch (error) {
      console.error('Ошибка получения NFT пользователя:', error);
      setUserNFTs([]);
    }
  }, [publicKey]);

  // Получение доступных NFT
  const fetchAvailableNFTs = useCallback(async () => {
    try {
      const nfts = await SolanaContractService.getAvailableNFTs();
      setAvailableNFTs(nfts);
    } catch (error) {
      console.error('Ошибка получения доступных NFT:', error);
      setAvailableNFTs([]);
    }
  }, []);

  // Автоматическая загрузка при инициализации
  useEffect(() => {
    if (program) {
      fetchUserNFTs();
      fetchAvailableNFTs();
    }
  }, [program, fetchUserNFTs, fetchAvailableNFTs]);

  return {
    program,
    loading,
    userNFTs,
    availableNFTs,
    createNFT,
    buyNFT,
    updatePrice,
    fetchUserNFTs,
    fetchAvailableNFTs,
    isInitialized: !!program,
  };
}
