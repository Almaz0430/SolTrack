'use client';

import { Check, X, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  steps: Array<{
    label: string;
    status: 'pending' | 'loading' | 'completed' | 'error';
  }>;
}

export function UploadProgress({ steps }: UploadProgressProps) {
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-light">Создание дропа</h3>
        <div className="text-muted-light">
          {completedSteps}/{totalSteps} завершено
        </div>
      </div>
      
      {/* Прогресс бар */}
      <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
        <div 
          className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              step.status === 'completed' 
                ? 'bg-green-600/20 border border-green-600/30'
                : step.status === 'loading'
                ? 'bg-purple-600/20 border border-purple-600/30'
                : step.status === 'error'
                ? 'bg-red-600/20 border border-red-600/30'
                : 'bg-gray-800 border border-gray-700'
            }`}>
              {step.status === 'completed' ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : step.status === 'error' ? (
                <X className="w-5 h-5 text-red-400" />
              ) : step.status === 'loading' ? (
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              ) : (
                <span className="text-muted-light font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <span className={`font-medium transition-colors ${
                step.status === 'completed' ? 'text-green-400' :
                step.status === 'loading' ? 'text-purple-400' :
                step.status === 'error' ? 'text-red-400' :
                'text-muted-light'
              }`}>
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}