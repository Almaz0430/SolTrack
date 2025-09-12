export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Панель Администратора</h1>
            <p className="text-lg text-gray-600 mt-2">
              Управление платформой SolTrack
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            🟢 Система работает
          </div>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего пользователей</p>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                👥
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600">+12%</span>
              <span className="text-gray-600 ml-2">за последний месяц</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Активные NFT</p>
                <p className="text-3xl font-bold text-gray-900">3,892</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                🎵
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600">+8%</span>
              <span className="text-gray-600 ml-2">за последнюю неделю</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Объем торгов</p>
                <p className="text-3xl font-bold text-gray-900">45.2K SOL</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600">+23%</span>
              <span className="text-gray-600 ml-2">за последний месяц</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Активные дропы</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                🚀
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600">3 новых</span>
              <span className="text-gray-600 ml-2">на этой неделе</span>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                ➕
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Создать дроп</p>
                <p className="text-sm text-gray-600">Запустить новый музыкальный дроп</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                👤
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Управление пользователями</p>
                <p className="text-sm text-gray-600">Просмотр и модерация</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                📊
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Аналитика</p>
                <p className="text-sm text-gray-600">Подробные отчеты</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                ⚙️
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Настройки системы</p>
                <p className="text-sm text-gray-600">Конфигурация платформы</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                🛡️
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Безопасность</p>
                <p className="text-sm text-gray-600">Мониторинг и защита</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                📝
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Логи системы</p>
                <p className="text-sm text-gray-600">Просмотр активности</p>
              </div>
            </button>
          </div>
        </div>

        {/* Последние активности */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Последние активности</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Новый дроп "Cosmic Beats" создан</p>
                <p className="text-sm text-gray-600">2 минуты назад</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Пользователь @musiclover купил NFT за 2.5 SOL</p>
                <p className="text-sm text-gray-600">15 минут назад</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Новый артист @synthmaster зарегистрировался</p>
                <p className="text-sm text-gray-600">1 час назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}