'use client';

import { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface Transaction {
  id: string;
  signature: string;
  type: 'mint' | 'purchase' | 'transfer' | 'royalty';
  amount: string;
  buyer?: string;
  seller?: string;
  artistRoyalty?: string;
  platformFee?: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockTime?: string;
  slot?: number;
  createdAt: string;
  drop?: {
    id: string;
    name: string;
    artist: string;
  };
}

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  // Моковые данные
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      signature: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZxkmCrhSS',
      type: 'purchase',
      amount: '2.5000',
      buyer: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      seller: '8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV',
      artistRoyalty: '2.2500',
      platformFee: '0.2500',
      status: 'confirmed',
      blockTime: '2024-01-16T10:30:00Z',
      slot: 123456789,
      createdAt: '2024-01-16T10:30:00Z',
      drop: {
        id: '1',
        name: 'Midnight Dreams',
        artist: 'ElectroWave',
      },
    },
    {
      id: '2',
      signature: '6GHneW46xGXgs5mUiveU4sbTyGBzmstUspZxkmCrhST',
      type: 'purchase',
      amount: '1.8000',
      buyer: '9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW',
      seller: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      artistRoyalty: '1.5300',
      platformFee: '0.2700',
      status: 'confirmed',
      blockTime: '2024-01-16T11:15:00Z',
      slot: 123456790,
      createdAt: '2024-01-16T11:15:00Z',
      drop: {
        id: '2',
        name: 'Rock Legends',
        artist: 'RockLegend',
      },
    },
    {
      id: '3',
      signature: '7HHneW46xGXgs5mUiveU4sbTyGBzmstUspZxkmCrhSU',
      type: 'mint',
      amount: '0.0000',
      seller: '9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW',
      status: 'pending',
      createdAt: '2024-01-16T12:00:00Z',
      drop: {
        id: '3',
        name: 'Jazz Fusion',
        artist: 'SmoothJazz',
      },
    },
    {
      id: '4',
      signature: '8IIneW46xGXgs5mUiveU4sbTyGBzmstUspZxkmCrhSV',
      type: 'transfer',
      amount: '0.0000',
      buyer: 'AaKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsX',
      seller: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      status: 'failed',
      createdAt: '2024-01-16T09:45:00Z',
      drop: {
        id: '1',
        name: 'Midnight Dreams',
        artist: 'ElectroWave',
      },
    },
  ];

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.signature.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.drop?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.drop?.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.buyer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.seller?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mint': return 'Минт';
      case 'purchase': return 'Покупка';
      case 'transfer': return 'Перевод';
      case 'royalty': return 'Роялти';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mint': return 'text-blue-400 bg-blue-400/20';
      case 'purchase': return 'text-purple-400 bg-purple-400/20';
      case 'transfer': return 'text-cyan-400 bg-cyan-400/20';
      case 'royalty': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const exportTransactions = () => {
    // В реальном приложении здесь была бы логика экспорта
    console.log('Экспорт транзакций:', filteredTransactions);
    alert('Функция экспорта будет реализована');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-light">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Загрузка транзакций...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-light">Транзакции</h2>
          <p className="text-muted-light">Активность на платформе</p>
        </div>
        <button
          onClick={exportTransactions}
          className="flex items-center gap-2 bg-dark-card hover:bg-purple-600/20 text-muted-light hover:text-light border border-dark hover:border-purple-600/50 px-4 py-3 rounded-xl font-medium transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          Экспорт
        </button>
      </div>

      {/* Фильтры */}
      <div className="bg-dark-card border border-dark rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-light" />
            <input
              type="text"
              placeholder="Поиск по подписи, дропу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark border border-dark rounded-xl text-light placeholder-muted-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Фильтр по типу */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Все типы</option>
            <option value="mint">Минт</option>
            <option value="purchase">Покупка</option>
            <option value="transfer">Перевод</option>
            <option value="royalty">Роялти</option>
          </select>

          {/* Фильтр по статусу */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="confirmed">Подтверждено</option>
            <option value="pending">В ожидании</option>
            <option value="failed">Неудачно</option>
          </select>

          {/* Период */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="24h">24 часа</option>
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
            <option value="90d">90 дней</option>
          </select>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-muted-light">Подтверждено</span>
          </div>
          <p className="text-2xl font-semibold text-light">
            {filteredTransactions.filter(tx => tx.status === 'confirmed').length}
          </p>
        </div>
        
        <div className="bg-dark-card border border-dark rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-muted-light">В ожидании</span>
          </div>
          <p className="text-2xl font-semibold text-light">
            {filteredTransactions.filter(tx => tx.status === 'pending').length}
          </p>
        </div>
        
        <div className="bg-dark-card border border-dark rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-muted-light">Неудачно</span>
          </div>
          <p className="text-2xl font-semibold text-light">
            {filteredTransactions.filter(tx => tx.status === 'failed').length}
          </p>
        </div>
      </div>

      {/* Таблица транзакций */}
      <div className="bg-dark-card border border-dark rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark border-b border-dark">
              <tr>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Транзакция</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Тип</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Дроп</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Участники</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Сумма</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Комиссии</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Статус</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Дата</th>
                <th className="text-right py-4 px-6 text-muted-light font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-dark hover:bg-purple-600/5">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-light font-mono text-sm">
                        {formatAddress(tx.signature)}
                      </p>
                      {tx.slot && (
                        <p className="text-muted-light text-xs">
                          Слот: {tx.slot}
                        </p>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                      {getTypeLabel(tx.type)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    {tx.drop && (
                      <div>
                        <p className="text-light text-sm">{tx.drop.name}</p>
                        <p className="text-muted-light text-xs">by {tx.drop.artist}</p>
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="text-xs space-y-1">
                      {tx.buyer && (
                        <div>
                          <span className="text-muted-light">Покупатель: </span>
                          <span className="text-light font-mono">{formatAddress(tx.buyer)}</span>
                        </div>
                      )}
                      {tx.seller && (
                        <div>
                          <span className="text-muted-light">Продавец: </span>
                          <span className="text-light font-mono">{formatAddress(tx.seller)}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className="text-light font-medium">
                      {parseFloat(tx.amount).toFixed(4)} SOL
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="text-xs space-y-1">
                      {tx.artistRoyalty && (
                        <div className="text-green-400">
                          Артист: {parseFloat(tx.artistRoyalty).toFixed(4)} SOL
                        </div>
                      )}
                      {tx.platformFee && (
                        <div className="text-purple-400">
                          Платформа: {parseFloat(tx.platformFee).toFixed(4)} SOL
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status === 'confirmed' ? 'Подтверждено' : 
                         tx.status === 'pending' ? 'В ожидании' : 'Неудачно'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className="text-muted-light text-sm">
                      {new Date(tx.createdAt).toLocaleString('ru-RU')}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <a
                        href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                        title="Открыть в Solana Explorer"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-light" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-light">Транзакции не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}