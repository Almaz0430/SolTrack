'use client';

import { useState, useEffect } from 'react';

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedSort, setSelectedSort] = useState('Сортировка');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const categories = ['Все категории', 'Электронная музыка', 'Хип-хоп', 'Рок', 'Джаз'];
  const sortOptions = ['Сортировка', 'По цене ↑', 'По цене ↓', 'По популярности', 'Новые'];

  // Закрытие выпадающих списков при клике вне их
  useEffect(() => {
    const handleClickOutside = () => {
      setCategoryOpen(false);
      setSortOpen(false);
    };

    if (categoryOpen || sortOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [categoryOpen, sortOpen]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 lg:mb-20 space-y-8 lg:space-y-0">
          <div>
            <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-4">
              Маркетплейс
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light">
              Откройте для себя и торгуйте уникальными музыкальными NFT
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Категории */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setCategoryOpen(!categoryOpen);
                  setSortOpen(false);
                }}
                className="w-full sm:w-auto min-w-[200px] bg-white border border-gray-200 rounded-2xl px-6 py-4 text-left font-light text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span>{selectedCategory}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryOpen(false);
                      }}
                      className={`w-full px-6 py-4 text-left font-light hover:bg-gray-50 transition-colors ${selectedCategory === category ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Сортировка */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setCategoryOpen(false);
                }}
                className="w-full sm:w-auto min-w-[180px] bg-white border border-gray-200 rounded-2xl px-6 py-4 text-left font-light text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span>{selectedSort}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {sortOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortOpen(false);
                      }}
                      className={`w-full px-6 py-4 text-left font-light hover:bg-gray-50 transition-colors ${selectedSort === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* NFT карточка 1 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-gray-700 text-4xl">🎵</div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-gray-900">Midnight Dreams</h3>
                <p className="text-gray-600 font-light">by ElectroWave</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-gray-900">2.5 SOL</span>
                <span className="text-sm text-gray-500 font-light">$180</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 2 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-gray-700 text-4xl">🎸</div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-gray-900">Rock Anthem #42</h3>
                <p className="text-gray-600 font-light">by RockLegend</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-gray-900">1.8 SOL</span>
                <span className="text-sm text-gray-500 font-light">$129</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 3 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-gray-700 text-4xl">🎹</div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-gray-900">Jazz Fusion</h3>
                <p className="text-gray-600 font-light">by SmoothJazz</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-gray-900">3.2 SOL</span>
                <span className="text-sm text-gray-500 font-light">$230</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 4 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-gray-700 text-4xl">🥁</div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-gray-900">Beat Drop</h3>
                <p className="text-gray-600 font-light">by DrumMaster</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-gray-900">0.9 SOL</span>
                <span className="text-sm text-gray-500 font-light">$65</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 5 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-gray-700 text-4xl">🎤</div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-gray-900">Vocal Harmony</h3>
                <p className="text-gray-600 font-light">by VoiceAngel</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-gray-900">4.1 SOL</span>
                <span className="text-sm text-gray-500 font-light">$295</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 6 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-gray-700 text-4xl">🎺</div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-gray-900">Brass Section</h3>
                <p className="text-gray-600 font-light">by BrassKing</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-gray-900">1.5 SOL</span>
                <span className="text-sm text-gray-500 font-light">$108</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                Купить сейчас
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
            Загрузить еще
          </button>
        </div>
      </div>
    </div>
  );
}