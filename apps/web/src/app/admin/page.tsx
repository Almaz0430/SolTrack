'use client';

import Link from 'next/link';
import { 
  Users, 
  Music, 
  DollarSign, 
  Rocket, 
  Plus, 
  User, 
  BarChart3, 
  Settings, 
  Shield, 
  FileText,
  CheckCircle
} from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-4xl lg:text-6xl font-light text-light mb-4">
              Панель администратора
            </h1>
            <p className="text-xl lg:text-2xl text-muted-light font-light">
              Управление платформой SolTrack
            </p>
          </div>
          <div className="bg-green-600/20 text-green-400 px-6 py-3 rounded-2xl font-medium border border-green-600/30 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Система работает</span>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-dark-card rounded-3xl p-8 border border-dark hover:border-purple-600/50 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted-light font-light mb-2">Всего пользователей</p>
                <p className="text-4xl font-light text-light">1,247</p>
              </div>
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-600/30">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-400 font-medium">+12%</span>
              <span className="text-muted-light ml-2 font-light">за последний месяц</span>
            </div>
          </div>

          <div className="bg-dark-card rounded-3xl p-8 border border-dark hover:border-purple-600/50 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted-light font-light mb-2">Активные NFT</p>
                <p className="text-4xl font-light text-light">3,892</p>
              </div>
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-600/30">
                <Music className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-400 font-medium">+8%</span>
              <span className="text-muted-light ml-2 font-light">за последнюю неделю</span>
            </div>
          </div>

          <div className="bg-dark-card rounded-3xl p-8 border border-dark hover:border-purple-600/50 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted-light font-light mb-2">Объем торгов</p>
                <p className="text-4xl font-light text-light">45.2K SOL</p>
              </div>
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-600/30">
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-400 font-medium">+23%</span>
              <span className="text-muted-light ml-2 font-light">за последний месяц</span>
            </div>
          </div>

          <div className="bg-dark-card rounded-3xl p-8 border border-dark hover:border-purple-600/50 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted-light font-light mb-2">Активные дропы</p>
                <p className="text-4xl font-light text-light">12</p>
              </div>
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-600/30">
                <Rocket className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-purple-400 font-medium">3 новых</span>
              <span className="text-muted-light ml-2 font-light">на этой неделе</span>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-dark-card rounded-3xl p-8 border border-dark mb-16">
          <h2 className="text-3xl font-light text-light mb-10">Быстрые действия</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/create-drop" className="flex items-center space-x-4 p-6 border border-dark rounded-2xl hover:border-purple-600/50 hover:bg-purple-600/10 transition-all duration-200 group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <Plus className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-light mb-1">Создать дроп</p>
                <p className="text-sm text-muted-light font-light">Запустить новый музыкальный дроп</p>
              </div>
            </Link>

            <button className="flex items-center space-x-4 p-6 border border-dark rounded-2xl hover:border-purple-600/50 hover:bg-purple-600/10 transition-all duration-200 group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-light mb-1">Управление пользователями</p>
                <p className="text-sm text-muted-light font-light">Просмотр и модерация</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-dark rounded-2xl hover:border-purple-600/50 hover:bg-purple-600/10 transition-all duration-200 group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-light mb-1">Аналитика</p>
                <p className="text-sm text-muted-light font-light">Подробные отчеты</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-dark rounded-2xl hover:border-purple-600/50 hover:bg-purple-600/10 transition-all duration-200 group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-light mb-1">Настройки системы</p>
                <p className="text-sm text-muted-light font-light">Конфигурация платформы</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-dark rounded-2xl hover:border-purple-600/50 hover:bg-purple-600/10 transition-all duration-200 group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-light mb-1">Безопасность</p>
                <p className="text-sm text-muted-light font-light">Мониторинг и защита</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-dark rounded-2xl hover:border-purple-600/50 hover:bg-purple-600/10 transition-all duration-200 group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-light mb-1">Логи системы</p>
                <p className="text-sm text-muted-light font-light">Просмотр активности</p>
              </div>
            </button>
          </div>
        </div>

        {/* Последние активности */}
        <div className="bg-dark-card rounded-3xl p-8 border border-dark">
          <h2 className="text-3xl font-light text-light mb-10">Последние активности</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-6 p-6 bg-gray-800/50 rounded-2xl border border-dark">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-light mb-1">Новый дроп "Cosmic Beats" создан</p>
                <p className="text-sm text-muted-light font-light">2 минуты назад</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 p-6 bg-gray-800/50 rounded-2xl border border-dark">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-light mb-1">Пользователь @musiclover купил NFT за 2.5 SOL</p>
                <p className="text-sm text-muted-light font-light">15 минут назад</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 p-6 bg-gray-800/50 rounded-2xl border border-dark">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-light mb-1">Новый артист @synthmaster зарегистрировался</p>
                <p className="text-sm text-muted-light font-light">1 час назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}