'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Square, 
  Eye,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { dropsApi, showNotification, formatters } from '@/lib/api';
import { Drop } from '@prisma/client';

export function DropsManagement() {
  const router = useRouter();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);

  // Загрузка дропов
  const loadDrops = async () => {
    setLoading(true);
    try {
      const response = await dropsApi.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
      });
      
      if (response.success && response.data) {
        setDrops(response.data);
      } else {
        showNotification(response.error || 'Ошибка загрузки дропов', 'error');
      }
    } catch (error) {
      showNotification('Ошибка загрузки дропов', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrops();
  }, [statusFilter]);

  // Поиск с задержкой
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadDrops();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredDrops = drops.filter(drop => {
    const matchesSearch = drop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drop.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || drop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-400/20';
      case 'COMPLETED': return 'text-blue-400 bg-blue-400/20';
      case 'DRAFT': return 'text-yellow-400 bg-yellow-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Активный';
      case 'COMPLETED': return 'Завершен';
      case 'DRAFT': return 'Черновик';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  };

  const handleActivate = async (dropId: string) => {
    try {
      const response = await dropsApi.activate(dropId);
      if (response.success) {
        showNotification('Дроп успешно активирован');
        loadDrops();
      } else {
        showNotification(response.error || 'Ошибка активации дропа', 'error');
      }
    } catch (error) {
      showNotification('Ошибка активации дропа', 'error');
    }
  };

  const handleComplete = async (dropId: string) => {
    try {
      const response = await dropsApi.complete(dropId);
      if (response.success) {
        showNotification('Дроп успешно завершен');
        loadDrops();
      } else {
        showNotification(response.error || 'Ошибка завершения дропа', 'error');
      }
    } catch (error) {
      showNotification('Ошибка завершения дропа', 'error');
    }
  };

  const handleDelete = async (dropId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот дроп?')) return;
    
    try {
      const response = await dropsApi.delete(dropId);
      if (response.success) {
        showNotification('Дроп успешно удален');
        loadDrops();
      } else {
        showNotification(response.error || 'Ошибка удаления дропа', 'error');
      }
    } catch (error) {
      showNotification('Ошибка удаления дропа', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-light">Загрузка дропов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-light">Управление дропами</h2>
          <p className="text-muted-light">Создавайте и управляйте NFT дропами</p>
        </div>
        <button
          onClick={() => router.push('/admin/create-drop')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Создать дроп
        </button>
      </div>

      {/* Фильтры */}
      <div className="bg-dark-card border border-dark rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Поиск */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-light" />
            <input
              type="text"
              placeholder="Поиск по названию или артисту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark border border-dark rounded-xl text-light placeholder-muted-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Фильтр по статусу */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-light" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">Все статусы</option>
              <option value="DRAFT">Черновики</option>
              <option value="ACTIVE">Активные</option>
              <option value="COMPLETED">Завершенные</option>
              <option value="CANCELLED">Отмененные</option>
            </select>
          </div>
        </div>
      </div>

      {/* Таблица дропов */}
      <div className="bg-dark-card border border-dark rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark border-b border-dark">
              <tr>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Дроп</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Цена</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Прогресс</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Комиссии</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Статус</th>
                <th className="text-left py-4 px-6 text-muted-light font-medium">Дата</th>
                <th className="text-right py-4 px-6 text-muted-light font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrops.map((drop) => (
                <tr key={drop.id} className="border-b border-dark hover:bg-purple-600/5">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-light font-medium">{drop.name}</p>
                      <p className="text-muted-light text-sm">by {drop.artist}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-light font-medium">{formatters.price(drop.price)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-light text-sm">
                          {drop.mintedSupply} / {drop.totalSupply}
                        </span>
                        <span className="text-muted-light text-sm">
                          ({Math.round((drop.mintedSupply / drop.totalSupply) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-dark rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(drop.mintedSupply / drop.totalSupply) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="text-light">Артист: {formatters.percentage(drop.artistRoyalty)}</div>
                      <div className="text-muted-light">Платформа: {formatters.percentage(drop.platformFee)}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(drop.status)}`}>
                      {getStatusLabel(drop.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-muted-light text-sm">
                      {formatters.date(drop.createdAt)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {/* Logic for viewing drop details */}}
                        className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4 text-muted-light" />
                      </button>
                      
                      {drop.status === 'DRAFT' && (
                        <button
                          onClick={() => handleActivate(drop.id)}
                          className="p-2 hover:bg-green-600/20 rounded-lg transition-colors"
                          title="Активировать"
                        >
                          <Play className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      
                      {drop.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleComplete(drop.id)}
                          className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors"
                          title="Завершить"
                        >
                          <Square className="w-4 h-4 text-blue-400" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {/* Logic for editing drop */}}
                        className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4 text-muted-light" />
                      </button>
                      
                      {drop.status === 'DRAFT' && (
                        <button
                          onClick={() => handleDelete(drop.id)}
                          className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDrops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-light">Дропы не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}