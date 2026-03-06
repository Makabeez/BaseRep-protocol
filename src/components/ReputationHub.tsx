import React from 'react';
import { ShieldCheck, Users, Fingerprint } from 'lucide-react';

interface ReputationProps {
  ethosScore: number;
  amlStatus: string;
}

export default function ReputationHub({ ethosScore, amlStatus }: ReputationProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl">
          <Users className="text-blue-500 mb-4" size={24} />
          <h3 className="text-white font-black text-2xl tracking-tighter">ETHOS SCORE</h3>
          <span className="text-4xl font-black text-white">{ethosScore}/100</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl">
          <ShieldCheck className={amlStatus === 'cleared' ? "text-green-500" : "text-zinc-600"} size={24} />
          <h3 className="text-white font-black text-2xl tracking-tighter">AML STATUS</h3>
          <span className="text-xl font-black text-green-500 uppercase">{amlStatus}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 bg-blue-600/10 border border-blue-500/20 py-3 rounded-full">
        <Fingerprint size={16} className="text-blue-400" />
        <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
          Secured by EAS & Base Protocol
        </span>
      </div>
    </div>
  );
}
