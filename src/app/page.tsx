'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { Twitter, ExternalLink, ArrowRight } from 'lucide-react';
import ReputationHub from '@/components/ReputationHub';

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
  const { writeContract, data: txHash, isPending } = useWriteContract();
  
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
      const rankValue = data.ethosScore > 80 ? 'ELITE' : 'VERIFIED';
      const pointsValue = BigInt(data.onChainPts > 0 ? data.onChainPts : data.ethosScore);

      const encodedData = encodeAbiParameters(
        parseAbiParameters('string rank, uint256 points'),
        [rankValue, pointsValue]
      );

      writeContract({
        abi: EAS_ABI,
        address: '0x4200000000000000000000000000000000000021',
        functionName: 'attest',
        args: [{
          schema: '0x9f680f50ebed1dc06b17b9a5461ee44496fae9b5e82b985634353f9c7054085e',
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

  const easScanUrl = txHash ? `https://base.easscan.org/tx/${txHash}` : '';
  
  // The updated viral tweet logic
  const tweetText = encodeURIComponent(`I just elevated my On-Chain DNA on BaseRep! 🧬✨\n\nMy Ethos Score is ${data.ethosScore}/100 and my AML status is ${data.amlStatus}.\n\nVerify my on-chain reputation here:\n${easScanUrl}\n\nWant to mint yours and show @base your dedication and on-chain print? ⬇️\n🔗 https://baserep.xyz\n\n@BuildOnBase @eas_eth @base @jessepollak`);
  
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 font-sans">
      <div className="absolute top-6 right-6">
        <ConnectButton />
      </div>

      <div className="text-center mb-8 max-w-4xl mt-12">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
          Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-600">On-Chain DNA.</span>
        </h1>
        {data.onChainPts > 0 && (
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-xs font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {data.onChainPts} PTS ON-CHAIN
          </div>
        )}
      </div>

      <ReputationHub ethosScore={data.ethosScore} amlStatus={data.amlStatus} />

      <div className="mt-8 w-full max-w-md flex flex-col gap-5">
        <div className="relative group">
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search address (0x...)" 
            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner"
          />
          <button 
            onClick={handleCheck} 
            disabled={loading || !!txHash} 
            className="absolute right-2 top-2 bottom-2 bg-white text-black px-5 rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-white/90 transition-colors flex items-center gap-1"
          >
            {loading ? '...' : 'Verify'}
          </button>
        </div>

        {data.ethosScore > 0 && !txHash && (
          <button 
            onClick={handleMint}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-medium tracking-wide transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? 'Confirming...' : (isConnected ? 'Mint Reputation DNA' : 'Connect Wallet to Mint')}
            {!isPending && isConnected && <ArrowRight size={18} />}
          </button>
        )}

        {txHash && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/[0.02] border border-green-500/30 p-6 rounded-2xl text-center backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
              <h4 className="text-white font-medium text-lg mb-1">Reputation Secured</h4>
              <p className="text-white/50 text-sm mb-6">Your DNA is now permanently written on the Base network.</p>
              
              <div className="flex flex-col gap-3">
                <a 
                  href={easScanUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white py-3.5 rounded-xl font-medium text-sm transition-colors"
                >
                  View on EAS Scan <ExternalLink size={16} className="opacity-70" />
                </a>
                
                <a 
                  href={twitterIntentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-black hover:bg-black/80 border border-white/10 text-white py-3.5 rounded-xl font-medium text-sm transition-colors"
                >
                  <Twitter size={16} /> Share on X
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
