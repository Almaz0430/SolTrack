import { Drop } from '@prisma/client';

const API_BASE = '/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  missingFields?: string[];
}

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

// ДРОПЫ
export const dropsApi = {
  async getAll(params?: { status?: string; search?: string }): Promise<ApiResponse<Drop[]>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return apiRequest<Drop[]>(`/drops${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>(`/drops/${id}`);
  },

  async create(dropData: Omit<Drop, 'id' | 'createdAt' | 'updatedAt' | 'mintedSupply'>): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>('/drops', {
      method: 'POST',
      body: JSON.stringify(dropData),
    });
  },

  async update(id: string, updates: Partial<Drop>): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>(`/drops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/drops/${id}`, {
      method: 'DELETE',
    });
  },

  async activate(id: string): Promise<ApiResponse<Drop>> {
    return apiRequest<Drop>(`/drops/${id}/activate`, {
      method: 'POST',
    });
  },

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

export const formatters = {
  date: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  },

  price: (price: string): string => {
    return `${parseFloat(price).toFixed(4)} SOL`;
  },

  percentage: (value: string): string => {
    return `${parseFloat(value).toFixed(2)}%`;
  },

  progress: (minted: number, total: number): { percentage: number; text: string } => {
    const percentage = total > 0 ? Math.round((minted / total) * 100) : 0;
    return {
      percentage,
      text: `${minted} / ${total} (${percentage}%)`,
    };
  },
};

export const validators = {
  price: (value: string): string | null => {
    const price = parseFloat(value);
    if (isNaN(price) || price <= 0) {
      return 'Цена должна быть положительным числом';
    }
    return null;
  },

  totalSupply: (value: number): string | null => {
    if (!Number.isInteger(value) || value <= 0) {
      return 'Тираж должен быть положительным целым числом';
    }
    return null;
  },

  percentage: (value: string, fieldName: string): string | null => {
    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return `${fieldName} должно быть от 0 до 100%`;
    }
    return null;
  },

  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} обязательно для заполнения`;
    }
    return null;
  },
};