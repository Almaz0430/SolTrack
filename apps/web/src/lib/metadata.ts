import { IPFSService } from './ipfs';

// Стандарт метаданных NFT
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string; // Для музыкальных файлов
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
    creators: Array<{
      address: string;
      share: number;
    }>;
  };
}

export interface CreateMetadataParams {
  name: string;
  description: string;
  artist: string;
  genre?: string;
  duration?: number; // в секундах
  bpm?: number;
  key?: string;
  imageHash: string;
  musicHash: string;
  creatorAddress: string;
}

export class MetadataService {
  /**
   * Создает метаданные NFT в соответствии со стандартом
   */
  static createNFTMetadata(params: CreateMetadataParams): NFTMetadata {
    const {
      name,
      description,
      artist,
      genre,
      duration,
      bpm,
      key,
      imageHash,
      musicHash,
      creatorAddress,
    } = params;

    const attributes = [
      { trait_type: 'Artist', value: artist },
    ];

    if (genre) attributes.push({ trait_type: 'Genre', value: genre });
    if (duration) attributes.push({ trait_type: 'Duration', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` });
    if (bpm) attributes.push({ trait_type: 'BPM', value: bpm });
    if (key) attributes.push({ trait_type: 'Key', value: key });

    return {
      name,
      description,
      image: IPFSService.getIPFSUrl(imageHash),
      animation_url: IPFSService.getIPFSUrl(musicHash),
      external_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/nft/${musicHash}`,
      attributes,
      properties: {
        files: [
          {
            uri: IPFSService.getIPFSUrl(imageHash),
            type: 'image/jpeg', // или определять динамически
          },
          {
            uri: IPFSService.getIPFSUrl(musicHash),
            type: 'audio/mpeg', // или определять динамически
          },
        ],
        category: 'audio',
        creators: [
          {
            address: creatorAddress,
            share: 100,
          },
        ],
      },
    };
  }

  /**
   * Загружает метаданные в IPFS и возвращает хеш
   */
  static async uploadMetadata(params: CreateMetadataParams): Promise<string> {
    const metadata = this.createNFTMetadata(params);
    return await IPFSService.uploadJSON(metadata);
  }

  /**
   * Валидирует файл изображения
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Поддерживаются только JPEG, PNG, GIF и WebP изображения' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Размер изображения не должен превышать 10MB' };
    }

    return { valid: true };
  }

  /**
   * Валидирует музыкальный файл
   */
  static validateAudioFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Поддерживаются только MP3, WAV, FLAC и OGG файлы' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Размер аудиофайла не должен превышать 50MB' };
    }

    return { valid: true };
  }

  /**
   * Получает информацию об аудиофайле
   */
  static async getAudioInfo(file: File): Promise<{
    duration?: number;
    // Можно добавить другие метаданные аудио
  }> {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        resolve({
          duration: audio.duration,
        });
        URL.revokeObjectURL(url);
      });

      audio.addEventListener('error', () => {
        resolve({});
        URL.revokeObjectURL(url);
      });

      audio.src = url;
    });
  }
}