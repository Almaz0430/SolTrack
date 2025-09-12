'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter,
  WalletConnectWalletAdapter 
} from '@solana/wallet-adapter-wallets';
import { useMemo, useEffect } from 'react';
import { SolanaService } from '@/lib/solana';

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com",
    []
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new WalletConnectWalletAdapter({
        network: 'devnet',
        options: {
          projectId: 'your-project-id', // Замените на ваш WalletConnect Project ID
        },
      }),
    ],
    []
  );

  // Инициализируем Solana сервис при загрузке
  useEffect(() => {
    SolanaService.initialize(endpoint);
  }, [endpoint]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}