import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType, TransactionStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['signature', 'type', 'amount'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Отсутствуют обязательные поля',
          missingFields 
        },
        { status: 400 }
      );
    }

    // Проверяем, что транзакция с такой подписью еще не существует
    const existingTransaction = await prisma.transaction.findUnique({
      where: { signature: body.signature }
    });

    if (existingTransaction) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Транзакция с такой подписью уже существует'
        },
        { status: 409 }
      );
    }

    // Валидация типа транзакции
    const validTypes = Object.values(TransactionType);
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Недопустимый тип транзакции'
        },
        { status: 400 }
      );
    }

    // Валидация суммы
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Сумма должна быть положительным числом'
        },
        { status: 400 }
      );
    }

    // Если указан dropId, проверяем что дроп существует
    if (body.dropId) {
      const drop = await prisma.drop.findUnique({
        where: { id: body.dropId }
      });

      if (!drop) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Дроп не найден'
          },
          { status: 404 }
        );
      }
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        signature: body.signature,
        type: body.type as TransactionType,
        amount: amount.toFixed(8), // Сохраняем с точностью до 8 знаков
        status: (body.status as TransactionStatus) || TransactionStatus.PENDING,
        buyerAddress: body.buyerAddress || null,
        sellerAddress: body.sellerAddress || null,
        dropId: body.dropId || null,
      },
      include: {
        drop: {
          select: {
            name: true,
            artist: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: 'Транзакция успешно создана'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Ошибка создания транзакции:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка создания транзакции',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const dropId = searchParams.get('dropId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const where: any = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    if (dropId) {
      where.dropId = dropId;
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        drop: {
          select: {
            name: true,
            artist: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
    
    const total = await prisma.transaction.count({ where });
    
    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Ошибка получения транзакций:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка получения транзакций',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}
