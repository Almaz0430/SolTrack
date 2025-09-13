import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DropStatus, TransactionType, TransactionStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const dropsStats = await prisma.drop.aggregate({
      _count: {
        id: true,
      },
      where: {
        status: {
          in: [DropStatus.ACTIVE, DropStatus.COMPLETED, DropStatus.DRAFT]
        }
      }
    });

    const activeDrops = await prisma.drop.count({
      where: { status: DropStatus.ACTIVE }
    });

    const completedDrops = await prisma.drop.count({
      where: { status: DropStatus.COMPLETED }
    });

    const draftDrops = await prisma.drop.count({
      where: { status: DropStatus.DRAFT }
    });

    const dropsForSupply = await prisma.drop.findMany({
      select: {
        totalSupply: true,
        mintedSupply: true
      }
    });

    const totalSupply = dropsForSupply.reduce((sum, drop) => sum + drop.totalSupply, 0);
    const totalMinted = dropsForSupply.reduce((sum, drop) => sum + drop.mintedSupply, 0);

    const transactionsStats = await prisma.transaction.aggregate({
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    const confirmedTransactions = await prisma.transaction.count({
      where: {
        status: TransactionStatus.CONFIRMED,
        createdAt: { gte: startDate }
      }
    });

    const pendingTransactions = await prisma.transaction.count({
      where: {
        status: TransactionStatus.PENDING,
        createdAt: { gte: startDate }
      }
    });

    const failedTransactions = await prisma.transaction.count({
      where: {
        status: TransactionStatus.FAILED,
        createdAt: { gte: startDate }
      }
    });

    const volumeTransactions = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.CONFIRMED,
        type: TransactionType.PURCHASE,
        createdAt: { gte: startDate }
      },
      select: {
        amount: true
      }
    });

    const totalVolume = volumeTransactions.reduce((sum, tx) => {
      return sum + parseFloat(tx.amount);
    }, 0);

    let topDrops = await prisma.drop.findMany({
      include: {
        transactions: {
          where: {
            status: TransactionStatus.CONFIRMED,
            type: TransactionType.PURCHASE,
            createdAt: { gte: startDate }
          }
        }
      },
      where: {
        transactions: {
          some: {
            status: TransactionStatus.CONFIRMED,
            type: TransactionType.PURCHASE,
            createdAt: { gte: startDate }
          }
        }
      },
      orderBy: {
        transactions: {
          _count: 'desc'
        }
      },
      take: 5
    });

    let processedTopDrops = topDrops.map((drop) => {
      const volume = drop.transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      const salesCount = drop.transactions.length;
      
      return {
        drop: {
          id: drop.id,
          name: drop.name,
          artist: drop.artist
        },
        volume,
        salesCount
      };
    });

    if (topDrops.length === 0) {
      const recentDrops = await prisma.drop.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      
      processedTopDrops = recentDrops.map(drop => ({
        drop: {
          id: drop.id,
          name: drop.name,
          artist: drop.artist
        },
        volume: 0,
        salesCount: 0
      }));
    }

    const recentActivity = await prisma.transaction.findMany({
      include: {
        drop: {
          select: {
            name: true,
            artist: true
          }
        }
      },
      where: {
        status: TransactionStatus.CONFIRMED,
        type: {
          in: [TransactionType.PURCHASE, TransactionType.DROP_CREATED]
        },
        createdAt: { gte: startDate }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    const processedRecentActivity = recentActivity.map(activity => ({
      transaction: {
        signature: activity.signature,
        amount: parseFloat(activity.amount),
        type: activity.type.toLowerCase(),
        createdAt: activity.createdAt.toISOString()
      },
      drop: activity.drop ? {
        name: activity.drop.name,
        artist: activity.drop.artist
      } : null
    }));

    const avgTransactionSize = confirmedTransactions > 0 ? totalVolume / confirmedTransactions : 0;
    
    const platformFeeRate = 0.1;
    const totalFees = totalVolume * platformFeeRate;
    const totalRoyalties = totalVolume - totalFees;

    const dashboardStats = {
      drops: {
        totalDrops: dropsStats._count.id,
        activeDrops,
        completedDrops,
        draftDrops,
        totalSupply,
        totalMinted,
      },
      transactions: {
        totalTransactions: transactionsStats._count.id,
        confirmedTransactions,
        pendingTransactions,
        failedTransactions,
      },
      volume: {
        totalVolume,
        totalRoyalties,
        totalFees,
        avgTransactionSize,
      },
      topDrops: processedTopDrops,
      recentActivity: processedRecentActivity,
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats,
      period
    });

  } catch (error) {
    console.error('Ошибка получения статистики дашборда:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка получения статистики',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}