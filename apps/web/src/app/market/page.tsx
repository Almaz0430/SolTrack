export default function MarketPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Маркетплейс</h1>
            <p className="text-lg text-gray-600 mt-2">
              Откройте для себя и торгуйте уникальными музыкальными NFT
            </p>
          </div>
          
          <div className="flex space-x-4">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Все категории</option>
              <option>Электронная музыка</option>
              <option>Хип-хоп</option>
              <option>Рок</option>
              <option>Джаз</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Сортировка</option>
              <option>По цене ↑</option>
              <option>По цене ↓</option>
              <option>По популярности</option>
              <option>Новые</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* NFT карточка 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <div className="text-white text-4xl">🎵</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">Midnight Dreams</h3>
                <p className="text-gray-600 text-sm">by ElectroWave</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">2.5 SOL</span>
                <span className="text-sm text-gray-500">$180</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <div className="text-white text-4xl">🎸</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">Rock Anthem #42</h3>
                <p className="text-gray-600 text-sm">by RockLegend</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">1.8 SOL</span>
                <span className="text-sm text-gray-500">$129</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
              <div className="text-white text-4xl">🎹</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">Jazz Fusion</h3>
                <p className="text-gray-600 text-sm">by SmoothJazz</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">3.2 SOL</span>
                <span className="text-sm text-gray-500">$230</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
              <div className="text-white text-4xl">🥁</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">Beat Drop</h3>
                <p className="text-gray-600 text-sm">by DrumMaster</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">0.9 SOL</span>
                <span className="text-sm text-gray-500">$65</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 5 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
              <div className="text-white text-4xl">🎤</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">Vocal Harmony</h3>
                <p className="text-gray-600 text-sm">by VoiceAngel</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">4.1 SOL</span>
                <span className="text-sm text-gray-500">$295</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 6 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center">
              <div className="text-white text-4xl">🎺</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">Brass Section</h3>
                <p className="text-gray-600 text-sm">by BrassKing</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">1.5 SOL</span>
                <span className="text-sm text-gray-500">$108</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Купить сейчас
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
            Загрузить еще
          </button>
        </div>
      </div>
    </div>
  );
}