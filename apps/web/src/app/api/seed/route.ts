import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/seed - Заполнить базу данных тестовыми данными
export async function POST() {
  try {
    // Проверяем, есть ли уже данные
    const existingDrops = await prisma.drop.count();
    
    if (existingDrops > 0) {
      return NextResponse.json({
        success: true,
        message: `База данных уже содержит ${existingDrops} дропов`
      });
    }
    
    // Тестовые данные
    const testDrops = [
      {
        name: 'Midnight Dreams Collection',
        artist: 'ElectroWave',
        price: '2.5000',
        totalSupply: 100,
        mintedSupply: 25,
        status: 'ACTIVE' as const,
        artistRoyalty: '90.00',
        platformFee: '10.00',
        description: 'Коллекция электронной музыки с атмосферными треками для ночных размышлений',
        imageUrl: 'https://example.com/midnight-dreams.jpg',
        musicUrl: 'https://example.com/midnight-dreams.mp3',
      },
      {
        name: 'Rock Legends Series',
        artist: 'RockLegend',
        price: '1.8000',
        totalSupply: 50,
        mintedSupply: 42,
        status: 'ACTIVE' as const,
        artistRoyalty: '85.00',
        platformFee: '15.00',
        description: 'Серия классических рок-композиций от легендарного исполнителя',
        imageUrl: 'https://example.com/rock-legends.jpg',
        musicUrl: 'https://example.com/rock-legends.mp3',
      },
      {
        name: 'Jazz Fusion Masterpieces',
        artist: 'SmoothJazz',
        price: '3.2000',
        totalSupply: 30,
        mintedSupply: 30,
        status: 'COMPLETED' as const,
        artistRoyalty: '92.00',
        platformFee: '8.00',
        description: 'Шедевры джаз-фьюжн с уникальными импровизациями',
        imageUrl: 'https://example.com/jazz-fusion.jpg',
        musicUrl: 'https://example.com/jazz-fusion.mp3',
      },
      {
        name: 'Hip-Hop Beats Vol.1',
        artist: 'BeatMaker',
        price: '0.9000',
        totalSupply: 200,
        mintedSupply: 0,
        status: 'DRAFT' as const,
        artistRoyalty: '88.00',
        platformFee: '12.00',
        description: 'Первый том авторских хип-хоп битов для начинающих рэперов',
        imageUrl: 'https://example.com/hiphop-beats.jpg',
        musicUrl: 'https://example.com/hiphop-beats.mp3',
      },
      {
        name: 'Ambient Soundscapes',
        artist: 'SoundDesigner',
        price: '1.5000',
        totalSupply: 75,
        mintedSupply: 15,
        status: 'ACTIVE' as const,
        artistRoyalty: '95.00',
        platformFee: '5.00',
        description: 'Эмбиент композиции для медитации и релаксации',
        imageUrl: 'https://example.com/ambient.jpg',
        musicUrl: 'https://example.com/ambient.mp3',
      },
    ];
    
    // Создаем тестовые дропы
    const createdDrops = await prisma.drop.createMany({
      data: testDrops
    });
    
    return NextResponse.json({
      success: true,
      message: `Создано ${createdDrops.count} тестовых дропов`,
      count: createdDrops.count
    });
    
  } catch (error) {
    console.error('Ошибка заполнения базы данных:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка заполнения базы данных',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}