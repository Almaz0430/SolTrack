'use client';

import { useState, useEffect } from 'react';
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
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
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
          onClick={() => setShowCreateModal(true)}
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
                        onClick={() => setSelectedDrop(drop)}
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
                        onClick={() => setSelectedDrop(drop)}
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

      {/* Модальное окно создания/редактирования дропа */}
      {(showCreateModal || selectedDrop) && (
        <CreateDropModal
          drop={selectedDrop}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDrop(null);
          }}
          onSave={async (dropData) => {
            try {
              if (selectedDrop) {
                // Обновление существующего дропа
                const response = await dropsApi.update(selectedDrop.id, dropData);
                if (response.success) {
                  showNotification('Дроп успешно обновлен');
                  loadDrops();
                } else {
                  showNotification(response.error || 'Ошибка обновления дропа', 'error');
                  return;
                }
              } else {
                // Создание нового дропа
                const response = await dropsApi.create(dropData);
                if (response.success) {
                  showNotification('Дроп успешно создан');
                  loadDrops();
                } else {
                  showNotification(response.error || 'Ошибка создания дропа', 'error');
                  return;
                }
              }
              setShowCreateModal(false);
              setSelectedDrop(null);
            } catch (error) {
              showNotification('Ошибка сохранения дропа', 'error');
            }
          }}
        />
      )}
    </div>
  );
}

// Компонент модального окна для создания/редактирования дропа
function CreateDropModal({ 
  drop, 
  onClose, 
  onSave 
}: { 
  drop: Drop | null; 
  onClose: () => void; 
  onSave: (data: any) => Promise<void>; 
}) {
  const [formData, setFormData] = useState({
    name: drop?.name || '',
    artist: drop?.artist || '',
    price: drop?.price || '',
    totalSupply: drop?.totalSupply || 100,
    artistRoyalty: drop?.artistRoyalty || '90.00',
    platformFee: drop?.platformFee || '10.00',
    description: drop?.description || '',
    imageUrl: drop?.imageUrl || '',
    musicUrl: drop?.musicUrl || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-light mb-6">
          {drop ? 'Редактировать дроп' : 'Создать новый дроп'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-muted-light text-sm mb-2">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-muted-light text-sm mb-2">Артист</label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-light text-sm mb-2">Цена (SOL)</label>
              <input
                type="number"
                step="0.0001"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-muted-light text-sm mb-2">Тираж</label>
              <input
                type="number"
                value={formData.totalSupply}
                onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-light text-sm mb-2">Роялти артиста (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.artistRoyalty}
                onChange={(e) => setFormData(prev => ({ ...prev, artistRoyalty: e.target.value }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-muted-light text-sm mb-2">Комиссия платформы (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.platformFee}
                onChange={(e) => setFormData(prev => ({ ...prev, platformFee: e.target.value }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-muted-light text-sm mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Описание дропа..."
            />
          </div>
          
          <div>
            <label className="block text-muted-light text-sm mb-2">URL изображения</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-muted-light text-sm mb-2">URL музыки</label>
            <input
              type="url"
              value={formData.musicUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, musicUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/music.mp3"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-dark border border-dark rounded-xl text-muted-light hover:text-light transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-xl font-medium transition-colors"
            >
              {saving ? 'Сохранение...' : (drop ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}