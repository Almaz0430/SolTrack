'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNFTTransactions } from '@/hooks/useNFTTransactions';
import { History, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Transaction {
  signature: string;
  blockTime: number | null;
  slot: number;
  transaction: any;
}

export function TransactionHistory() {
  const { connected } = useWallet();
  const { getTransactionHistory } = useNFTTransactions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTransactions = async () => {
    if (!connected) return;
    
    setLoading(true);
    try {
      const history = await getTransactionHistory(5);
      setTransactions(history);
    } catch (error) {
      console.error('Ошибка загрузки истории транзакций:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && isOpen) {
      fetchTransactions();
    }
  }, [connected, isOpen]);

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Неизвестно';
    // Используем фиксированную локаль для консистентности между сервером и клиентом
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  };

  const getTransactionStatus = (transaction: any) => {
    if (!transaction) return 'unknown';
    return transaction.meta?.err ? 'failed' : 'success';
  };

  if (!connected) {
    return null;
  }

  return (
    <div className="bg-dark-card border border-dark rounded-2xl p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full text-left"
      >
        <History className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-medium text-light">История транзакций</h3>
        <svg
          className={`w-5 h-5 text-muted-light transition-transform duration-200 ml-auto ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-light">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>Загрузка...</span>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-muted-light text-center py-8">
              Транзакции не найдены
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const status = getTransactionStatus(tx.transaction);
                return (
                  <div
                    key={tx.signature}
                    className="bg-dark border border-dark rounded-xl p-4 hover:border-purple-600/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : status === 'failed' ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className="text-sm font-mono text-light">
                            {formatSignature(tx.signature)}
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-light space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(tx.blockTime)}</span>
                          </div>
                          <div>Слот: {tx.slot}</div>
                        </div>
                      </div>

                      <a
                        href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                        title="Открыть в Solana Explorer"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-light" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="w-full text-center text-purple-400 hover:text-purple-300 text-sm py-2 transition-colors"
          >
            Обновить историю
          </button>
        </div>
      )}
    </div>
  );
}