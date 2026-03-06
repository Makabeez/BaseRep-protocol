import React from 'react';
import { ShieldCheck, Users, Fingerprint } from 'lucide-react';

interface ReputationProps {
  ethosScore: number;
  amlStatus: string;
}

export default function ReputationHub({ ethosScore, amlStatus }: ReputationProps) {
  if (ethosScore === 0) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ethos Score Badge */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl">
          <Users className="text-blue-500 mb-4" size={24} />
          <h3 className="text-zinc-500 font-black text-xs uppercase tracking-widest mb-1">Ethos Score</h3>
          <span className="text-4xl font-black text-white">{ethosScore}<span className="text-zinc-700 text-xl">/100</span></span>
        </div>

        {/* Compliance/AML Badge */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl">
          <ShieldCheck className={amlStatus === 'CLEARED' ? "text-green-500" : "text-zinc-600"} size={24} />
          <h3 className="text-zinc-500 font-black text-xs uppercase tracking-widest mb-1">Compliance</h3>
          <span className={`text-2xl font-black uppercase ${amlStatus === 'CLEARED' ? "text-green-500" : "text-zinc-600"}`}>
            {amlStatus}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 bg-blue-600/5 border border-blue-500/10 py-3 rounded-full">
        <Fingerprint size={14} className="text-blue-500/50" />
        <span className="text-blue-500/50 text-[10px] font-black uppercase tracking-widest">
          Verified by EAS & Ethos Protocol
        </span>
      </div>
    </div>
  );
}
