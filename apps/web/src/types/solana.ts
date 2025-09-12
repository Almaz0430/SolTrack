import { PublicKey } from '@solana/web3.js';

export interface SolanaWalletInfo {
  publicKey: PublicKey | null;
  connected: boolean;
  balance: number;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: NFTAttribute[];
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
    }>;
    category?: string;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  };
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
  isListed: boolean;
  listingDate?: Date;
}

export interface MarketplaceStats {
  totalVolume: number;
  totalSales: number;
  floorPrice: number;
  uniqueOwners: number;
}

export interface TransactionInfo {
  signature: string;
  blockTime: number | null;
  slot: number;
  status: 'success' | 'failed' | 'pending';
  type: 'purchase' | 'listing' | 'transfer' | 'other';
  amount?: number;
  nft?: {
    mint: string;
    name: string;
  };
}

export interface WalletNFT {
  mint: string;
  name: string;
  image: string;
  metadata: NFTMetadata;
  tokenAccount: string;
}