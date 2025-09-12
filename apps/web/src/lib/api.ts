import { Drop } from '@prisma/client';

// Базовый URL для API
const API_BASE = '/api';

// Интерфейс для ответа API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  missingFields?: string[];
}

// Утилита для выполнения запросов
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}

// API для работы с дропами
export const dropsApi = {
  // Получить все дропы
  async getAll(params?: { status?: string; search?: string }): Promise<ApiResponse<Drop[]>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return apiRequest<Drop[]>(`/drops${query ? `?${query}` : ''}`);
  },

  // Получить дроп по ID
  async getById(id: string): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>(`/drops/${id}`);
  },

  // Создать новый дроп
  async create(dropData: Omit<Drop, 'id' | 'createdAt' | 'updatedAt' | 'mintedSupply'>): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>('/drops', {
      method: 'POST',
      body: JSON.stringify(dropData),
    });
  },

  // Обновить дроп
  async update(id: string, updates: Partial<Drop>): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>(`/drops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Удалить дроп
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/drops/${id}`, {
      method: 'DELETE',
    });
  },

  // Активировать дроп
  async activate(id: string): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>(`/drops/${id}/activate`, {
      method: 'POST',
    });
  },

  // Завершить дроп
  async complete(id: string): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>(`/drops/${id}/complete`, {
      method: 'POST',
    });
  },
};

// Хук для уведомлений (можно заменить на toast библиотеку)
export const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  // Простая реализация через alert, можно заменить на более красивые уведомления
  if (type === 'error') {
    console.error(message);
    alert(`Ошибка: ${message}`);
  } else {
    console.log(message);
    alert(`Успех: ${message}`);
  }
};

// Утилиты для форматирования
export const formatters = {
  // Форматирование даты
  date: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Форматирование цены
  price: (price: string): string => {
    return `${parseFloat(price).toFixed(4)} SOL`;
  },

  // Форматирование процентов
  percentage: (value: string): string => {
    return `${parseFloat(value).toFixed(2)}%`;
  },

  // Форматирование прогресса
  progress: (minted: number, total: number): { percentage: number; text: string } => {
    const percentage = total > 0 ? Math.round((minted / total) * 100) : 0;
    return {
      percentage,
      text: `${minted} / ${total} (${percentage}%)`,
    };
  },
};

// Валидаторы
export const validators = {
  // Валидация цены
  price: (value: string): string | null => {
    const price = parseFloat(value);
    if (isNaN(price) || price <= 0) {
      return 'Цена должна быть положительным числом';
    }
    return null;
  },

  // Валидация тиража
  totalSupply: (value: number): string | null => {
    if (!Number.isInteger(value) || value <= 0) {
      return 'Тираж должен быть положительным целым числом';
    }
    return null;
  },

  // Валидация процентов
  percentage: (value: string, fieldName: string): string | null => {
    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return `${fieldName} должно быть от 0 до 100%`;
    }
    return null;
  },

  // Валидация обязательного поля
  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} обязательно для заполнения`;
    }
    return null;
  },
};