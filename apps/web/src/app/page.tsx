export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Добро пожаловать в SolTrack
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Децентрализованная платформа для музыки на блокчейне Solana
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              🎵
            </div>
            <h3 className="text-xl font-semibold mb-2">Музыкальные NFT</h3>
            <p className="text-gray-600">
              Создавайте и торгуйте уникальными музыкальными токенами
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              🚀
            </div>
            <h3 className="text-xl font-semibold mb-2">Дропы</h3>
            <p className="text-gray-600">
              Участвуйте в эксклюзивных релизах от популярных артистов
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              💎
            </div>
            <h3 className="text-xl font-semibold mb-2">Маркетплейс</h3>
            <p className="text-gray-600">
              Покупайте и продавайте музыкальные NFT на открытом рынке
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Начать исследование
          </button>
        </div>
      </div>
    </div>
  );
}