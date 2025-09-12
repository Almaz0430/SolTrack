'use client';

import { useState, useEffect } from 'react';
import { Music, Guitar, Piano, Drum, Mic, Volume2 } from 'lucide-react';

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
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 lg:mb-20 space-y-8 lg:space-y-0">
          <div>
            <h1 className="text-4xl lg:text-6xl font-light text-light mb-4">
              Маркетплейс
            </h1>
            <p className="text-xl lg:text-2xl text-muted-light font-light">
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
                className="w-full sm:w-auto min-w-[200px] bg-dark-card border border-dark rounded-2xl px-6 py-4 text-left font-light text-muted-light hover:border-purple-600/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span>{selectedCategory}</span>
                <svg
                  className={`w-5 h-5 text-muted-light transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark rounded-2xl shadow-lg shadow-black/50 z-10 overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryOpen(false);
                      }}
                      className={`w-full px-6 py-4 text-left font-light hover:bg-purple-600/20 transition-colors ${selectedCategory === category ? 'text-purple-400 bg-purple-600/20' : 'text-muted-light'
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
                className="w-full sm:w-auto min-w-[180px] bg-dark-card border border-dark rounded-2xl px-6 py-4 text-left font-light text-muted-light hover:border-purple-600/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span>{selectedSort}</span>
                <svg
                  className={`w-5 h-5 text-muted-light transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {sortOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark rounded-2xl shadow-lg shadow-black/50 z-10 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortOpen(false);
                      }}
                      className={`w-full px-6 py-4 text-left font-light hover:bg-purple-600/20 transition-colors ${selectedSort === option ? 'text-purple-400 bg-purple-600/20' : 'text-muted-light'
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
          <div className="bg-dark-card rounded-3xl overflow-hidden border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 group hover:border-purple-600/50">
            <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-b border-dark">
              <Music className="w-16 h-16 text-purple-400" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-light">Midnight Dreams</h3>
                <p className="text-muted-light font-light">by ElectroWave</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-light">2.5 SOL</span>
                <span className="text-sm text-muted-light font-light">$180</span>
              </div>
              <button className="w-full accent-purple text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 2 */}
          <div className="bg-dark-card rounded-3xl overflow-hidden border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 group hover:border-purple-600/50">
            <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-b border-dark">
              <Guitar className="w-16 h-16 text-purple-400" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-light">Rock Anthem #42</h3>
                <p className="text-muted-light font-light">by RockLegend</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-light">1.8 SOL</span>
                <span className="text-sm text-muted-light font-light">$129</span>
              </div>
              <button className="w-full accent-purple text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 3 */}
          <div className="bg-dark-card rounded-3xl overflow-hidden border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 group hover:border-purple-600/50">
            <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-b border-dark">
              <Piano className="w-16 h-16 text-purple-400" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-light">Jazz Fusion</h3>
                <p className="text-muted-light font-light">by SmoothJazz</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-light">3.2 SOL</span>
                <span className="text-sm text-muted-light font-light">$230</span>
              </div>
              <button className="w-full accent-purple text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 4 */}
          <div className="bg-dark-card rounded-3xl overflow-hidden border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 group hover:border-purple-600/50">
            <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-b border-dark">
              <Drum className="w-16 h-16 text-purple-400" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-light">Beat Drop</h3>
                <p className="text-muted-light font-light">by DrumMaster</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-light">0.9 SOL</span>
                <span className="text-sm text-muted-light font-light">$65</span>
              </div>
              <button className="w-full accent-purple text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 5 */}
          <div className="bg-dark-card rounded-3xl overflow-hidden border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 group hover:border-purple-600/50">
            <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-b border-dark">
              <Mic className="w-16 h-16 text-purple-400" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-light">Vocal Harmony</h3>
                <p className="text-muted-light font-light">by VoiceAngel</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-light">4.1 SOL</span>
                <span className="text-sm text-muted-light font-light">$295</span>
              </div>
              <button className="w-full accent-purple text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25">
                Купить сейчас
              </button>
            </div>
          </div>

          {/* NFT карточка 6 */}
          <div className="bg-dark-card rounded-3xl overflow-hidden border border-dark hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 group hover:border-purple-600/50">
            <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-b border-dark">
              <Volume2 className="w-16 h-16 text-purple-400" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-xl text-light">Brass Section</h3>
                <p className="text-muted-light font-light">by BrassKing</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-medium text-light">1.5 SOL</span>
                <span className="text-sm text-muted-light font-light">$108</span>
              </div>
              <button className="w-full accent-purple text-white py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25">
                Купить сейчас
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-dark-card hover:bg-purple-600/20 text-muted-light hover:text-light border border-dark hover:border-purple-600/50 px-10 py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
            Загрузить еще
          </button>
        </div>
      </div>
    </div>
  );
}