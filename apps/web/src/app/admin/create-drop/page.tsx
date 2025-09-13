'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateDropForm } from '@/components/forms/create-drop-form';
import { PartyPopper } from 'lucide-react';

export default function CreateDropPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const handleSuccess = (txSignature: string) => {
    setSignature(txSignature);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  if (showSuccess) {
    return (
      <div className="bg-dark min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-600/20 to-green-600/20 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 border border-purple-600/30">
            <PartyPopper className="w-16 h-16 text-purple-400" />
          </div>
          
          <h1 className="text-5xl font-bold text-light mb-4">
            Дроп создан!
          </h1>
          <p className="text-xl text-muted-light mb-8">
            Ваш музыкальный дроп успешно загружен в блокчейн Solana
          </p>
          
          {signature && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
              <p className="text-muted-light mb-3 font-medium">Подпись транзакции:</p>
              <p className="text-purple-400 font-mono text-sm break-all bg-gray-800/50 p-3 rounded-xl">
                {signature}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/drops')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-600/25"
            >
              Посмотреть дропы
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-800 hover:bg-gray-700 text-muted-light hover:text-light border border-gray-700 px-8 py-4 rounded-2xl font-medium transition-all duration-200"
            >
              Админ панель
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen">
      <div className="mx-auto px-6 lg:px-8 py-8 max-w-7xl">
        <CreateDropForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}