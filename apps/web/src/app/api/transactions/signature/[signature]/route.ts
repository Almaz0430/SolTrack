import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { signature: string } }
) {
  try {
    const { signature } = params;
    
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Подпись транзакции не указана' },
        { status: 400 }
      );
    }
    
    const transaction = await prisma.transaction.findUnique({
      where: { signature },
      include: {
        drop: {
          select: {
            name: true,
            artist: true
          }
        }
      }
    });
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Транзакция не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: transaction
    });
    
  } catch (error) {
    console.error('Ошибка получения транзакции по подписи:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка получения транзакции',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { signature: string } }
) {
  try {
    const { signature } = params;
    const body = await request.json();
    
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Подпись транзакции не указана' },
        { status: 400 }
      );
    }

    const existingTransaction = await prisma.transaction.findUnique({
      where: { signature }
    });
    
    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, error: 'Транзакция не найдена' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (body.status !== undefined) {
      const validStatuses = Object.values(TransactionStatus);
      const status = body.status.toUpperCase();
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Недопустимый статус транзакции' },
          { status: 400 }
        );
      }
      updateData.status = status as TransactionStatus;
    }
    
    if (body.buyerAddress !== undefined) {
      updateData.buyerAddress = body.buyerAddress;
    }
    
    if (body.sellerAddress !== undefined) {
      updateData.sellerAddress = body.sellerAddress;
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { signature },
      data: updateData,
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
      data: updatedTransaction,
      message: 'Транзакция успешно обновлена'
    });
    
  } catch (error) {
    console.error('Ошибка обновления транзакции по подписи:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка обновления транзакции',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}
