import { NextResponse } from 'next/server';
import { IPFSService } from '@/lib/ipfs';
import { MetadataService } from '@/lib/metadata';
import { prisma } from '@/lib/prisma';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { SolanaContractService, CreateNftParams } from '@/lib/solana-contract';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const artist = formData.get('artist') as string;
    const genre = formData.get('genre') as string | null;
    const bpm = formData.get('bpm') as string | null;
    const key = formData.get('key') as string | null;
    const price = formData.get('price') as string;
    const totalSupply = formData.get('totalSupply') as string;
    const creatorAddress = formData.get('creatorAddress') as string;
    const imageFile = formData.get('imageFile') as File | null;
    const musicFile = formData.get('musicFile') as File | null;

    if (!imageFile || !musicFile || !name || !artist || !price || !totalSupply || !creatorAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Загружаем файлы в IPFS
    const imageHash = await IPFSService.uploadFile(imageFile);
    const musicHash = await IPFSService.uploadFile(musicFile);
    
    const imageUrl = IPFSService.getIPFSUrl(imageHash);
    const musicUrl = IPFSService.getIPFSUrl(musicHash);

    // Создаем метаданные
    const metadataHash = await MetadataService.uploadMetadata({
      name,
      description,
      artist,
      genre: genre || undefined,
      bpm: bpm ? parseInt(bpm) : undefined,
      key: key || undefined,
      imageHash,
      musicHash,
      creatorAddress,
    });

    const metadataUri = IPFSService.getIPFSUrl(metadataHash);

    // Создаем NFT через смарт-контракт
    const nftParams: CreateNftParams = {
      title: name,
      symbol: name.substring(0, 4).toUpperCase(),
      uri: metadataUri,
      genre: genre || 'Unknown',
      price: parseFloat(price),
      bpm: bpm ? parseInt(bpm) : 120,
      key: key || 'C Major'
    };

    // Здесь нужно будет интегрировать с кошельком пользователя
    // Пока что создаем только запись в базе данных
    const [newDrop] = await prisma.$transaction(async (tx: any) => {
      const drop = await tx.drop.create({
        data: {
          name,
          artist,
          description,
          price,
          totalSupply: parseInt(totalSupply),
          imageUrl,
          musicUrl,
          artistRoyalty: '90.00', 
          platformFee: '10.00' 
        }
      });

      await tx.transaction.create({
        data: {
          signature: `system-generated-${drop.id}`,
          type: TransactionType.DROP_CREATED,
          amount: '0',
          status: TransactionStatus.CONFIRMED,
          dropId: drop.id,
          buyerAddress: creatorAddress
        }
      });

      return [drop];
    });
    
    return NextResponse.json({ 
      drop: newDrop, 
      metadataHash,
      nftParams,
      message: 'NFT готов к созданию через смарт-контракт'
    });

  } catch (error) {
    console.error('Error in create-nft API:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to create NFT: ${message}` }, { status: 500 });
  }
}
