'use client';

import { useState } from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { DropsManagement } from '@/components/admin/DropsManagement';
import { TransactionsTable } from '@/components/admin/TransactionsTable';
import { FeesManagement } from '@/components/admin/FeesManagement';
import { 
  LayoutDashboard, 
  Package, 
  Activity, 
  DollarSign,
  Settings,
  Users
} from 'lucide-react';

type AdminTab = 'dashboard' | 'drops' | 'transactions' | 'fees' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'drops', label: 'Дропы', icon: Package },
    { id: 'transactions', label: 'Транзакции', icon: Activity },
    { id: 'fees', label: 'Комиссии', icon: DollarSign },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'drops':
        return <DropsManagement />;
      case 'transactions':
        return <TransactionsTable />;
      case 'fees':
        return <FeesManagement />;
      case 'settings':
        return (
          <div className="bg-dark-card rounded-2xl p-8 text-center">
            <Settings className="w-16 h-16 text-muted-light mx-auto mb-4" />
            <h3 className="text-xl font-medium text-light mb-2">Настройки</h3>
            <p className="text-muted-light">Раздел в разработке</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-light text-light mb-2">
            Админ панель
          </h1>
          <p className="text-lg text-muted-light">
            Управление платформой Solana Music NFT
          </p>
        </div>

        {/* Навигация */}
        <div className="flex flex-wrap gap-2 mb-8 bg-dark-card rounded-2xl p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'text-muted-light hover:text-light hover:bg-purple-600/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Контент */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}