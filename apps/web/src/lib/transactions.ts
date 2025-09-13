import { TransactionType, TransactionStatus } from '@prisma/client';

export interface CreateTransactionParams {
  signature: string;
  type: TransactionType;
  amount: number;
  status?: TransactionStatus;
  buyerAddress?: string;
  sellerAddress?: string;
  dropId?: string;
}

export interface UpdateTransactionParams {
  status?: TransactionStatus;
  buyerAddress?: string;
  sellerAddress?: string;
}

export class TransactionService {
  /**
   * Создает новую транзакцию в базе данных
   */
  static async createTransaction(params: CreateTransactionParams) {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка создания транзакции');
    }

    return result.data;
  }

  /**
   * Получает транзакцию по ID
   */
  static async getTransaction(id: string) {
    const response = await fetch(`/api/transactions/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка получения транзакции');
    }

    return result.data;
  }

  /**
   * Получает транзакцию по подписи
   */
  static async getTransactionBySignature(signature: string) {
    const response = await fetch(`/api/transactions/signature/${signature}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка получения транзакции');
    }

    return result.data;
  }

  /**
   * Обновляет транзакцию по ID
   */
  static async updateTransaction(id: string, params: UpdateTransactionParams) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка обновления транзакции');
    }

    return result.data;
  }

  /**
   * Обновляет транзакцию по подписи
   */
  static async updateTransactionBySignature(signature: string, params: UpdateTransactionParams) {
    const response = await fetch(`/api/transactions/signature/${signature}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка обновления транзакции');
    }

    return result.data;
  }

  /**
   * Получает список транзакций с фильтрацией
   */
  static async getTransactions(filters?: {
    status?: TransactionStatus;
    type?: TransactionType;
    dropId?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    
    if (filters?.status) searchParams.append('status', filters.status);
    if (filters?.type) searchParams.append('type', filters.type);
    if (filters?.dropId) searchParams.append('dropId', filters.dropId);
    if (filters?.limit) searchParams.append('limit', filters.limit.toString());
    if (filters?.offset) searchParams.append('offset', filters.offset.toString());

    const response = await fetch(`/api/transactions?${searchParams.toString()}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка получения транзакций');
    }

    return {
      data: result.data,
      pagination: result.pagination
    };
  }

  /**
   * Получает статистику дашборда
   */
  static async getDashboardStats(period: string = '7d') {
    const response = await fetch(`/api/stats/dashboard?period=${period}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка получения статистики');
    }

    return result.data;
  }

  /**
   * Создает транзакцию покупки NFT
   */
  static async createPurchaseTransaction(
    signature: string,
    amount: number,
    buyerAddress: string,
    dropId: string
  ) {
    return this.createTransaction({
      signature,
      type: TransactionType.PURCHASE,
      amount,
      status: TransactionStatus.PENDING,
      buyerAddress,
      dropId,
    });
  }

  /**
   * Создает транзакцию минтинга NFT
   */
  static async createMintTransaction(
    signature: string,
    amount: number,
    buyerAddress: string,
    dropId: string
  ) {
    return this.createTransaction({
      signature,
      type: TransactionType.MINT,
      amount,
      status: TransactionStatus.PENDING,
      buyerAddress,
      dropId,
    });
  }

  /**
   * Подтверждает транзакцию (обновляет статус на CONFIRMED)
   */
  static async confirmTransaction(signature: string) {
    return this.updateTransactionBySignature(signature, {
      status: TransactionStatus.CONFIRMED,
    });
  }

  /**
   * Отмечает транзакцию как неудачную
   */
  static async failTransaction(signature: string) {
    return this.updateTransactionBySignature(signature, {
      status: TransactionStatus.FAILED,
    });
  }
}
