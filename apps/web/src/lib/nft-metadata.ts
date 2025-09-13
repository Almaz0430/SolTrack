import { Connection, PublicKey } from '@solana/web3.js';
import { NFTMetadata } from '@/hooks/useNFTMarketplace';

/**
 * Сервис для работы с метаданными NFT
 */
export class NFTMetadataService {
  private static connection: Connection;

  static initialize(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Получает метаданные NFT из IPFS
   */
  static async fetchMetadataFromIPFS(ipfsHash: string): Promise<NFTMetadata | null> {
    try {
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      
      const response = await fetch(ipfsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const metadata: NFTMetadata = await response.json();
      return metadata;
    } catch (error) {
      console.error('Ошибка загрузки метаданных из IPFS:', error);
      return null;
    }
  }

  /**
   * Получает информацию о NFT по mint адресу
   */
  static async getNFTInfo(mintAddress: string): Promise<any> {
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      
      // Получаем информацию о токене
      const tokenInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
      
      if (!tokenInfo.value) {
        throw new Error('NFT не найден');
      }

      return tokenInfo.value;
    } catch (error) {
      console.error('Ошибка получения информации о NFT:', error);
      throw error;
    }
  }

  /**
   * Получает все NFT для указанного кошелька
   */
  static async getNFTsForWallet(walletAddress: string): Promise<any[]> {
    try {
      if (!this.connection) {
        throw new Error('Connection not initialized');
      }

      const walletPublicKey = new PublicKey(walletAddress);
      
      if (!this.connection.getParsedTokenAccountsByOwner) {
        console.warn('getParsedTokenAccountsByOwner not available');
        return [];
      }

      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        {
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        }
      );

      const nfts = tokenAccounts.value.filter(account => {
        const tokenInfo = account.account.data.parsed.info;
        return tokenInfo.tokenAmount.decimals === 0 && 
               tokenInfo.tokenAmount.uiAmount === 1;
      });

      return nfts;
    } catch (error) {
      console.error('Ошибка получения NFT кошелька:', error);
      return [];
    }
  }

  /**
   * Проверяет, является ли токен NFT
   */
  static async isNFT(mintAddress: string): Promise<boolean> {
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
      
      if (!mintInfo.value) {
        return false;
      }

      const data = mintInfo.value.data as any;
      
      // NFT должен иметь supply = 1 и decimals = 0
      return data.parsed?.info?.supply === '1' && 
             data.parsed?.info?.decimals === 0;
    } catch (error) {
      console.error('Ошибка проверки NFT:', error);
      return false;
    }
  }

  /**
   * Получает URI метаданных для NFT
   */
  static async getMetadataURI(mintAddress: string): Promise<string | null> {
    try {
      // В реальном приложении здесь был бы запрос к Metaplex программе
      // Пока возвращаем заглушку
      return `https://arweave.net/example-metadata-${mintAddress.slice(0, 8)}`;
    } catch (error) {
      console.error('Ошибка получения URI метаданных:', error);
      return null;
    }
  }

  /**
   * Загружает полные метаданные NFT
   */
  static async getFullNFTMetadata(mintAddress: string): Promise<NFTMetadata | null> {
    try {
      const metadataURI = await this.getMetadataURI(mintAddress);
      
      if (!metadataURI) {
        return null;
      }

      // Если это IPFS ссылка, извлекаем хеш
      if (metadataURI.includes('ipfs://')) {
        const ipfsHash = metadataURI.replace('ipfs://', '');
        return await this.fetchMetadataFromIPFS(ipfsHash);
      }

      // Если это обычная HTTP ссылка
      const response = await fetch(metadataURI);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки полных метаданных NFT:', error);
      return null;
    }
  }

  /**
   * Конвертирует цену из lamports в SOL
   */
  static lamportsToSol(lamports: number): number {
    return lamports / 1000000000; // 1 SOL = 1,000,000,000 lamports
  }

  /**
   * Конвертирует цену из SOL в lamports
   */
  static solToLamports(sol: number): number {
    return Math.floor(sol * 1000000000);
  }

  /**
   * Форматирует адрес для отображения
   */
  static formatAddress(address: string, length: number = 4): string {
    if (address.length <= length * 2) {
      return address;
    }
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }

  /**
   * Проверяет валидность Solana адреса
   */
  static isValidSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }
}