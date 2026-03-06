import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address || !address.startsWith('0x')) {
    return NextResponse.json({ error: 'Valid address required' }, { status: 400 });
  }

  try {
    // Calcul d'un score stable basé sur l'adresse
    const hash = address.toLowerCase().slice(-4);
    const scoreBase = parseInt(hash, 16);
    const ethosScore = Math.floor((scoreBase / 65535) * 40) + 60; // Stable entre 60 et 100
    
    return NextResponse.json({
      ethosScore: ethosScore,
      amlStatus: ethosScore > 75 ? 'cleared' : 'pending',
      onChainPts: Math.floor((scoreBase / 65535) * 500) // Restauration des points on-chain
    });
  } catch (error) {
    return NextResponse.json({ ethosScore: 0, amlStatus: 'pending', onChainPts: 0 });
  }
}
