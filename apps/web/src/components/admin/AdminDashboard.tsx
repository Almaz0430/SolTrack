'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Activity, 
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  drops: {
    totalDrops: number;
    activeDrops: number;
    completedDrops: number;
    draftDrops: number;
    totalSupply: number;
    totalMinted: number;
  };
  transactions: {
    totalTransactions: number;
    confirmedTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
  };
  volume: {
    totalVolume: number;
    totalRoyalties: number;
    totalFees: number;
    avgTransactionSize: number;
  };
  topDrops: Array<{
    drop: any;
    volume: number;
    salesCount: number;
  }>;
  recentActivity: Array<{
    transaction: any;
    drop: any;
  }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  const fetchStats = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await fetch(`/api/stats/dashboard?period=${period}`);
      // const data = await response.json();
      
      // Моковые данные для демонстрации
      const mockStats: DashboardStats = {
        drops: {
          totalDrops: 12,
          activeDrops: 4,
          completedDrops: 6,
          draftDrops: 2,
          totalSupply: 1500,
          totalMinted: 890,
        },
        transactions: {
          totalTransactions: 234,
          confirmedTransactions: 220,
          pendingTransactions: 8,
          failedTransactions: 6,
        },
        volume: {
          totalVolume: 456.78,
          totalRoyalties: 410.10,
          totalFees: 46.68,
          avgTransactionSize: 2.07,
        },
        topDrops: [
          {
            drop: { id: '1', name: 'Midnight Dreams', artist: 'ElectroWave' },
            volume: 125.5,
            salesCount: 45,
          },
          {
            drop: { id: '2', name: 'Rock Legends', artist: 'RockLegend' },
            volume: 98.2,
            salesCount: 38,
          },
        ],
        recentActivity: [
          {
            transaction: {
              signature: 'tx123...',
              amount: 2.5,
              type: 'purchase',
              createdAt: '2024-01-16T10:30:00Z', // Фиксированная дата
            },
            drop: { name: 'Midnight Dreams', artist: 'ElectroWave' },
          },
        ],
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-light">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Загрузка статистики...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-light">Ошибка загрузки данных</p>
        <button
          onClick={fetchStats}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'purple' 
  }: {
    title: string;
    value: string | number;
    change?: { value: number; isPositive: boolean };
    icon: any;
    color?: string;
  }) => (
    <div className="bg-dark-card border border-dark rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-600/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            change.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {change.isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-light mb-1">{value}</h3>
        <p className="text-muted-light text-sm">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Фильтр периода */}
      <div className="flex items-center gap-4">
        <span className="text-muted-light">Период:</span>
        <div className="flex gap-2">
          {[
            { value: '24h', label: '24ч' },
            { value: '7d', label: '7д' },
            { value: '30d', label: '30д' },
            { value: '90d', label: '90д' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === option.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-dark-card text-muted-light hover:text-light hover:bg-purple-600/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Общий объем"
          value={`${stats.volume.totalVolume.toFixed(2)} SOL`}
          change={{ value: 12.5, isPositive: true }}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Активные дропы"
          value={stats.drops.activeDrops}
          change={{ value: 8.3, isPositive: true }}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Транзакции"
          value={stats.transactions.confirmedTransactions}
          change={{ value: 15.2, isPositive: true }}
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="Комиссии платформы"
          value={`${stats.volume.totalFees.toFixed(2)} SOL`}
          change={{ value: 5.7, isPositive: true }}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Детальная статистика */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Статистика дропов */}
        <div className="bg-dark-card border border-dark rounded-2xl p-6">
          <h3 className="text-lg font-medium text-light mb-4">Статистика дропов</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-light">Всего дропов</span>
              <span className="text-light font-medium">{stats.drops.totalDrops}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-light">Активные</span>
              <span className="text-green-400 font-medium">{stats.drops.activeDrops}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-light">Завершенные</span>
              <span className="text-blue-400 font-medium">{stats.drops.completedDrops}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-light">Черновики</span>
              <span className="text-yellow-400 font-medium">{stats.drops.draftDrops}</span>
            </div>
            <hr className="border-dark" />
            <div className="flex justify-between items-center">
              <span className="text-muted-light">Выпущено NFT</span>
              <span className="text-light font-medium">
                {stats.drops.totalMinted} / {stats.drops.totalSupply}
              </span>
            </div>
          </div>
        </div>

        {/* Топ дропы */}
        <div className="bg-dark-card border border-dark rounded-2xl p-6">
          <h3 className="text-lg font-medium text-light mb-4">Топ дропы по объему</h3>
          <div className="space-y-4">
            {stats.topDrops.map((item, index) => (
              <div key={item.drop.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 font-medium text-sm">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-light font-medium">{item.drop.name}</p>
                    <p className="text-muted-light text-sm">by {item.drop.artist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-light font-medium">{item.volume.toFixed(2)} SOL</p>
                  <p className="text-muted-light text-sm">{item.salesCount} продаж</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Последняя активность */}
      <div className="bg-dark-card border border-dark rounded-2xl p-6">
        <h3 className="text-lg font-medium text-light mb-4">Последняя активность</h3>
        <div className="space-y-3">
          {stats.recentActivity.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-dark last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-light">
                    Покупка "{item.drop?.name || 'Unknown'}"
                  </p>
                  <p className="text-muted-light text-sm">
                    {new Date(item.transaction.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-light font-medium">
                  {item.transaction.amount} SOL
                </p>
                <p className="text-muted-light text-sm">
                  {item.transaction.signature.slice(0, 8)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}