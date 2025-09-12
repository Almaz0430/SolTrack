export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
              Добро пожаловать в
              <span className="block font-semibold text-blue-600 mt-2">SolTrack</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 font-light leading-relaxed">
              Децентрализованная платформа для музыки на блокчейне Solana
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105">
              Начать исследование
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Возможности платформы
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Откройте новые горизонты в мире музыкальных NFT
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-blue-100 transition-colors">
                <span className="text-3xl">🎵</span>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Музыкальные NFT</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Создавайте и торгуйте уникальными музыкальными токенами с полным контролем над правами
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-green-100 transition-colors">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Эксклюзивные дропы</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Участвуйте в лимитированных релизах от популярных артистов и получайте уникальные произведения
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-purple-100 transition-colors">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Открытый маркетплейс</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Покупайте и продавайте музыкальные NFT на прозрачном и безопасном рынке
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-8">
            Готовы начать?
          </h2>
          <p className="text-xl text-gray-600 font-light mb-12 leading-relaxed">
            Присоединяйтесь к революции в музыкальной индустрии
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105">
              Исследовать дропы
            </button>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-10 py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105">
              Посетить маркетплейс
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}