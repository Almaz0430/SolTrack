import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/drops/[id]/complete - Завершить дроп
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
    
    // Проверяем, можно ли завершить дроп
    if (existingDrop.status !== 'ACTIVE') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Нельзя завершить дроп со статусом "${existingDrop.status}". Можно завершить только активные дропы.`
        },
        { status: 400 }
      );
    }
    
    // Завершаем дроп
    const completedDrop = await prisma.drop.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });
    
    return NextResponse.json({
      success: true,
      data: completedDrop,
      message: 'Дроп успешно завершен'
    });
    
  } catch (error) {
    console.error('Ошибка завершения дропа:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка завершения дропа',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}