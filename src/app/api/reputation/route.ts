import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  try {
    // Appel simulé à l'API Ethos (à remplacer par ta clé API Ethos réelle)
    const ethosScore = Math.floor(Math.random() * 40) + 60; // Score simulé entre 60 et 100
    
    return NextResponse.json({
      ethosScore: ethosScore,
      amlStatus: ethosScore > 70 ? 'cleared' : 'pending',
    });
  } catch (error) {
    return NextResponse.json({ ethosScore: 0, amlStatus: 'pending' }, { status: 500 });
  }
}
