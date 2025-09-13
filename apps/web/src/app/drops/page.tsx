'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dropsApi, showNotification } from '@/lib/api';
import { Drop } from '@prisma/client';
import { Loader2, Music } from 'lucide-react';

// Компонент карточки дропа
function DropCard({ drop }: { drop: Drop }) {
  return (
    <Link href={`/drops/${drop.id}`} passHref>
      <div className="bg-dark-card border border-dark rounded-2xl overflow-hidden group transition-all duration-300 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/10 hover:-translate-y-1">
        <div className="relative aspect-square">
          {drop.imageUrl ? (
            <img 
              src={drop.imageUrl} 
              alt={drop.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-dark flex items-center justify-center">
              <Music className="w-16 h-16 text-muted-light" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-light truncate">{drop.name}</h3>
          <p className="text-sm text-muted-light truncate">by {drop.artist}</p>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-light">
              <span className="font-bold text-xl">{drop.price}</span>
              <span className="text-sm text-muted-light ml-1">SOL</span>
            </div>
            <div className="bg-purple-600/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full">
              {drop.mintedSupply} / {drop.totalSupply}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrops = async () => {
      setLoading(true);
      try {
        const response = await dropsApi.getAll({ status: 'ACTIVE' }); // Показываем только активные
        if (response.success && response.data) {
          setDrops(response.data);
        } else {
          showNotification(response.error || 'Ошибка загрузки дропов', 'error');
        }
      } catch (error) {
        showNotification('Ошибка загрузки дропов', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadDrops();
  }, []);

  return (
    <div className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-light text-light mb-4">
            Активные Дропы
          </h1>
          <p className="text-xl lg:text-2xl text-muted-light font-light">
            Участвуйте в эксклюзивных музыкальных NFT дропах
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-muted-light">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-lg">Загрузка дропов...</span>
            </div>
          </div>
        ) : drops.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {drops.map(drop => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-light text-lg">Активных дропов пока нет.</p>
            <p className="text-muted-light mt-2">Загляните позже!</p>
          </div>
        )}
      </div>
    </div>
  );
}