"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { parseEther } from 'viem';
import { ShieldCheck, Trophy } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { sendTransaction } = useSendTransaction();

  // Ton adresse de réception (Main Wallet)
  const MY_WALLET = "0x2f225F8A538e7fD613e8ba79DCDdC7D1422AEd1C"; 
  
  // Ton App ID pour l'attribution ERC-8021
  const BUILDER_APP_ID = "0x698e57733e2ef73e3a3541e7";

  const leaders = [
    { addr: "0x2f22...Ed1C", rank: "Elite Architect", score: 1000 },
    { addr: "0x89b2...4f12", rank: "Elite Architect", score: 980 },
    { addr: "0x33c1...99aa", rank: "Base Builder", score: 750 },
  ];

  useEffect(() => {
    async function getScore() {
      if (isConnected && address) {
        setLoading(true);
        try {
          const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
          const txs = await provider.getTransactionCount(address);
          setScore(Math.min(txs * 12, 1000));
        } catch (e) { console.error(e); }
        setLoading(false);
      }
    }
    getScore();
  }, [isConnected, address]);

  const handleMint = () => {
    sendTransaction({
      to: MY_WALLET as `0x${string}`,
      value: parseEther('0.00004'),
      // Intégration ERC-8021 pour l'attribution officielle Base
      data: BUILDER_APP_ID as `0x${string}`, 
    });
  };

  const handleShareWarpcast = () => {
    const text = `🛡️ My BaseRep Protocol Score is ${score}/1000!%0A%0AAnalyze your on-chain DNA at https://baserep.xyz%0A%0A@base @jessepollak #BaseRep`;
    window.open(`https://warpcast.com/~/compose?text=${text}`, '_blank');
  };

  const handleShareX = () => {
    const text = `🛡️ My BaseRep Protocol Score is ${score}/1000!%0A%0AAnalyze your on-chain DNA at https://baserep.xyz%0A%0A@base @jessepollak #BaseRep #BuildOnBase`;
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <main className="min-h-screen text-white bg-black font-sans pb-24">
      <nav className="flex justify-between items-center px-10 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0052FF] rounded-lg"><ShieldCheck size={20} /></div>
          <span className="font-black italic uppercase tracking-tighter">BASEREP</span>
        </div>
        <ConnectButton label="Verify Identity" />
      </nav>

      <div className="flex flex-col items-center mt-16 px-5 text-center">
        <div className="bg-[#0f0f0f]/60 border border-white/5 p-12 rounded-[40px] max-w-[850px] w-full backdrop-blur-xl">
          <h1 className="text-6xl md:text-7xl font-black mb-10 tracking-tighter leading-none">
            Elevate Your <span className="text-blue-500">On-Chain DNA.</span>
          </h1>

          {isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                <div className="text-8xl font-black italic">{loading ? "..." : score}</div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleShareWarpcast} className="flex-1 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Share Cast</button>
                  <button onClick={handleShareX} className="flex-1 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Share X</button>
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-500 uppercase">
                    {loading ? "Scanning..." : (score && score > 800 ? "ELITE ARCHITECT" : "BASE BUILDER")}
                  </div>
                  <p className="text-white/40 text-sm mt-2">Rank attributed based on activity.</p>
                </div>
                <button onClick={handleMint} className="w-full py-5 bg-[#0052FF] rounded-2xl font-black text-xl hover:scale-[1.02] transition-transform active:scale-95">
                  MINT RANK NFT (0.10$)
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[850px] mt-12 text-left">
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={20} className="text-yellow-500" /> 
            <h2 className="font-black uppercase tracking-widest text-sm text-white/60">Global Leaderboard</h2>
          </div>
          <div className="bg-[#0f0f0f]/40 border border-white/5 rounded-[30px] overflow-hidden">
            {leaders.map((leader, i) => (
              <div key={i} className="flex justify-between items-center p-6 border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-5">
                  <span className={`text-xl font-black ${i === 0 ? 'text-yellow-500' : 'text-zinc-700'}`}>#{i + 1}</span>
                  <div>
                    <div className="font-mono font-bold">{leader.addr}</div>
                    <div className="text-[10px] text-blue-500 uppercase font-black">{leader.rank}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black tracking-tighter">{leader.score}</div>
                  <div className="text-[8px] text-zinc-600 font-bold uppercase">PTS</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
