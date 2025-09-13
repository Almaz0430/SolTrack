'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetadataService } from '@/lib/metadata';
import { SolanaService } from '@/lib/solana';
import { UploadProgress } from '@/components/ui/upload-progress';
import { 
  Music, 
  Image as ImageIcon, 
  Upload, 
  X, 
  DollarSign, 
  Hash, 
  User, 
  FileText, 
  Headphones,
  Zap,
  ArrowLeft
} from 'lucide-react';

interface CreateDropFormProps {
  onSuccess?: (signature: string) => void;
  onCancel?: () => void;
}

type StepStatus = 'pending' | 'loading' | 'completed' | 'error';

export function CreateDropForm({ onSuccess, onCancel }: CreateDropFormProps) {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSteps, setUploadSteps] = useState([
    { label: 'Загрузка файлов и метаданных', status: 'pending' as StepStatus },
    { label: 'Создание дропа в блокчейне', status: 'pending' as StepStatus },
  ]);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    artist: '',
    genre: '',
    price: '',
    totalSupply: '',
    bpm: '',
    key: '',
  });

  // Файлы
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = MetadataService.validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Неверный формат изображения');
      return;
    }

    setImageFile(file);
    setError(null);

    // Создаем превью
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = MetadataService.validateAudioFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Неверный формат аудиофайла');
      return;
    }

    setMusicFile(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.publicKey) {
      setError('Подключите кошелек');
      return;
    }

    if (!imageFile) {
      setError('Загрузите изображение');
      return;
    }

    if (!musicFile) {
      setError('Загрузите музыкальный файл');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadSteps([
      { label: 'Загрузка файлов и метаданных', status: 'pending' as StepStatus },
      { label: 'Создание дропа в блокчейне', status: 'pending' as StepStatus },
    ]);

    try {
      // Step 1: Upload assets and metadata via backend
      setUploadSteps(prev => prev.map((step, i) => i === 0 ? { ...step, status: 'loading' } : step));
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('artist', formData.artist);
      if (formData.genre) formDataToSend.append('genre', formData.genre);
      if (formData.bpm) formDataToSend.append('bpm', formData.bpm);
      if (formData.key) formDataToSend.append('key', formData.key);
      formDataToSend.append('imageFile', imageFile);
      formDataToSend.append('musicFile', musicFile);
      formDataToSend.append('creatorAddress', wallet.publicKey.toString());

      const response = await fetch('/api/create-drop', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при загрузке файлов');
      }

      const { imageHash, musicHash, metadataHash } = result;
      
      setUploadSteps(prev => prev.map((step, i) => i === 0 ? { ...step, status: 'completed' } : step));

      // Step 2: Create drop on Solana
      setUploadSteps(prev => prev.map((step, i) => i === 1 ? { ...step, status: 'loading' } : step));

      const startTime = new Date();
      const endTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const signature = await SolanaService.createDrop(wallet, {
        name: formData.name,
        description: formData.description,
        artist: formData.artist,
        price: parseFloat(formData.price),
        totalSupply: parseInt(formData.totalSupply),
        startTime,
        endTime,
        imageHash,
        musicHash,
        metadataHash,
      });

      setUploadSteps(prev => prev.map((step, i) => i === 1 ? { ...step, status: 'completed' } : step));

      console.log('Дроп создан успешно!', signature);
      onSuccess?.(signature);

    } catch (err) {
      console.error('Ошибка создания дропа:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании дропа');
      setUploadSteps(prev => prev.map(step => 
        step.status === 'loading' ? { ...step, status: 'error' } : step
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-muted-light hover:text-light"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-4xl font-bold text-light mb-2">Создать дроп</h1>
            <p className="text-muted-light">Загрузите свою музыку и создайте уникальный NFT дроп</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-purple-600/10 px-4 py-2 rounded-xl border border-purple-600/20">
          <Zap className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-medium">Powered by Solana</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-600/10 border border-red-600/20 text-red-400 p-4 rounded-2xl mb-8 flex items-center space-x-3">
          <X className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="mb-8">
          <UploadProgress steps={uploadSteps} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <div className="bg-gray-900/50 rounded-3xl p-8 border border-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-600/20 rounded-xl">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-light">Основная информация</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-2 text-light font-medium mb-3">
                  <Music className="w-4 h-4" />
                  <span>Название дропа *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400"
                  placeholder="Cosmic Beats #001"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-light font-medium mb-3">
                  <User className="w-4 h-4" />
                  <span>Артист *</span>
                </label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400"
                  placeholder="DJ Nebula"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-light font-medium mb-3">
                  <Headphones className="w-4 h-4" />
                  <span>Жанр</span>
                </label>
                <div className="relative">
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none"
                  >
                    <option value="">Выберите жанр</option>
                    <option value="Electronic">Электронная музыка</option>
                    <option value="Hip-Hop">Хип-хоп</option>
                    <option value="Rock">Рок</option>
                    <option value="Jazz">Джаз</option>
                    <option value="Pop">Поп</option>
                    <option value="Classical">Классическая</option>
                    <option value="Ambient">Эмбиент</option>
                    <option value="Techno">Техно</option>
                    <option value="House">Хаус</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-light font-medium mb-3">
                <FileText className="w-4 h-4" />
                <span>Описание *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none placeholder-gray-400"
                placeholder="Расскажите о вашем музыкальном дропе. Что делает его особенным? Какая история стоит за этой музыкой?"
              />
            </div>
          </div>
        </div>

        {/* Параметры дропа */}
        <div className="bg-gray-900/50 rounded-3xl p-8 border border-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-600/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-light">Параметры дропа</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-light font-medium mb-3">
                <DollarSign className="w-4 h-4" />
                <span>Цена (SOL) *</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400"
                placeholder="2.5"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-light font-medium mb-3">
                <Hash className="w-4 h-4" />
                <span>Количество *</span>
              </label>
              <input
                type="number"
                name="totalSupply"
                value={formData.totalSupply}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400"
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="flex items-center space-x-2 text-light font-medium mb-3">
                <Zap className="w-4 h-4" />
                <span>BPM</span>
              </label>
              <input
                type="number"
                name="bpm"
                value={formData.bpm}
                onChange={handleInputChange}
                min="1"
                max="300"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400"
                placeholder="128"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-light font-medium mb-3">
                <Music className="w-4 h-4" />
                <span>Тональность</span>
              </label>
              <input
                type="text"
                name="key"
                value={formData.key}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-4 text-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400"
                placeholder="C major"
              />
            </div>
          </div>
        </div>

        {/* Загрузка файлов */}
        <div className="bg-gray-900/50 rounded-3xl p-8 border border-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-600/20 rounded-xl">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-light">Медиа файлы</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Обложка */}
            <div>
              <label className="flex items-center space-x-2 text-light font-medium mb-4">
                <ImageIcon className="w-4 h-4" />
                <span>Обложка *</span>
              </label>
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-2xl border border-gray-700"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-colors flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Удалить</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-purple-500/50 hover:bg-purple-600/5 transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-purple-600/20 rounded-2xl group-hover:bg-purple-600/30 transition-colors">
                          <ImageIcon className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-light font-medium mb-2">Загрузите обложку</p>
                          <p className="text-muted-light text-sm">JPEG, PNG, GIF, WebP до 10MB</p>
                        </div>
                        <div className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span>Выбрать файл</span>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Музыкальный файл */}
            <div>
              <label className="flex items-center space-x-2 text-light font-medium mb-4">
                <Music className="w-4 h-4" />
                <span>Музыкальный файл *</span>
              </label>
              <div className="relative group">
                {musicFile ? (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-600/20 rounded-xl">
                        <Music className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-light font-medium truncate">{musicFile.name}</p>
                        <p className="text-muted-light text-sm">
                          {(musicFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMusicFile(null)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-purple-500/50 hover:bg-purple-600/5 transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleMusicChange}
                      className="hidden"
                      id="music-upload"
                    />
                    <label htmlFor="music-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-purple-600/20 rounded-2xl group-hover:bg-purple-600/30 transition-colors">
                          <Music className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-light font-medium mb-2">Загрузите музыкальный файл</p>
                          <p className="text-muted-light text-sm">MP3, WAV, FLAC, OGG до 50MB</p>
                        </div>
                        <div className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span>Выбрать файл</span>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4 pt-8">
          <button
            type="submit"
            disabled={isLoading || !wallet.publicKey}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Создание дропа...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Создать дроп</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}