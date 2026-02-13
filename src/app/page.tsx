"use client";
import { useState } from 'react';
import { isAddress } from 'viem';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";

const LEADERBOARD_DATA = [
  { id: 1, address: "0x2f22...Ed1C", rank: "ELITE ARCHITECT", pts: 1000 },
  { id: 2, address: "0x89b2...4f12", rank: "ELITE ARCHITECT", pts: 980 },
  { id: 3, address: "0x33c1...99aa", rank: "BASE BUILDER", pts: 750 },
];

export default function LeaderboardPage() {
  const [searchAddress, setSearchAddress] = useState("");
  const [foundData, setFoundData] = useState<any>(null);
  const [isAttesting, setIsAttesting] = useState(false);
  const [error, setError] = useState("");

  // Ton UID de schéma validé sur Base.dev
  const SCHEMA_UID = "0x9f680f50ebed1dc06b17b9a5461ee44496fae9b5e82b985634353f9c7054085e";

  const handleCheck = () => {
    if (!isAddress(searchAddress)) {
      setError("Adresse invalide.");
      setFoundData(null);
      return;
    }
    setError("");
    setFoundData(LEADERBOARD_DATA[0]); // Simulation de donnée trouvée
  };

  const handleAttest = async () => {
    if (!foundData || typeof foundData === 'string') return;
    setIsAttesting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(signer);

      const schemaEncoder = new SchemaEncoder("string rank, uint256 points");
      const encodedData = schemaEncoder.encodeData([
        { name: "rank", value: foundData.rank, type: "string" },
        { name: "points", value: foundData.pts, type: "uint256" },
      ]);

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: searchAddress,
          expirationTime: 0n,
          revocable: true,
          data: encodedData,
        },
      });

      const uid = await tx.wait();
      alert("DNA Certifié sur Base ! UID: " + uid);
    } catch (err) {
      console.error(err);
      alert("Erreur d'attestation. Vérifiez votre wallet Base.");
    } finally {
      setIsAttesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md"><span className="font-bold text-xs">✓</span></div>
          <span className="font-bold tracking-tighter text-xl italic uppercase">BASEREP</span>
        </div>
        <button 
          onClick={handleAttest}
          disabled={!foundData || isAttesting}
          className={`${foundData ? 'bg-blue-600 hover:bg-blue-500' : 'bg-zinc-800 cursor-not-allowed'} text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg`}
        >
          {isAttesting ? "Certification..." : "Verify Identity on Base"}
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-16 py-24 px-10 bg-zinc-900/40 rounded-[50px] border border-zinc-800/50 backdrop-blur-sm">
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight leading-none">
          Elevate Your <span className="text-blue-600">On-Chain DNA.</span>
        </h1>
      </div>

      {/* Barre de Recherche */}
      <div className="max-w-xl mx-auto mb-16 flex flex-col items-center gap-4">
        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Check DNA without minting</p>
        <div className="flex gap-2 w-full p-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl focus-within:border-blue-600/50 transition-all">
          <input 
            type="text"
            placeholder="Paste address (0x...)"
            className="bg-transparent p-3 flex-1 text-white focus:outline-none"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button onClick={handleCheck} className="bg-zinc-100 text-black hover:bg-white px-8 py-3 rounded-xl font-bold transition-all">
            Check
          </button>
        </div>
        {foundData && (
           <div className="bg-blue-600/10 border border-blue-600/30 p-6 rounded-3xl w-full text-center">
             <p className="text-2xl font-black text-white">{foundData.rank}</p>
             <p className="text-zinc-400 text-sm font-bold">{foundData.pts} PTS ON BASE</p>
           </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-xl">🏆</span>
          <span className="text-xs font-black tracking-[0.2em] uppercase text-zinc-500">Global Leaderboard</span>
        </div>
        <div className="bg-zinc-900/20 rounded-[32px] border border-zinc-900/80 overflow-hidden backdrop-blur-md">
          {LEADERBOARD_DATA.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-7 border-b border-zinc-900/50 last:border-0 hover:bg-zinc-800/10 transition-all">
              <div className="flex items-center gap-6">
                <span className={`text-xl font-black ${item.id === 1 ? 'text-yellow-500' : 'text-zinc-600'}`}>#{item.id}</span>
                <div className="flex flex-col">
                  <span className="font-mono text-base font-bold text-zinc-200">{item.address}</span>
                  <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase mt-1">{item.rank}</span>
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
