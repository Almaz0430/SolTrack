import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DropStatus } from '@prisma/client';

// GET /api/drops/[id] - Получить дроп по ID
export async function GET(
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
    
    const drop = await prisma.drop.findUnique({
      where: { id }
    });
    
    if (!drop) {
      return NextResponse.json(
        { success: false, error: 'Дроп не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: drop
    });
    
  } catch (error) {
    console.error('Ошибка получения дропа:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка получения дропа',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

// PUT /api/drops/[id] - Обновить дроп
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
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
    
    // Подготавливаем данные для обновления
    const updateData: any = {};
    
    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }
    
    if (body.artist !== undefined) {
      updateData.artist = body.artist.trim();
    }
    
    if (body.price !== undefined) {
      const price = parseFloat(body.price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json(
          { success: false, error: 'Цена должна быть положительным числом' },
          { status: 400 }
        );
      }
      updateData.price = price.toFixed(4);
    }
    
    if (body.totalSupply !== undefined) {
      const totalSupply = parseInt(body.totalSupply);
      if (!Number.isInteger(totalSupply) || totalSupply <= 0) {
        return NextResponse.json(
          { success: false, error: 'Тираж должен быть положительным целым числом' },
          { status: 400 }
        );
      }
      
      // Проверяем, что новый тираж не меньше уже заминченного количества
      if (totalSupply < existingDrop.mintedSupply) {
        return NextResponse.json(
          { success: false, error: 'Тираж не может быть меньше уже заминченного количества' },
          { status: 400 }
        );
      }
      
      updateData.totalSupply = totalSupply;
    }
    
    if (body.status !== undefined) {
      const validStatuses = ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
      const status = body.status.toUpperCase();
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Недопустимый статус' },
          { status: 400 }
        );
      }
      updateData.status = status as DropStatus;
    }
    
    if (body.artistRoyalty !== undefined) {
      const artistRoyalty = parseFloat(body.artistRoyalty);
      if (isNaN(artistRoyalty) || artistRoyalty < 0 || artistRoyalty > 100) {
        return NextResponse.json(
          { success: false, error: 'Роялти артиста должно быть от 0 до 100%' },
          { status: 400 }
        );
      }
      updateData.artistRoyalty = artistRoyalty.toFixed(2);
    }
    
    if (body.platformFee !== undefined) {
      const platformFee = parseFloat(body.platformFee);
      if (isNaN(platformFee) || platformFee < 0 || platformFee > 100) {
        return NextResponse.json(
          { success: false, error: 'Комиссия платформы должна быть от 0 до 100%' },
          { status: 400 }
        );
      }
      updateData.platformFee = platformFee.toFixed(2);
    }
    
    // Проверяем сумму роялти и комиссии
    const finalArtistRoyalty = parseFloat(updateData.artistRoyalty || existingDrop.artistRoyalty);
    const finalPlatformFee = parseFloat(updateData.platformFee || existingDrop.platformFee);
    
    if (finalArtistRoyalty + finalPlatformFee > 100) {
      return NextResponse.json(
        { success: false, error: 'Сумма роялти и комиссии не может превышать 100%' },
        { status: 400 }
      );
    }
    
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }
    
    if (body.imageUrl !== undefined) {
      updateData.imageUrl = body.imageUrl?.trim() || null;
    }
    
    if (body.musicUrl !== undefined) {
      updateData.musicUrl = body.musicUrl?.trim() || null;
    }
    
    // Обновляем дроп
    const updatedDrop = await prisma.drop.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      data: updatedDrop,
      message: 'Дроп успешно обновлен'
    });
    
  } catch (error) {
    console.error('Ошибка обновления дропа:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка обновления дропа',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/drops/[id] - Удалить дроп
export async function DELETE(
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
    
    // Проверяем, можно ли удалить дроп
    if (existingDrop.status === 'ACTIVE' && existingDrop.mintedSupply > 0) {
      return NextResponse.json(
        { success: false, error: 'Нельзя удалить активный дроп с заминченными NFT' },
        { status: 400 }
      );
    }
    
    await prisma.drop.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Дроп успешно удален'
    });
    
  } catch (error) {
    console.error('Ошибка удаления дропа:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка удаления дропа',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}