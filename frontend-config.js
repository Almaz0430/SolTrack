// Конфигурация для фронтенда Music NFT
export const CONFIG = {
  // Основные настройки
  PROGRAM_ID: "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T",
  NETWORK: "devnet", // "devnet" или "mainnet-beta"
  RPC_URL: "https://api.devnet.solana.com",
  EXPLORER_URL: "https://explorer.solana.com/address/9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T?cluster=devnet",
  
  // Настройки для mainnet (когда будете готовы)
  MAINNET_CONFIG: {
    PROGRAM_ID: "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T", // Обновите для mainnet
    NETWORK: "mainnet-beta",
    RPC_URL: "https://api.mainnet-beta.solana.com",
    EXPLORER_URL: "https://explorer.solana.com/address/9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T",
  },
  
  // Настройки приложения
  APP: {
    NAME: "Music NFT Marketplace",
    DESCRIPTION: "Создавайте, продавайте и покупайте музыкальные NFT",
    VERSION: "1.0.0",
  },
  
  // Настройки транзакций
  TRANSACTION: {
    COMMITMENT: "processed", // "processed", "confirmed", "finalized"
    TIMEOUT: 60000, // 60 секунд
    MAX_RETRIES: 3,
  },
  
  // Настройки UI
  UI: {
    ITEMS_PER_PAGE: 12,
    REFRESH_INTERVAL: 30000, // 30 секунд
    SHOW_LOADING_INDICATORS: true,
  },
  
  // Поддерживаемые жанры
  GENRES: [
    "Electronic",
    "Rock", 
    "Hip-Hop",
    "Jazz",
    "Classical",
    "Pop",
    "Blues",
    "Country",
    "Reggae",
    "Folk",
    "R&B",
    "Metal",
    "Punk",
    "Funk",
    "Soul",
    "Disco",
    "Techno",
    "House",
    "Trance",
    "Ambient"
  ],
  
  // Поддерживаемые тональности
  KEYS: [
    "C Major", "C Minor",
    "D Major", "D Minor", 
    "E Major", "E Minor",
    "F Major", "F Minor",
    "G Major", "G Minor",
    "A Major", "A Minor",
    "B Major", "B Minor"
  ],
  
  // Настройки цен
  PRICING: {
    MIN_PRICE: 0.001, // Минимальная цена в SOL
    MAX_PRICE: 1000,  // Максимальная цена в SOL
    DEFAULT_PRICE: 0.1, // Цена по умолчанию
    PRICE_STEP: 0.001, // Шаг изменения цены
  },
  
  // Настройки BPM
  BPM: {
    MIN: 60,
    MAX: 200,
    DEFAULT: 120,
  },
  
  // Настройки файлов
  FILES: {
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_AUDIO_SIZE: 100 * 1024 * 1024, // 100MB
    SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    SUPPORTED_AUDIO_TYPES: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
  },
  
  // Настройки IPFS (если используете)
  IPFS: {
    GATEWAY: "https://ipfs.io/ipfs/",
    PINATA_API_URL: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    // Добавьте ваши API ключи
    PINATA_API_KEY: process.env.REACT_APP_PINATA_API_KEY || "",
    PINATA_SECRET_KEY: process.env.REACT_APP_PINATA_SECRET_KEY || "",
  },
  
  // Настройки уведомлений
  NOTIFICATIONS: {
    SUCCESS_DURATION: 5000, // 5 секунд
    ERROR_DURATION: 10000,  // 10 секунд
    POSITION: "top-right",
  },
  
  // Настройки кеширования
  CACHE: {
    NFT_DATA_TTL: 5 * 60 * 1000, // 5 минут
    USER_NFTS_TTL: 2 * 60 * 1000, // 2 минуты
    AVAILABLE_NFTS_TTL: 1 * 60 * 1000, // 1 минута
  }
};

// Утилиты для работы с конфигурацией
export const utils = {
  // Получение текущей конфигурации
  getConfig: () => CONFIG,
  
  // Переключение между devnet и mainnet
  switchToMainnet: () => {
    return {
      ...CONFIG,
      ...CONFIG.MAINNET_CONFIG
    };
  },
  
  // Проверка валидности цены
  isValidPrice: (price) => {
    return price >= CONFIG.PRICING.MIN_PRICE && price <= CONFIG.PRICING.MAX_PRICE;
  },
  
  // Проверка валидности BPM
  isValidBPM: (bpm) => {
    return bpm >= CONFIG.BPM.MIN && bpm <= CONFIG.BPM.MAX;
  },
  
  // Проверка валидности жанра
  isValidGenre: (genre) => {
    return CONFIG.GENRES.includes(genre);
  },
  
  // Проверка валидности тональности
  isValidKey: (key) => {
    return CONFIG.KEYS.includes(key);
  },
  
  // Форматирование цены
  formatPrice: (lamports) => {
    const sol = lamports / 1e9;
    return `${sol.toFixed(4)} SOL`;
  },
  
  // Конвертация SOL в lamports
  solToLamports: (sol) => {
    return Math.floor(sol * 1e9);
  },
  
  // Конвертация lamports в SOL
  lamportsToSol: (lamports) => {
    return lamports / 1e9;
  },
  
  // Получение URL для просмотра транзакции
  getTransactionUrl: (signature) => {
    return `${CONFIG.EXPLORER_URL.replace('/address/', '/tx/')}${signature}`;
  },
  
  // Получение URL для просмотра аккаунта
  getAccountUrl: (address) => {
    return `${CONFIG.EXPLORER_URL.replace(CONFIG.PROGRAM_ID, address)}`;
  }
};

// Экспорт по умолчанию
export default CONFIG;
