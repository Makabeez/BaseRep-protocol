import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address || !address.startsWith('0x')) {
    return NextResponse.json({ error: 'Valid address required' }, { status: 400 });
  }

  try {
    // Logique de score STABLE basée sur l'adresse (évite le random)
    const hash = address.toLowerCase().slice(-4);
    const scoreBase = parseInt(hash, 16);
    const ethosScore = Math.floor((scoreBase / 65535) * 40) + 60; 
    
    return NextResponse.json({
      ethosScore: ethosScore,
      amlStatus: ethosScore > 75 ? 'CLEARED' : 'PENDING',
      onChainPts: Math.floor((scoreBase / 65535) * 500)
    });
  } catch (error) {
    return NextResponse.json({ ethosScore: 0, amlStatus: 'PENDING', onChainPts: 0 });
  }
}
