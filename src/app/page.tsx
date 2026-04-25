'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { Twitter, ExternalLink, ArrowRight, Activity, Wallet, Clock, BarChart3, Trophy } from 'lucide-react';
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

const BaseLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0ZM100 156.25C68.934 156.25 43.75 131.066 43.75 100C43.75 68.934 68.934 43.75 100 43.75C131.066 43.75 156.25 68.934 156.25 100C156.25 131.066 131.066 156.25 100 156.25Z" fill="#0052FF"/>
  </svg>
);

interface LiveData {
  address: string;
  fullAddress: string;
  rank: string;
  score: number;
  time: string;
  volume: string;
  rankPos?: number;
}

export default function Home() {
  const { isConnected } = useAccount();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  
  const [address, setAddress] = useState('');
  const [data, setData] = useState({ ethosScore: 0, amlStatus: 'PENDING', onChainPts: 0 });
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Real live data states
  const [leaderboard, setLeaderboard] = useState<LiveData[]>([]);
  const [recentActivity, setRecentActivity] = useState<LiveData[]>([]);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const liveData = await res.json();
        if (liveData.leaderboard) setLeaderboard(liveData.leaderboard);
        if (liveData.recent) setRecentActivity(liveData.recent);
      } catch (err) {
        console.error("Failed to fetch live protocol data", err);
      }
    };
    fetchLiveData();
    
    // Refresh live feed every 60 seconds
    const interval = setInterval(fetchLiveData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCheck = async () => {
    if (!address.startsWith('0x')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reputation?address=${address}`);
      const result = await res.json();
      setData(result);
      setShowStats(true);
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

  const baseScanUrl = txHash ? `https://basescan.org/tx/${txHash}` : '';
  const tweetText = encodeURIComponent(`I just elevated my On-Chain DNA on BaseRep! 🧬✨\n\nMy Ethos Score is ${data.ethosScore}/100 and my AML status is ${data.amlStatus}.\n\nVerify my on-chain reputation here:\n${baseScanUrl}\n\nWant to mint yours and show @base your dedication and on-chain print? ⬇️\n🔗 https://baserep.xyz\n\n@BuildOnBase @eas_eth @base @jessepollak`);
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 font-sans pb-24">
      <div className="absolute top-6 right-6 z-50">
        <ConnectButton />
      </div>

      <div className="text-center mb-8 max-w-4xl mt-16 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6 flex flex-wrap justify-center items-center gap-4">
          Elevate Your 
          <span className="flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-600">
            <BaseLogo className="w-12 h-12 md:w-16 md:h-16 inline-block" /> 
            On-Chain DNA.
          </span>
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

      {showStats && data.ethosScore > 0 && (
        <div className="w-full max-w-2xl mt-4 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <Clock className="text-zinc-500 mb-2" size={18} />
            <span className="text-white font-bold text-lg">2.4 Yrs</span>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Wallet Age</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <Activity className="text-zinc-500 mb-2" size={18} />
            <span className="text-white font-bold text-lg">1,204</span>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Transactions</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <BarChart3 className="text-zinc-500 mb-2" size={18} />
            <span className="text-white font-bold text-lg">$42.1K</span>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Volume</span>
          </div>
        </div>
      )}

      <div className="mt-8 w-full max-w-md flex flex-col gap-5 relative z-10">
        <div className="relative group">
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search address (0x...)" 
            className="w-full bg-white/[0.03] border border-white/10 p-4 pr-28 rounded-xl text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner"
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
                  href={baseScanUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white py-3.5 rounded-xl font-medium text-sm transition-colors"
                >
                  View on BaseScan <ExternalLink size={16} className="opacity-70" />
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

      {/* Live Data Display Areas */}
      <div className="w-full max-w-4xl mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Real Global Leaderboard */}
        <div className="flex flex-col border-t border-white/[0.05] pt-8">
          <h3 className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Trophy size={14} className="text-yellow-500" /> Global Top DNA
          </h3>
          <div className="flex flex-col gap-2">
            {leaderboard.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">Fetching blockchain data...</p>
            ) : (
              leaderboard.map((user) => (
                <div key={user.fullAddress} className="flex items-center justify-between bg-white/[0.01] border border-white/[0.02] p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-sm w-4 text-center ${user.rankPos === 1 ? 'text-yellow-500' : user.rankPos === 2 ? 'text-zinc-300' : user.rankPos === 3 ? 'text-amber-600' : 'text-zinc-600'}`}>
                      {user.rankPos}
                    </span>
                    <span className="text-white font-medium text-sm">{user.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-xs font-medium">{user.volume}</span>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">
                      {user.score}/100
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real Live Mints Feed */}
        <div className="flex flex-col border-t border-white/[0.05] pt-8">
          <h3 className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Activity size={14} className="text-blue-500" /> Live Protocol Mints
          </h3>
          <div className="flex flex-col gap-3">
            {recentActivity.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">Waiting for new mints...</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={`${activity.fullAddress}-${index}`} className="flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] p-4 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-2 rounded-lg">
                      <Wallet size={16} className="text-zinc-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">{activity.address}</span>
                      <span className="text-zinc-500 text-xs">{activity.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded-md ${activity.rank === 'ELITE' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {activity.rank}
                    </span>
                    <span className="text-white font-bold">{activity.score}<span className="text-zinc-600 text-xs font-normal">/100</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-16 flex items-center justify-center gap-2 opacity-40 hover:opacity-80 transition-opacity">
        <span className="text-xs font-medium tracking-wide">Built natively on</span>
        <BaseLogo className="w-4 h-4" />
      </div>
    </main>
  );
}
