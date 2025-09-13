// Конфигурация приложения
export const CONFIG = {
  // Solana настройки
  PROGRAM_ID: "9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T",
  NETWORK: "devnet",
  RPC_URL: "https://api.devnet.solana.com",
  EXPLORER_URL: "https://explorer.solana.com/address/9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T?cluster=devnet",
  
  // IPFS настройки
  IPFS_GATEWAY: "https://ipfs.io/ipfs/",
  
  // Настройки транзакций
  COMMITMENT: "processed" as const,
  TIMEOUT: 60000,
  MAX_RETRIES: 3,
  
  // Настройки UI
  ITEMS_PER_PAGE: 12,
  REFRESH_INTERVAL: 30000,
  
  // Поддерживаемые жанры
  GENRES: [
    "Electronic", "Rock", "Hip-Hop", "Jazz", "Classical", "Pop",
    "Blues", "Country", "Reggae", "Folk", "R&B", "Metal",
    "Punk", "Funk", "Soul", "Disco", "Techno", "House", "Trance", "Ambient"
  ],
  
  // Поддерживаемые тональности
  KEYS: [
    "C Major", "C Minor", "D Major", "D Minor", "E Major", "E Minor",
    "F Major", "F Minor", "G Major", "G Minor", "A Major", "A Minor",
    "B Major", "B Minor"
  ],
  
  // Настройки цен
  MIN_PRICE: 0.001,
  MAX_PRICE: 1000,
  DEFAULT_PRICE: 0.1,
  PRICE_STEP: 0.001,
  
  // Настройки BPM
  MIN_BPM: 60,
  MAX_BPM: 200,
  DEFAULT_BPM: 120,
  
  // Настройки файлов
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_AUDIO_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  SUPPORTED_AUDIO_TYPES: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
};

// Утилиты
export const utils = {
  // Конвертация SOL в lamports
  solToLamports: (sol: number): number => Math.floor(sol * 1e9),
  
  // Конвертация lamports в SOL
  lamportsToSol: (lamports: number): number => lamports / 1e9,
  
  // Форматирование цены
  formatPrice: (lamports: number): string => {
    const sol = lamports / 1e9;
    return `${sol.toFixed(4)} SOL`;
  },
  
  // Проверка валидности цены
  isValidPrice: (price: number): boolean => {
    return price >= CONFIG.MIN_PRICE && price <= CONFIG.MAX_PRICE;
  },
  
  // Проверка валидности BPM
  isValidBPM: (bpm: number): boolean => {
    return bpm >= CONFIG.MIN_BPM && bpm <= CONFIG.MAX_BPM;
  },
  
  // Проверка валидности жанра
  isValidGenre: (genre: string): boolean => {
    return CONFIG.GENRES.includes(genre);
  },
  
  // Проверка валидности тональности
  isValidKey: (key: string): boolean => {
    return CONFIG.KEYS.includes(key);
  },
  
  // Получение URL для просмотра транзакции
  getTransactionUrl: (signature: string): string => {
    return `${CONFIG.EXPLORER_URL.replace('/address/', '/tx/')}${signature}`;
  },
  
  // Получение URL для просмотра аккаунта
  getAccountUrl: (address: string): string => {
    return `${CONFIG.EXPLORER_URL.replace(CONFIG.PROGRAM_ID, address)}`;
  }
};
