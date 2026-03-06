'use client';

import React, { useState } from 'react';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ReputationHub from '@/components/ReputationHub';

export default function Home() {
  const { address: userAddress, isConnected } = useAccount();
  const [searchAddress, setSearchAddress] = useState('');
  const [data, setData] = useState({ ethosScore: 0, amlStatus: 'PENDING', onChainPts: 0 });
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!searchAddress.startsWith('0x')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reputation?address=${searchAddress}`);
      const result = await res.json();
      setData(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleMint = async () => {
    if (!isConnected) return alert("Please connect your wallet first!");
    
    // Logique de Mint (Appel au contrat EAS ou ton propre NFT de réputation)
    try {
      alert(`Minting Reputation for ${userAddress} on Base...`);
      // Ici s'insère ton writeContract({ abi, address, functionName: 'mint' })
    } catch (e) { console.error(e); }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <ConnectButton />
      </div>

      <div className="text-center mb-4 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-6">
          Elevate Your <span className="text-blue-600">On-Chain DNA.</span>
        </h1>
        {data.onChainPts > 0 && (
          <div className="inline-block bg-blue-600/20 border border-blue-500/30 px-4 py-1 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-tighter">
            {data.onChainPts} pts detected on-chain
          </div>
        )}
      </div>

      <ReputationHub ethosScore={data.ethosScore} amlStatus={data.amlStatus} />

      <div className="mt-12 w-full max-w-md flex flex-col gap-4">
        <div className="relative group">
          <input 
            type="text" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Search address (0x...)" 
            className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl font-bold focus:border-blue-600 outline-none transition-all"
          />
          <button onClick={handleCheck} disabled={loading} className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-xl font-black uppercase text-xs">
            {loading ? '...' : 'Check'}
          </button>
        </div>

        {data.ethosScore > 0 && (
          <button 
            onClick={handleMint}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
          >
            {isConnected ? 'Mint Your Reputation DNA' : 'Connect Wallet to Mint'}
          </button>
        )}
      </div>
    </main>
  );
}
