'use client';

import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionSignature
} from '@solana/web3.js';
import { NFTMetadataService } from '@/lib/nft-metadata';

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

export function useNFTTransactions() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Создает транзакцию покупки NFT
   */
  const createPurchaseTransaction = useCallback(async (
    nftMint: string,
    price: number,
    sellerAddress: string
  ): Promise<Transaction> => {
    if (!publicKey) {
      throw new Error('Кошелек не подключен');
    }

    const transaction = new Transaction();
    const sellerPublicKey = new PublicKey(sellerAddress);
    const priceInLamports = NFTMetadataService.solToLamports(price);

    // Добавляем инструкцию перевода SOL продавцу
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: sellerPublicKey,
        lamports: priceInLamports,
      })
    );

    // В реальном приложении здесь были бы инструкции для:
    // 1. Перевода NFT от продавца к покупателю
    // 2. Обновления состояния маркетплейса
    // 3. Выплаты комиссии маркетплейсу

    return transaction;
  }, [publicKey]);

  /**
   * Выполняет покупку NFT
   */
  const purchaseNFT = useCallback(async (
    nftMint: string,
    price: number,
    sellerAddress: string
  ): Promise<TransactionResult> => {
    if (!publicKey || !sendTransaction) {
      throw new Error('Кошелек не подключен');
    }

    setIsProcessing(true);

    try {
      // Проверяем баланс
      const balance = await connection.getBalance(publicKey);
      const requiredBalance = NFTMetadataService.solToLamports(price);
      
      if (balance < requiredBalance) {
        throw new Error('Недостаточно средств для покупки');
      }

      // Создаем транзакцию
      const transaction = await createPurchaseTransaction(nftMint, price, sellerAddress);
      
      // Получаем последний блокхеш
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Отправляем транзакцию
      const signature = await sendTransaction(transaction, connection);

      // Ждем подтверждения
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Транзакция не удалась');
      }

      // Сохраняем транзакцию в базу данных
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signature,
            type: 'PURCHASE',
            amount: price,
            status: 'CONFIRMED',
            buyerAddress: publicKey.toString(),
            sellerAddress: sellerAddress,
            // dropId можно добавить если есть связь с дропом
          }),
        });
      } catch (dbError) {
        console.error('Ошибка сохранения транзакции в БД:', dbError);
        // Не прерываем процесс, если не удалось сохранить в БД
      }

      return {
        signature,
        success: true,
      };

    } catch (error) {
      console.error('Ошибка покупки NFT:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, sendTransaction, connection, createPurchaseTransaction]);

  /**
   * Создает листинг NFT на продажу
   */
  const listNFTForSale = useCallback(async (
    nftMint: string,
    price: number
  ): Promise<TransactionResult> => {
    if (!publicKey || !sendTransaction) {
      throw new Error('Кошелек не подключен');
    }

    setIsProcessing(true);

    try {
      // В реальном приложении здесь была бы логика:
      // 1. Создание аккаунта листинга
      // 2. Перевод NFT в escrow аккаунт маркетплейса
      // 3. Установка цены и условий продажи

      const transaction = new Transaction();
      
      // Заглушка - просто создаем пустую транзакцию
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // В реальности здесь были бы инструкции маркетплейса
      console.log(`Создание листинга для NFT ${nftMint} по цене ${price} SOL`);

      return {
        signature: 'demo-listing-signature',
        success: true,
      };

    } catch (error) {
      console.error('Ошибка создания листинга:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, sendTransaction, connection]);

  /**
   * Отменяет листинг NFT
   */
  const cancelListing = useCallback(async (
    nftMint: string
  ): Promise<TransactionResult> => {
    if (!publicKey || !sendTransaction) {
      throw new Error('Кошелек не подключен');
    }

    setIsProcessing(true);

    try {
      // В реальном приложении здесь была бы логика:
      // 1. Закрытие аккаунта листинга
      // 2. Возврат NFT владельцу
      // 3. Возврат депозита

      console.log(`Отмена листинга для NFT ${nftMint}`);

      return {
        signature: 'demo-cancel-signature',
        success: true,
      };

    } catch (error) {
      console.error('Ошибка отмены листинга:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, sendTransaction, connection]);

  /**
   * Получает историю транзакций кошелька
   */
  const getTransactionHistory = useCallback(async (limit: number = 10) => {
    if (!publicKey) {
      return [];
    }

    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
      
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getParsedTransaction(sig.signature);
            return {
              signature: sig.signature,
              blockTime: sig.blockTime,
              slot: sig.slot,
              transaction: tx,
            };
          } catch (error) {
            console.error('Ошибка получения транзакции:', error);
            return null;
          }
        })
      );

      return transactions.filter(tx => tx !== null);
    } catch (error) {
      console.error('Ошибка получения истории транзакций:', error);
      return [];
    }
  }, [connection, publicKey]);

  return {
    purchaseNFT,
    listNFTForSale,
    cancelListing,
    getTransactionHistory,
    isProcessing,
  };
}