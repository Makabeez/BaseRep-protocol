'use client';

import React, { useState } from 'react';
import ReputationHub from '@/components/ReputationHub';

export default function Home() {
  const [address, setAddress] = useState('');
  const [repData, setRepData] = useState({ ethosScore: 0, amlStatus: 'pending' });
  const [loading, setLoading] = useState(false);

  const checkReputation = async () => {
    if (!address.startsWith('0x')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reputation?address=${address}`);
      const data = await res.json();
      setRepData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-center">
        Elevate Your <span className="text-blue-600">On-Chain DNA.</span>
      </h1>
      
      <ReputationHub ethosScore={repData.ethosScore} amlStatus={repData.amlStatus} />

      <div className="mt-12 w-full max-w-md relative">
        <input 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Paste address (0x...)" 
          className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl font-bold"
        />
        <button 
          onClick={checkReputation}
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-xl font-black uppercase text-sm"
        >
          {loading ? '...' : 'Check'}
        </button>
      </div>
    </main>
  );
}
