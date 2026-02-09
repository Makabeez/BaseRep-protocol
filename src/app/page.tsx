"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { parseEther } from 'viem';
import { ShieldCheck, Activity, ArrowRight, Globe, Zap, Layers, Cpu } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { sendTransaction } = useSendTransaction();

  // OFFICIAL RECIPIENT ADDRESS
  const MY_WALLET = "0x2f225F8A538e7fD613e8ba79DCDdC7D1422AEd1C"; 

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
      value: parseEther('0.00004'), // Approx 0.10$ USD in ETH on Base
    });
  };

  return (
    <main style={{ backgroundColor: '#020202', minHeight: '100vh', color: 'white', overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif' }}>
      {/* High-Tech Glow Effects */}
      <div style={{ position: 'absolute', top: '-15%', left: '5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0,82,255,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Futuristic Navbar */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', zIndex: 100, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: '#0052FF', borderRadius: '10px', boxShadow: '0 0 25px rgba(0,82,255,0.5)' }}>
            <ShieldCheck size={22} color="white" />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: '900', letterSpacing: '-1.2px', fontStyle: 'italic', textTransform: 'uppercase' }}>BASEREP</span>
        </div>
        <ConnectButton label="Verify Identity" />
      </nav>

      {/* Main UI Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '60px', position: 'relative', zIndex: 10, padding: '0 20px' }}>
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', border: '1px solid rgba(255,255,255,0.08)', padding: '50px', borderRadius: '45px', maxWidth: '850px', width: '100%', backdropFilter: 'blur(40px)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontSize: '10px', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '25px', opacity: 0.8 }}>
            <Activity size={12} className="animate-pulse" /> ENGINE ONLINE // BASE MAINNET
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '0.85', marginBottom: '35px', letterSpacing: '-4px' }}>
            Elevate Your <br/>
            <span style={{ background: 'linear-gradient(to right, #60A5FA, #3B82F6, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
               On-Chain DNA.
            </span>
          </h1>

          {!isConnected ? (
            <div style={{ maxWidth: '450px' }}>
              <p style={{ color: '#52525B', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
                Connect your wallet to synchronize your transaction history and establish your official architect rank.
              </p>
              <div style={{ display: 'flex', gap: '20px', opacity: 0.3 }}>
                 <Globe size={18} /> <Zap size={18} /> <Layers size={18} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', textAlign: 'left' }}>
              
              {/* Score Card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '35px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.04)', transition: '0.3s' }}>
                <p style={{ color: '#3F3F46', fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>PROTOCOL SCORE</p>
                <div style={{ fontSize: '4.5rem', fontWeight: '900', fontStyle: 'italic', color: 'white' }}>{loading ? "..." : score}</div>
              </div>

              {/* Rank & Mint Card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '35px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#3F3F46', fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>CURRENT STATUS</p>
                  <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#60A5FA', textTransform: 'uppercase' }}>
                    {loading ? "Scanning..." : (score && score > 800 ? "ELITE ARCHITECT" : "BASE BUILDER")}
                  </div>
                </div>
                
                <div style={{ marginTop: '25px' }}>
                  <button 
                    onClick={handleMint}
                    style={{ width: '100%', padding: '18px', background: '#0052FF', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s', boxShadow: '0 15px 30px rgba(0,82,255,0.2)' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#1E69FF'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#0052FF'}
                  >
                    MINT RANK NFT (0.10$) <ArrowRight size={16} />
                  </button>
                  <p style={{ fontSize: '8px', color: '#27272A', textAlign: 'center', marginTop: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    +1 ON-CHAIN FOOTPRINT TRANSACTION
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Badges Footer */}
        <div style={{ marginTop: '60px', display: 'flex', gap: '40px', opacity: 0.2, filter: 'grayscale(1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}><Cpu size={14} /> BASE NATIVE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}><Layers size={14} /> SECURED</div>
        </div>
      </div>
    </main>
  );
}
