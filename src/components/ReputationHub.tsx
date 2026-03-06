import React from 'react';
import { ShieldCheck, Users, Fingerprint } from 'lucide-react';

interface ReputationProps {
  ethosScore: number;
  amlStatus: 'cleared' | 'pending' | 'flagged';
}

export default function ReputationHub({ ethosScore, amlStatus }: ReputationProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Ethos Integration - Social Reputation */}
        <div className="group bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Social Reputation</span>
          </div>
          <h3 className="text-white font-black text-2xl tracking-tighter mb-1 uppercase">Ethos Score</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{ethosScore}</span>
            <span className="text-zinc-500 font-bold">/100</span>
          </div>
        </div>

        {/* AML/Compliance Status */}
        <div className="group bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <ShieldCheck className={amlStatus === 'cleared' ? "text-green-500" : "text-zinc-600"} size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Compliance</span>
          </div>
          <h3 className="text-white font-black text-2xl tracking-tighter mb-1 uppercase">AML Status</h3>
          <span className={`text-xl font-black uppercase tracking-tight ${amlStatus === 'cleared' ? "text-green-500" : "text-zinc-500"}`}>
            {amlStatus === 'cleared' ? "CLEARED" : "PENDING VERIFICATION"}
          </span>
        </div>

      </div>
      
      {/* Verification Badge */}
      <div className="flex items-center justify-center gap-2 bg-blue-600/10 border border-blue-500/20 py-3 rounded-full">
        <Fingerprint size={16} className="text-blue-400" />
        <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
          Secured by EAS & Base Protocol
        </span>
      </div>
    </div>
  );
}
