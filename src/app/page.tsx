"use client";
import { useState } from 'react';
import { isAddress } from 'viem'; // Utilise viem déjà installé

// Données fictives pour le leaderboard (à remplacer par tes data réelles plus tard)
const LEADERBOARD_DATA = [
  { id: 1, address: "0x2f22...Ed1C", rank: "ELITE ARCHITECT", pts: 1000 },
  { id: 2, address: "0x89b2...4f12", rank: "ELITE ARCHITECT", pts: 980 },
  { id: 3, address: "0x33c1...99aa", rank: "BASE BUILDER", pts: 750 },
];

export default function LeaderboardPage() {
  const [searchAddress, setSearchAddress] = useState("");
  const [error, setError] = useState("");
  const [foundData, setFoundData] = useState<any>(null);

  const handleCheck = () => {
    if (!isAddress(searchAddress)) {
      setError("Adresse invalide. Veuillez entrer une adresse 0x...");
      setFoundData(null);
      return;
    }
    setError("");
    
    // Logique de recherche simple dans les data locales pour le test
    const result = LEADERBOARD_DATA.find(item => 
      item.address.toLowerCase().includes(searchAddress.toLowerCase().slice(0, 6))
    );
    
    setFoundData(result || "Pas de données trouvées pour cette adresse.");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      {/* Header & Logo */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <span className="font-bold text-xs text-white">✓</span>
          </div>
          <span className="font-bold tracking-tighter text-xl italic text-zinc-100">BASEREP</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all">
          Verify Identity
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-16 py-20 px-10 bg-zinc-900/50 rounded-[40px] border border-zinc-800">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight leading-none">
          Elevate Your <span className="text-blue-600">On-Chain DNA.</span>
        </h1>
      </div>

      {/* NEW: Search Address Section */}
      <div className="max-w-xl mx-auto mb-12 flex flex-col items-center gap-4">
        <p className="text-zinc-400 text-sm">Check your DNA without minting</p>
        <div className="flex gap-2 w-full">
          <input 
            type="text"
            placeholder="Paste address (0x...)"
            className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex-1 text-white focus:outline-none focus:border-blue-600 transition-colors"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button 
            onClick={handleCheck}
            className="bg-zinc-100 text-black hover:bg-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Check
          </button>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        {foundData && typeof foundData === 'object' && (
           <div className="bg-blue-600/10 border border-blue-600/50 p-4 rounded-xl w-full text-center">
             <p className="text-blue-400 text-sm">Rank: <span className="font-bold text-white">{foundData.rank}</span></p>
             <p className="text-blue-400 text-sm">Score: <span className="font-bold text-white">{foundData.pts} PTS</span></p>
           </div>
        )}
      </div>

      {/* Global Leaderboard */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-zinc-400">
          <span className="text-yellow-500">🏆</span>
          <span className="text-xs font-bold tracking-widest uppercase">Global Leaderboard</span>
        </div>

        <div className="bg-zinc-900/30 rounded-3xl border border-zinc-900 overflow-hidden">
          {LEADERBOARD_DATA.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-6 border-b border-zinc-900/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 font-bold">#{item.id}</span>
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-bold">{item.address}</span>
                  <span className="text-[10px] font-bold text-blue-500 tracking-wider">{item.rank}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-black">{item.pts}</span>
                <span className="text-[8px] font-bold text-zinc-600 tracking-widest uppercase">PTS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
