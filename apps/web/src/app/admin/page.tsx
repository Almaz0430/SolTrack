export default function AdminPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-4">
              Панель администратора
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light">
              Управление платформой SolTrack
            </p>
          </div>
          <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-medium">
            🟢 Система работает
          </div>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 font-light mb-2">Всего пользователей</p>
                <p className="text-4xl font-light text-gray-900">1,247</p>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-2 font-light">за последний месяц</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 font-light mb-2">Активные NFT</p>
                <p className="text-4xl font-light text-gray-900">3,892</p>
              </div>
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-2 font-light">за последнюю неделю</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 font-light mb-2">Объем торгов</p>
                <p className="text-4xl font-light text-gray-900">45.2K SOL</p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+23%</span>
              <span className="text-gray-500 ml-2 font-light">за последний месяц</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 font-light mb-2">Активные дропы</p>
                <p className="text-4xl font-light text-gray-900">12</p>
              </div>
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-blue-600 font-medium">3 новых</span>
              <span className="text-gray-500 ml-2 font-light">на этой неделе</span>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-10">Быстрые действия</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button className="flex items-center space-x-4 p-6 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <span className="text-xl">➕</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 mb-1">Создать дроп</p>
                <p className="text-sm text-gray-600 font-light">Запустить новый музыкальный дроп</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-gray-100 rounded-2xl hover:border-green-200 hover:bg-green-50 transition-all duration-200 group">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <span className="text-xl">👤</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 mb-1">Управление пользователями</p>
                <p className="text-sm text-gray-600 font-light">Просмотр и модерация</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-gray-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 group">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <span className="text-xl">📊</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 mb-1">Аналитика</p>
                <p className="text-sm text-gray-600 font-light">Подробные отчеты</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 group">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <span className="text-xl">⚙️</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 mb-1">Настройки системы</p>
                <p className="text-sm text-gray-600 font-light">Конфигурация платформы</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-gray-100 rounded-2xl hover:border-red-200 hover:bg-red-50 transition-all duration-200 group">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <span className="text-xl">🛡️</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 mb-1">Безопасность</p>
                <p className="text-sm text-gray-600 font-light">Мониторинг и защита</p>
              </div>
            </button>

            <button className="flex items-center space-x-4 p-6 border border-gray-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <span className="text-xl">📝</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 mb-1">Логи системы</p>
                <p className="text-sm text-gray-600 font-light">Просмотр активности</p>
              </div>
            </button>
          </div>
        </div>

        {/* Последние активности */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100">
          <h2 className="text-3xl font-light text-gray-900 mb-10">Последние активности</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-2xl">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Новый дроп "Cosmic Beats" создан</p>
                <p className="text-sm text-gray-500 font-light">2 минуты назад</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-2xl">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Пользователь @musiclover купил NFT за 2.5 SOL</p>
                <p className="text-sm text-gray-500 font-light">15 минут назад</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-2xl">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Новый артист @synthmaster зарегистрировался</p>
                <p className="text-sm text-gray-500 font-light">1 час назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}