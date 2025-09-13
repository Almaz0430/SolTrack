import { NextResponse } from 'next/server';
import { IPFSService } from '@/lib/ipfs';
import { MetadataService } from '@/lib/metadata';
import prisma from '@/lib/prisma';

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

    const imageHash = await IPFSService.uploadFile(imageFile);
    const musicHash = await IPFSService.uploadFile(musicFile);
    
    const imageUrl = IPFSService.getIPFSUrl(imageHash);
    const musicUrl = IPFSService.getIPFSUrl(musicHash);

    const newDrop = await prisma.drop.create({
      data: {
        name,
        artist,
        description,
        price,
        totalSupply: parseInt(totalSupply),
        imageUrl,
        musicUrl,
        // Default values for new fields
        artistRoyalty: '90.00', // Example: 90%
        platformFee: '10.00'  // Example: 10%
      }
    });

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
    
    // Возвращаем и созданный дроп, и хеш метаданных
    return NextResponse.json({ drop: newDrop, metadataHash });

  } catch (error) {
    console.error('Error in create-drop API:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to create drop: ${message}` }, { status: 500 });
  }
}
