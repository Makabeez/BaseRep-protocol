import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  if (!address || !address.startsWith('0x')) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const hash = address.toLowerCase().slice(-4);
  const scoreBase = parseInt(hash, 16);
  const ethosScore = Math.floor((scoreBase / 65535) * 40) + 60; 
  
  return NextResponse.json({
    ethosScore: ethosScore,
    amlStatus: ethosScore > 75 ? 'CLEARED' : 'PENDING',
    onChainPts: Math.floor((scoreBase / 65535) * 500)
  });
}
