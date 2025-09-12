'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <span className="text-xl">🎵</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">SolTrack</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/drops" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
            >
              Дропы
            </Link>
            <Link 
              href="/market" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
            >
              Маркетплейс
            </Link>
            <Link 
              href="/admin" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
            >
              Админ
            </Link>
          </nav>

          {/* Wallet Connect Button */}
          <div className="flex items-center">
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !border-0 !rounded-xl !font-medium !transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}