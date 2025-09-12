export default function DropsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16 lg:mb-20">
          <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            Музыкальные дропы
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Эксклюзивные релизы от ведущих артистов. Не упустите возможность стать владельцем уникальных музыкальных NFT
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Активный дроп */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-sm font-medium">
                  🔥 Активный
                </span>
                <span className="text-sm text-gray-500 font-light">2 дня осталось</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-gray-900">Cosmic Beats #001</h3>
                <p className="text-gray-600 font-light">by DJ Nebula</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Продано: 45/100</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{width: '45%'}}></div>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                Участвовать в дропе
              </button>
            </div>
          </div>

          {/* Предстоящий дроп */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm font-medium">
                  ⏰ Скоро
                </span>
                <span className="text-sm text-gray-500 font-light">через 5 дней</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-gray-900">Retro Wave Collection</h3>
                <p className="text-gray-600 font-light">by SynthMaster</p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 font-light">Лимитированная коллекция из 50 треков</p>
                <p className="text-2xl font-medium text-gray-900">0.5 SOL за NFT</p>
              </div>
              <button className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-medium cursor-not-allowed">
                Дроп не начался
              </button>
            </div>
          </div>

          {/* Завершенный дроп */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 opacity-60">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-2xl text-sm font-medium">
                  ✅ Завершен
                </span>
                <span className="text-sm text-gray-500 font-light">3 дня назад</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-gray-900">Underground Vibes</h3>
                <p className="text-gray-600 font-light">by BeatMaker</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Продано: 200/200</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <button className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-medium cursor-not-allowed">
                Дроп завершен
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <p className="text-xl text-gray-600 font-light mb-8">Хотите быть в курсе новых дропов?</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
            Подписаться на уведомления
          </button>
        </div>
      </div>
    </div>
  );
}