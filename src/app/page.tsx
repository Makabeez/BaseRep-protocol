'use client';

import React, { useState } from 'react';
import ReputationHub from '@/components/ReputationHub';

export default function Home() {
  const [address, setAddress] = useState('');

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <div className="text-center mb-4 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
          Elevate Your <span className="text-blue-600">On-Chain DNA.</span>
        </h1>
        <p className="text-zinc-500 font-bold text-xl md:text-2xl tracking-tight">
          Your reputation is now your identity on Base.
        </p>
      </div>

      {/* Dynamic Reputation Hub */}
      <ReputationHub 
        ethosScore={88} 
        amlStatus="cleared" 
      />

      {/* Search Input Section */}
      <div className="mt-12 w-full max-w-md flex flex-col gap-4">
        <div className="relative group">
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Paste wallet address (0x...)" 
            className="w-full bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-600 transition-all"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-xl font-black text-sm hover:bg-zinc-200 transition-colors uppercase">
            Check
          </button>
        </div>
        
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center">
          Powered by @EAS_ETH & ETHOS.XYZ
        </p>
      </div>

    </main>
  );
}
