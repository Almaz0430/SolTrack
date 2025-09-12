'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface WalletInfoProps {
  balance: number;
}

export function WalletInfo({ balance }: WalletInfoProps) {
  const { publicKey, connected } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return (
      <div className="bg-dark-card border border-dark rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-medium text-light">Кошелек</h3>
        </div>
        <p className="text-muted-light mb-4">Подключите кошелек для покупки NFT</p>
        <WalletMultiButton className="!bg-purple-600 !rounded-xl !font-medium hover:!bg-purple-700 transition-colors" />
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-medium text-light">Кошелек</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-light mb-1">Адрес</p>
          <div className="flex items-center gap-2">
            <span className="text-light font-mono text-sm">
              {formatAddress(publicKey!.toString())}
            </span>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-purple-600/20 rounded transition-colors"
              title="Копировать адрес"
            >
              <Copy className="w-4 h-4 text-muted-light" />
            </button>
            <a
              href={`https://explorer.solana.com/address/${publicKey!.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-purple-600/20 rounded transition-colors"
              title="Открыть в Solana Explorer"
            >
              <ExternalLink className="w-4 h-4 text-muted-light" />
            </a>
          </div>
          {copied && (
            <p className="text-xs text-green-400 mt-1">Адрес скопирован!</p>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-light mb-1">Баланс</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-medium text-light">
              {balance.toFixed(4)}
            </span>
            <span className="text-sm text-muted-light">SOL</span>
          </div>
          <p className="text-xs text-muted-light mt-1">
            ≈ ${(balance * 72).toFixed(2)} USD
          </p>
        </div>

        <WalletMultiButton className="!bg-purple-600 !rounded-xl !font-medium hover:!bg-purple-700 transition-colors !w-full" />
      </div>
    </div>
  );
}