import { Music, Rocket, Gem } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-dark min-h-screen">
      {/* ЛЕНДИНГ */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center" style={{backgroundImage: 'url(/img/background.jpg)'}}>
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-light text-light mb-8 leading-tight">
              Добро пожаловать в
              <span className="block mt-2 pixel-logo text-6xl lg:text-8xl">
                <span className="sol-part">Sol</span>Track
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-light mb-12 font-light leading-relaxed">
              Децентрализованная платформа для музыки на блокчейне Solana
            </p>
            <Link 
              href="/drops"
              className="accent-purple text-white px-12 py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25 inline-block"
            >
              Начать исследование
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-light mb-6">
              Возможности платформы
            </h2>
            <p className="text-xl text-muted-light font-light max-w-2xl mx-auto">
              Откройте новые горизонты в мире музыкальных NFT
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <Music className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-medium text-light mb-4">Музыкальные NFT</h3>
              <p className="text-lg text-muted-light font-light leading-relaxed">
                Создавайте и торгуйте уникальными музыкальными токенами с полным контролем над правами
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <Rocket className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-medium text-light mb-4">Эксклюзивные дропы</h3>
              <p className="text-lg text-muted-light font-light leading-relaxed">
                Участвуйте в лимитированных релизах от популярных артистов и получайте уникальные произведения
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                <Gem className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-medium text-light mb-4">Открытый маркетплейс</h3>
              <p className="text-lg text-muted-light font-light leading-relaxed">
                Покупайте и продавайте музыкальные NFT на прозрачном и безопасном рынке
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-card py-24 lg:py-32 border-t border-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-light text-light mb-8">
            Готовы начать?
          </h2>
          <p className="text-xl text-muted-light font-light mb-12 leading-relaxed">
            Присоединяйтесь к революции в музыкальной индустрии
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/drops"
              className="accent-purple text-white px-10 py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25 text-center"
            >
              Исследовать дропы
            </Link>
            <Link 
              href="/market"
              className="border-2 border-purple-600/50 hover:border-purple-600 text-muted-light hover:text-light px-10 py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105 hover:bg-purple-600/10 text-center"
            >
              Посетить маркетплейс
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}