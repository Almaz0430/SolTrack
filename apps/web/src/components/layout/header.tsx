'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Header() {
  return (
    <header className="bg-dark-card border-b border-dark backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="pixel-logo transition-all duration-300">
              <span className="sol-part">Sol</span>Track
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/drops" 
              className="text-muted-light hover:text-light font-medium transition-colors py-2 hover:text-purple-400"
            >
              Дропы
            </Link>
            <Link 
              href="/market" 
              className="text-muted-light hover:text-light font-medium transition-colors py-2 hover:text-purple-400"
            >
              Маркетплейс
            </Link>
            <Link 
              href="/admin" 
              className="text-muted-light hover:text-light font-medium transition-colors py-2 hover:text-purple-400"
            >
              Админ
            </Link>
          </nav>

          {/* Wallet Connect Button */}
          <div className="flex items-center">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !border-0 !rounded-xl !font-medium !transition-all !duration-200 hover:!scale-105 !text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}