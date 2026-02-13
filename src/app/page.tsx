"use client";
import { useState } from 'react';
import { isAddress } from 'viem';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";

export default function LeaderboardPage() {
  const [searchAddress, setSearchAddress] = useState("");
  const [foundData, setFoundData] = useState<any>(null);
  const [isAttesting, setIsAttesting] = useState(false);

  const SCHEMA_UID = "0x9f680f50ebed1dc06b17b9a5461ee44496fae9b5e82b985634353f9c7054085e";

  const handleCheck = () => {
    if (isAddress(searchAddress)) {
      setFoundData({ rank: "ELITE ARCHITECT", pts: 1000 });
    }
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
    } catch (err) {
      alert("Erreur.");
    } finally {
      setIsAttesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <div className="font-bold italic uppercase text-xl">BASEREP</div>
        <button onClick={handleAttest} disabled={!foundData || isAttesting} className="bg-blue-600 px-6 py-2 rounded-xl font-bold">
          {isAttesting ? "Attestation..." : "Verify Identity on Base"}
        </button>
      </div>
      <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
        <div className="flex gap-2 w-full p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <input type="text" placeholder="Paste address (0x...)" className="bg-transparent p-3 flex-1 text-white focus:outline-none" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} />
          <button onClick={handleCheck} className="bg-zinc-100 text-black px-8 py-3 rounded-xl font-bold">Check</button>
        </div>
      </div>
    </div>
  );
}
