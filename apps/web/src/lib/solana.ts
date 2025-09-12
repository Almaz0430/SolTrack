import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Типы для дропов
export interface DropData {
  id: string;
  name: string;
  description: string;
  artist: string;
  price: number; // в SOL
  totalSupply: number;
  currentSupply: number;
  startTime: number;
  endTime: number;
  imageHash: string;
  musicHash: string;
  metadataHash: string;
  isActive: boolean;
}

export interface CreateDropParams {
  name: string;
  description: string;
  artist: string;
  price: number;
  totalSupply: number;
  startTime: Date;
  endTime: Date;
  imageHash: string;
  musicHash: string;
  metadataHash: string;
}

export class SolanaService {
  private static connection: Connection;

  static initialize(rpcUrl: string = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com") {
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  static getConnection(): Connection {
    if (!this.connection) {
      this.initialize();
    }
    return this.connection;
  }

  /**
   * Создает новый дроп в блокчейне
   */
  static async createDrop(
    wallet: WalletContextState,
    params: CreateDropParams
  ): Promise<string> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    const connection = this.getConnection();

    try {
      // Здесь будет логика создания дропа через смарт-контракт
      // Пока создаем простую транзакцию для демонстрации
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey, // Временно на себя
          lamports: 0.001 * LAMPORTS_PER_SOL, // Минимальная комиссия
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      await connection.confirmTransaction(signature);

      // В реальном приложении здесь будет сохранение данных дропа
      console.log('Drop created with signature:', signature);
      
      return signature;
    } catch (error) {
      console.error('Error creating drop:', error);
      throw new Error('Failed to create drop');
    }
  }

  /**
   * Получает список всех дропов
   */
  static async getDrops(): Promise<DropData[]> {
    // В реальном приложении здесь будет запрос к смарт-контракту
    // Пока возвращаем моковые данные
    return [
      {
        id: '1',
        name: 'Cosmic Beats #001',
        description: 'Эксклюзивная коллекция космических битов',
        artist: 'DJ Nebula',
        price: 2.5,
        totalSupply: 100,
        currentSupply: 45,
        startTime: Date.now() - 86400000, // 1 день назад
        endTime: Date.now() + 172800000, // 2 дня вперед
        imageHash: 'QmExample1',
        musicHash: 'QmExample2',
        metadataHash: 'QmExample3',
        isActive: true,
      },
      {
        id: '2',
        name: 'Retro Wave Collection',
        description: 'Лимитированная коллекция ретро-волны',
        artist: 'SynthMaster',
        price: 0.5,
        totalSupply: 50,
        currentSupply: 0,
        startTime: Date.now() + 432000000, // 5 дней вперед
        endTime: Date.now() + 864000000, // 10 дней вперед
        imageHash: 'QmExample4',
        musicHash: 'QmExample5',
        metadataHash: 'QmExample6',
        isActive: false,
      },
    ];
  }

  /**
   * Получает информацию о конкретном дропе
   */
  static async getDrop(id: string): Promise<DropData | null> {
    const drops = await this.getDrops();
    return drops.find(drop => drop.id === id) || null;
  }

  /**
   * Покупает NFT из дропа
   */
  static async purchaseNFT(
    wallet: WalletContextState,
    dropId: string
  ): Promise<string> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    const drop = await this.getDrop(dropId);
    if (!drop) {
      throw new Error('Drop not found');
    }

    if (!drop.isActive) {
      throw new Error('Drop is not active');
    }

    if (drop.currentSupply >= drop.totalSupply) {
      throw new Error('Drop is sold out');
    }

    const connection = this.getConnection();

    try {
      // Здесь будет логика покупки NFT через смарт-контракт
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey, // Временно на себя
          lamports: drop.price * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      await connection.confirmTransaction(signature);

      console.log('NFT purchased with signature:', signature);
      
      return signature;
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      throw new Error('Failed to purchase NFT');
    }
  }
}

// Инициализируем сервис при импорте
SolanaService.initialize();