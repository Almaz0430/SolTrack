import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/drops/[id]/activate - Активировать дроп
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID дропа не указан' },
        { status: 400 }
      );
    }
    
    // Проверяем существование дропа
    const existingDrop = await prisma.drop.findUnique({
      where: { id }
    });
    
    if (!existingDrop) {
      return NextResponse.json(
        { success: false, error: 'Дроп не найден' },
        { status: 404 }
      );
    }
    
    // Проверяем, можно ли активировать дроп
    if (existingDrop.status !== 'DRAFT') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Нельзя активировать дроп со статусом "${existingDrop.status}". Можно активировать только черновики.`
        },
        { status: 400 }
      );
    }
    
    // Проверяем обязательные поля для активации
    if (!existingDrop.name || !existingDrop.artist || !existingDrop.price) {
      return NextResponse.json(
        { success: false, error: 'Для активации дропа необходимо заполнить все обязательные поля' },
        { status: 400 }
      );
    }
    
    // Активируем дроп
    const activatedDrop = await prisma.drop.update({
      where: { id },
      data: { status: 'ACTIVE' }
    });
    
    return NextResponse.json({
      success: true,
      data: activatedDrop,
      message: 'Дроп успешно активирован'
    });
    
  } catch (error) {
    console.error('Ошибка активации дропа:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка активации дропа',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}