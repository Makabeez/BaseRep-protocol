"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { parseEther } from 'viem';
import { ShieldCheck, Activity, ArrowRight, Trophy, Share2 } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { sendTransaction } = useSendTransaction();

  // OFFICIAL RECIPIENT ADDRESS
  const MY_WALLET = "0x2f225F8A538e7fD613e8ba79DCDdC7D1422AEd1C"; 

  // MOCK LEADERBOARD DATA
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
      value: parseEther('0.00004'), // Approx 0.10$ USD
    });
  };

  const handleShareWarpcast = () => {
    const text = `🛡️ My BaseRep Protocol Score is ${score}/1000!%0A%0AAnalyze your on-chain DNA and claim your rank at https://baserep.xyz%0A%0A@base @jessepollak #BaseRep`;
    window.open(`https://warpcast.com/~/compose?text=${text}`, '_blank');
  };

  const handleShareX = () => {
    const text = `🛡️ My BaseRep Protocol Score is ${score}/1000!%0A%0AAnalyze your on-chain DNA at https://baserep.xyz%0A%0A@base @jessepollak #BaseRep #BuildOnBase`;
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <main style={{ backgroundColor: '#020202', minHeight: '100vh', color: 'white', overflowX: 'hidden', position: 'relative', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,82,255,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', zIndex: 100, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: '#0052FF', borderRadius: '10px' }}>
            <ShieldCheck size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-1px', fontStyle: 'italic', textTransform: 'uppercase' }}>BASEREP</span>
        </div>
        <ConnectButton label="Verify Identity" />
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', position: 'relative', zIndex: 10, padding: '0 20px' }}>
        
        {/* Main Card */}
        <div style={{ background: 'rgba(15, 15, 15, 0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '50px', borderRadius: '40px', maxWidth: '850px', width: '100%', backdropFilter: 'blur(40px)', marginBottom: '50px' }}>
          
          <div style={{ color: '#3B82F6', fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={12} /> ENGINE ONLINE // BASE MAINNET
          </div>

          <h1 style={{ fontSize: '4rem', fontWeight: '900', lineHeight: '1', marginBottom: '40px', letterSpacing: '-3px' }}>
            Elevate Your <span style={{ color: '#3B82F6' }}>On-Chain DNA.</span>
          </h1>

          {!isConnected ? (
            <p style={{ color: '#71717A', fontSize: '1.1rem' }}>Connect your wallet to synchronize your reputation score.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '35px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: '#3F3F46', fontSize: '9px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Protocol Score</p>
                <div style={{ fontSize: '5rem', fontWeight: '900', fontStyle: 'italic', marginBottom: '20px' }}>{loading ? "..." : score}</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleShareWarpcast} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>Share Cast</button>
                  <button onClick={handleShareX} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>Share X</button>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '35px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#3F3F46', fontSize: '9px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Rank</p>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3B82F6' }}>{loading ? "Scanning..." : (score && score > 800 ? "ELITE ARCHITECT" : "BASE BUILDER")}</div>
                </div>
                <button onClick={handleMint} style={{ marginTop: '30px', width: '100%', padding: '20px', background: '#0052FF', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  MINT RANK NFT (0.10$) <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Leaderboard Section */}
        <div style={{ width: '100%', maxWidth: '850px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', paddingLeft: '10px' }}>
            <Trophy size={20} color="#EAB308" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>Global Leaderboard</h2>
          </div>
          
          <div style={{ background: 'rgba(15, 15, 15, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '30px', overflow: 'hidden' }}>
            {leaders.map((leader, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 40px', borderBottom: i === leaders.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ color: i === 0 ? '#EAB308' : '#3F3F46', fontWeight: '900', fontSize: '1.2rem' }}>#{i + 1}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', color: 'white' }}>{leader.addr}</div>
                    <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', marginTop: '2px' }}>{leader.rank}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic' }}>{leader.score}</div>
                  <div style={{ fontSize: '8px', color: '#3F3F46', fontWeight: 'bold', letterSpacing: '1px' }}>PTS</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
