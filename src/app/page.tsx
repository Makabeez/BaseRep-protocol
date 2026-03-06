'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import ReputationHub from '@/components/ReputationHub';

// L'ABI officiel du contrat EAS pour la fonction "attest"
const EAS_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "schema", "type": "bytes32" },
          {
            "components": [
              { "internalType": "address", "name": "recipient", "type": "address" },
              { "internalType": "uint64", "name": "expirationTime", "type": "uint64" },
              { "internalType": "bool", "name": "revocable", "type": "bool" },
              { "internalType": "bytes32", "name": "refUID", "type": "bytes32" },
              { "internalType": "bytes", "name": "data", "type": "bytes" },
              { "internalType": "uint256", "name": "value", "type": "uint256" }
            ],
            "internalType": "struct AttestationRequestData",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct AttestationRequest",
        "name": "request",
        "type": "tuple"
      }
    ],
    "name": "attest",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export default function Home() {
  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const [address, setAddress] = useState('');
  const [data, setData] = useState({ ethosScore: 0, amlStatus: 'PENDING', onChainPts: 0 });
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!address.startsWith('0x')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reputation?address=${address}`);
      const result = await res.json();
      setData(result);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleMint = () => {
    if (!isConnected) return alert("Please connect your wallet first!");
    if (!address.startsWith('0x')) return alert("Please enter a valid address to attest");

    try {
      // 1. Encodage des données selon ton Schéma EAS (string rank, uint256 points)
      const rankValue = data.ethosScore > 80 ? 'ELITE' : 'VERIFIED';
      const pointsValue = BigInt(data.onChainPts > 0 ? data.onChainPts : data.ethosScore);

      const encodedData = encodeAbiParameters(
        parseAbiParameters('string rank, uint256 points'),
        [rankValue, pointsValue]
      );

      // 2. Appel au contrat officiel EAS sur Base
      writeContract({
        abi: EAS_ABI,
        address: '0x4200000000000000000000000000000000000021', // Adresse officielle EAS Base Mainnet
        functionName: 'attest',
        args: [{
          schema: '0x9f680f50ebed1dc06b17b9a5461ee44496fae9b5e82b985634353f9c7054085e', // Ton UID de schéma
          data: {
            recipient: address as `0x${string}`,
            expirationTime: 0n,
            revocable: true,
            refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
            data: encodedData,
            value: 0n
          }
        }]
      });
    } catch (err) {
      console.error("Error formatting attestation", err);
      alert("Failed to format attestation data.");
    }
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
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..." 
            className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl font-bold focus:border-blue-600 outline-none transition-all"
          />
          <button 
            onClick={handleCheck} 
            disabled={loading} 
            className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-xl font-black uppercase text-xs disabled:opacity-50"
          >
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
