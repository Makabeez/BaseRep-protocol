"use client";
import { useState } from 'react';
import { isAddress } from 'viem'; // Utilise viem déjà installé dans ton package.json

// Données simulées du Leaderboard
const LEADERBOARD_DATA = [
  { id: 1, address: "0x2f22...Ed1C", rank: "ELITE ARCHITECT", pts: 1000 },
  { id: 2, address: "0x89b2...4f12", rank: "ELITE ARCHITECT", pts: 980 },
  { id: 3, address: "0x33c1...99aa", rank: "BASE BUILDER", pts: 750 },
];

export default function LeaderboardPage() {
  const [searchAddress, setSearchAddress] = useState("");
  const [error, setError] = useState("");
  const [foundData, setFoundData] = useState<any>(null);

  // Fonction pour vérifier l'adresse sans Mint
  const handleCheck = () => {
    if (!isAddress(searchAddress)) {
      setError("Adresse invalide. Veuillez entrer une adresse 0x...");
      setFoundData(null);
      return;
    }
    setError("");
    
    // Simulation de recherche (à lier à ta DB ou API plus tard)
    const result = LEADERBOARD_DATA.find(item => 
      item.address.toLowerCase().includes(searchAddress.toLowerCase().slice(0, 6))
    );
    
    if (result) {
      setFoundData(result);
    } else {
      setFoundData("Aucune donnée trouvée pour cette adresse.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      {/* Barre de navigation */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <span className="font-bold text-xs text-white">✓</span>
          </div>
          <span className="font-bold tracking-tighter text-xl italic text-zinc-100 uppercase">BASEREP</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
          Verify Identity
        </button>
      </div>

      {/* Hero Section avec le design Elite */}
      <div className="max-w-4xl mx-auto text-center mb-16 py-24 px-10 bg-zinc-900/40 rounded-[50px] border border-zinc-800/50 backdrop-blur-sm">
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight leading-none">
          Elevate Your <span className="text-blue-600">On-Chain DNA.</span>
        </h1>
      </div>

      {/* Barre de Recherche (Check without Mint) */}
      <div className="max-w-xl mx-auto mb-16 flex flex-col items-center gap-4">
        <p className="text-zinc-500 text-sm font-medium">Check your DNA without minting</p>
        <div className="flex gap-2 w-full p-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl focus-within:border-blue-600/50 transition-all">
          <input 
            type="text"
            placeholder="Paste address (0x...)"
            className="bg-transparent p-3 flex-1 text-white focus:outline-none placeholder:text-zinc-600"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button 
            onClick={handleCheck}
            className="bg-zinc-100 text-black hover:bg-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            Check
          </button>
        </div>
        
        {/* Affichage des résultats de recherche */}
        {error && <p className="text-red-500 text-xs font-bold bg-red-500/10 py-2 px-4 rounded-full border border-red-500/20">{error}</p>}
        {foundData && typeof foundData === 'object' && (
           <div className="bg-blue-600/10 border border-blue-600/30 p-6 rounded-3xl w-full text-center animate-in fade-in zoom-in duration-300">
             <p className="text-blue-400 text-xs uppercase tracking-widest font-bold mb-1">Status Found</p>
             <p className="text-2xl font-black text-white">{foundData.rank}</p>
             <p className="text-zinc-400 text-sm">{foundData.pts} PTS ON BASE</p>
           </div>
        )}
      </div>

      {/* Global Leaderboard Section */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-xl">🏆</span>
          <span className="text-xs font-black tracking-[0.2em] uppercase text-zinc-500">Global Leaderboard</span>
        </div>

        <div className="bg-zinc-900/20 rounded-[32px] border border-zinc-900/80 overflow-hidden backdrop-blur-md">
          {LEADERBOARD_DATA.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-7 border-b border-zinc-900/50 last:border-0 hover:bg-zinc-800/10 transition-all group">
              <div className="flex items-center gap-6">
                <span className={`text-xl font-black ${item.id === 1 ? 'text-yellow-500' : 'text-zinc-600'}`}>
                  #{item.id}
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-base font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {item.address}
                  </span>
                  <span className="text-[10px] font-black text-blue-500 tracking-[0.15em] uppercase mt-1">
                    {item.rank}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black tracking-tighter">{item.pts}</span>
                <span className="text-[9px] font-black text-zinc-700 tracking-widest uppercase">Points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
