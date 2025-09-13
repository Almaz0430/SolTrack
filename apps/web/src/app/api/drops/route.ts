import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DropStatus, TransactionType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const where: any = {};
 
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as DropStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { artist: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const drops = await prisma.drop.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: drops,
      count: drops.length
    });
  } catch (error) {
    console.error('Ошибка получения дропов:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка получения дропов',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['name', 'artist', 'price', 'totalSupply', 'artistRoyalty', 'platformFee'];
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

    if (isNaN(parseFloat(body.price)) || parseFloat(body.price) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Цена должна быть положительным числом' },
        { status: 400 }
      );
    }
    
    if (!Number.isInteger(body.totalSupply) || body.totalSupply <= 0) {
      return NextResponse.json(
        { success: false, error: 'Тираж должен быть положительным целым числом' },
        { status: 400 }
      );
    }

    const artistRoyalty = parseFloat(body.artistRoyalty);
    const platformFee = parseFloat(body.platformFee);
    
    if (isNaN(artistRoyalty) || artistRoyalty < 0 || artistRoyalty > 100) {
      return NextResponse.json(
        { success: false, error: 'Роялти артиста должно быть от 0 до 100%' },
        { status: 400 }
      );
    }
    
    if (isNaN(platformFee) || platformFee < 0 || platformFee > 100) {
      return NextResponse.json(
        { success: false, error: 'Комиссия платформы должна быть от 0 до 100%' },
        { status: 400 }
      );
    }
    
    if (artistRoyalty + platformFee > 100) {
      return NextResponse.json(
        { success: false, error: 'Сумма роялти и комиссии не может превышать 100%' },
        { status: 400 }
      );
    }

    const newDrop = await prisma.drop.create({
      data: {
        name: body.name.trim(),
        artist: body.artist.trim(),
        price: parseFloat(body.price).toFixed(4),
        totalSupply: parseInt(body.totalSupply),
        status: (body.status?.toUpperCase() || 'DRAFT') as DropStatus,
        artistRoyalty: artistRoyalty.toFixed(2),
        platformFee: platformFee.toFixed(2),
        description: body.description?.trim() || null,
        imageUrl: body.imageUrl?.trim() || null,
        musicUrl: body.musicUrl?.trim() || null,
      }
    });

    // После создания дропа, создаем запись о событии
    await prisma.transaction.create({
      data: {
        signature: `drop_created_${newDrop.id}`, // Уникальная "подпись" для события
        type: TransactionType.DROP_CREATED,
        amount: '0', // Сумма 0, т.к. это не финансовая транзакция
        status: 'CONFIRMED', // Сразу подтверждено
        dropId: newDrop.id, // Связываем с созданным дропом
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newDrop,
      message: 'Дроп успешно создан'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Ошибка создания дропа:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка создания дропа',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}