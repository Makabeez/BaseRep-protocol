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

  const SCHEMA_UID = "0x9f680f50ebed1dc06b17b9a5461ee44496fae9b5e82b985634353f9c7054085e"; //

  const handleCheck = () => {
    if (!isAddress(searchAddress)) { setFoundData(null); return; }
    setFoundData(LEADERBOARD_DATA[0]);
  };

  const handleAttest = async () => {
    if (!foundData) return;
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
        data: { recipient: searchAddress, expirationTime: 0n, revocable: true, data: encodedData },
      });
      await tx.wait();
      alert("Succès !");
    } catch (err) { alert("Erreur."); } finally { setIsAttesting(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <div className="font-bold italic italic uppercase tracking-tighter text-xl text-zinc-100">BASEREP</div>
        <button onClick={handleAttest} disabled={!foundData || isAttesting} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">
          {isAttesting ? "Attestation..." : "Verify Identity on Base"}
        </button>
      </div>
      <div className="max-w-4xl mx-auto text-center mb-16 py-24 px-10 bg-zinc-900/40 rounded-[50px] border border-zinc-800/50">
        <h1 className="text-6xl md:text-8xl font-black mb-4">Elevate Your <span className="text-blue-600">On-Chain DNA.</span></h1>
      </div>
      <div className="max-w-xl mx-auto mb-16 flex flex-col items-center gap-4">
        <div className="flex gap-2 w-full p-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
          <input type="text" placeholder="Paste address (0x...)" className="bg-transparent p-3 flex-1 text-white focus:outline-none" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} />
          <button onClick={handleCheck} className="bg-zinc-100 text-black px-8 py-3 rounded-xl font-bold">Check</button>
        </div>
      </div>
    </div>
  );
}
