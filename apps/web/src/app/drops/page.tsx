export default function DropsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Музыкальные Дропы
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Эксклюзивные релизы от ведущих артистов. Не упустите возможность стать владельцем уникальных музыкальных NFT.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Активный дроп */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 Активный
                </span>
                <span className="text-sm opacity-90">2 дня осталось</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Cosmic Beats #001</h3>
                <p className="text-sm opacity-90">by DJ Nebula</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Продано: 45/100</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Участвовать в дропе
              </button>
            </div>
          </div>

          {/* Предстоящий дроп */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  ⏰ Скоро
                </span>
                <span className="text-sm text-gray-500">через 5 дней</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Retro Wave Collection</h3>
                <p className="text-sm text-gray-600">by SynthMaster</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Лимитированная коллекция из 50 треков</p>
                <p className="text-lg font-bold text-gray-900">0.5 SOL за NFT</p>
              </div>
              <button className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed">
                Дроп не начался
              </button>
            </div>
          </div>

          {/* Завершенный дроп */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 opacity-75">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Завершен
                </span>
                <span className="text-sm text-gray-500">3 дня назад</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Underground Vibes</h3>
                <p className="text-sm text-gray-600">by BeatMaker</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Продано: 200/200</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <button className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed">
                Дроп завершен
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Хотите быть в курсе новых дропов?</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Подписаться на уведомления
          </button>
        </div>
      </div>
    </div>
  );
}