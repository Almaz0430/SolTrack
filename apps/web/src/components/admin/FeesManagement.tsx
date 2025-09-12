'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Percent,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FeeSettings {
  defaultArtistRoyalty: number;
  defaultPlatformFee: number;
  minArtistRoyalty: number;
  maxPlatformFee: number;
}

interface FeeStats {
  totalPlatformFees: number;
  totalArtistRoyalties: number;
  totalVolume: number;
  transactionCount: number;
  avgFeePerTransaction: number;
  topArtistsByRoyalties: Array<{
    artist: string;
    totalRoyalties: number;
    transactionCount: number;
  }>;
}

export function FeesManagement() {
  const [feeSettings, setFeeSettings] = useState<FeeSettings>({
    defaultArtistRoyalty: 90,
    defaultPlatformFee: 10,
    minArtistRoyalty: 70,
    maxPlatformFee: 30,
  });
  
  const [feeStats, setFeeStats] = useState<FeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [period, setPeriod] = useState('30d');
  const [showSuccess, setShowSuccess] = useState(false);

  // Моковые данные статистики
  const mockFeeStats: FeeStats = {
    totalPlatformFees: 45.67,
    totalArtistRoyalties: 410.03,
    totalVolume: 455.70,
    transactionCount: 234,
    avgFeePerTransaction: 0.195,
    topArtistsByRoyalties: [
      {
        artist: 'ElectroWave',
        totalRoyalties: 125.50,
        transactionCount: 45,
      },
      {
        artist: 'RockLegend',
        totalRoyalties: 98.20,
        transactionCount: 38,
      },
      {
        artist: 'SmoothJazz',
        totalRoyalties: 87.15,
        transactionCount: 28,
      },
      {
        artist: 'BeatMaker',
        totalRoyalties: 65.80,
        transactionCount: 32,
      },
    ],
  };

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setFeeStats(mockFeeStats);
      setLoading(false);
    }, 1000);
  }, [period]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // В реальном приложении здесь был бы API запрос
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    } finally {
      setSaving(false);
    }
  };

  const validateSettings = () => {
    return feeSettings.defaultArtistRoyalty + feeSettings.defaultPlatformFee === 100 &&
           feeSettings.defaultArtistRoyalty >= feeSettings.minArtistRoyalty &&
           feeSettings.defaultPlatformFee <= feeSettings.maxPlatformFee;
  };

  const isValid = validateSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-light">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Загрузка данных о комиссиях...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h2 className="text-2xl font-semibold text-light">Управление комиссиями</h2>
        <p className="text-muted-light">Настройка роялти и комиссий платформы</p>
      </div>

      {/* Уведомление об успешном сохранении */}
      {showSuccess && (
        <div className="bg-green-600/20 border border-green-600/50 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">Настройки успешно сохранены</span>
        </div>
      )}

      {/* Фильтр периода */}
      <div className="flex items-center gap-4">
        <span className="text-muted-light">Период статистики:</span>
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 дней' },
            { value: '30d', label: '30 дней' },
            { value: '90d', label: '90 дней' },
            { value: '1y', label: '1 год' },
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

      {/* Статистика комиссий */}
      {feeStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-card border border-dark rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-600/20">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-light mb-1">
                {feeStats.totalPlatformFees.toFixed(2)} SOL
              </h3>
              <p className="text-muted-light text-sm">Комиссии платформы</p>
            </div>
          </div>

          <div className="bg-dark-card border border-dark rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-green-600/20">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-light mb-1">
                {feeStats.totalArtistRoyalties.toFixed(2)} SOL
              </h3>
              <p className="text-muted-light text-sm">Роялти артистов</p>
            </div>
          </div>

          <div className="bg-dark-card border border-dark rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-600/20">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-light mb-1">
                {feeStats.totalVolume.toFixed(2)} SOL
              </h3>
              <p className="text-muted-light text-sm">Общий объем</p>
            </div>
          </div>

          <div className="bg-dark-card border border-dark rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-yellow-600/20">
                <Percent className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-light mb-1">
                {((feeStats.totalPlatformFees / feeStats.totalVolume) * 100).toFixed(1)}%
              </h3>
              <p className="text-muted-light text-sm">Средняя комиссия</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Настройки комиссий */}
        <div className="bg-dark-card border border-dark rounded-2xl p-6">
          <h3 className="text-lg font-medium text-light mb-6">Настройки комиссий</h3>
          
          <div className="space-y-6">
            {/* Роялти артиста по умолчанию */}
            <div>
              <label className="block text-muted-light text-sm mb-2">
                Роялти артиста по умолчанию (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={feeSettings.defaultArtistRoyalty}
                onChange={(e) => setFeeSettings(prev => ({
                  ...prev,
                  defaultArtistRoyalty: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Комиссия платформы по умолчанию */}
            <div>
              <label className="block text-muted-light text-sm mb-2">
                Комиссия платформы по умолчанию (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={feeSettings.defaultPlatformFee}
                onChange={(e) => setFeeSettings(prev => ({
                  ...prev,
                  defaultPlatformFee: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Минимальное роялти артиста */}
            <div>
              <label className="block text-muted-light text-sm mb-2">
                Минимальное роялти артиста (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={feeSettings.minArtistRoyalty}
                onChange={(e) => setFeeSettings(prev => ({
                  ...prev,
                  minArtistRoyalty: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Максимальная комиссия платформы */}
            <div>
              <label className="block text-muted-light text-sm mb-2">
                Максимальная комиссия платформы (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={feeSettings.maxPlatformFee}
                onChange={(e) => setFeeSettings(prev => ({
                  ...prev,
                  maxPlatformFee: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-4 py-3 bg-dark border border-dark rounded-xl text-light focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Валидация */}
            {!isValid && (
              <div className="bg-red-600/20 border border-red-600/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-red-400 text-sm">
                  <p className="font-medium mb-1">Ошибка в настройках:</p>
                  <ul className="space-y-1">
                    {feeSettings.defaultArtistRoyalty + feeSettings.defaultPlatformFee !== 100 && (
                      <li>• Сумма роялти и комиссии должна равняться 100%</li>
                    )}
                    {feeSettings.defaultArtistRoyalty < feeSettings.minArtistRoyalty && (
                      <li>• Роялти артиста не может быть меньше минимального</li>
                    )}
                    {feeSettings.defaultPlatformFee > feeSettings.maxPlatformFee && (
                      <li>• Комиссия платформы не может превышать максимальную</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Кнопка сохранения */}
            <button
              onClick={handleSaveSettings}
              disabled={!isValid || saving}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                isValid && !saving
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Сохранить настройки
                </>
              )}
            </button>
          </div>
        </div>

        {/* Топ артисты по роялти */}
        {feeStats && (
          <div className="bg-dark-card border border-dark rounded-2xl p-6">
            <h3 className="text-lg font-medium text-light mb-6">Топ артисты по роялти</h3>
            
            <div className="space-y-4">
              {feeStats.topArtistsByRoyalties.map((artist, index) => (
                <div key={artist.artist} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 font-medium text-sm">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-light font-medium">{artist.artist}</p>
                      <p className="text-muted-light text-sm">
                        {artist.transactionCount} транзакций
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-light font-medium">
                      {artist.totalRoyalties.toFixed(2)} SOL
                    </p>
                    <p className="text-muted-light text-sm">
                      {(artist.totalRoyalties / artist.transactionCount).toFixed(3)} SOL/тр.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Сводка */}
            <div className="mt-6 pt-6 border-t border-dark">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-light">Средняя комиссия за транзакцию</p>
                  <p className="text-light font-medium">
                    {feeStats.avgFeePerTransaction.toFixed(4)} SOL
                  </p>
                </div>
                <div>
                  <p className="text-muted-light">Всего транзакций</p>
                  <p className="text-light font-medium">{feeStats.transactionCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Распределение комиссий */}
      {feeStats && (
        <div className="bg-dark-card border border-dark rounded-2xl p-6">
          <h3 className="text-lg font-medium text-light mb-6">Распределение комиссий</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Визуализация распределения */}
            <div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-light">Роялти артистов</span>
                    <span className="text-green-400 font-medium">
                      {((feeStats.totalArtistRoyalties / feeStats.totalVolume) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-dark rounded-full h-3">
                    <div 
                      className="bg-green-400 h-3 rounded-full"
                      style={{ 
                        width: `${(feeStats.totalArtistRoyalties / feeStats.totalVolume) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-light">Комиссии платформы</span>
                    <span className="text-purple-400 font-medium">
                      {((feeStats.totalPlatformFees / feeStats.totalVolume) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-dark rounded-full h-3">
                    <div 
                      className="bg-purple-400 h-3 rounded-full"
                      style={{ 
                        width: `${(feeStats.totalPlatformFees / feeStats.totalVolume) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Числовые данные */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-light">Общий объем:</span>
                <span className="text-light font-medium">
                  {feeStats.totalVolume.toFixed(2)} SOL
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-light">Роялти артистов:</span>
                <span className="text-green-400 font-medium">
                  {feeStats.totalArtistRoyalties.toFixed(2)} SOL
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-light">Комиссии платформы:</span>
                <span className="text-purple-400 font-medium">
                  {feeStats.totalPlatformFees.toFixed(2)} SOL
                </span>
              </div>
              
              <hr className="border-dark" />
              
              <div className="flex justify-between items-center">
                <span className="text-muted-light">Эффективность сбора:</span>
                <span className="text-light font-medium">
                  {(((feeStats.totalPlatformFees + feeStats.totalArtistRoyalties) / feeStats.totalVolume) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}