import React from 'react';
import { ShieldCheck, Users, Fingerprint } from 'lucide-react';

interface ReputationProps {
  ethosScore: number;
  amlStatus: string;
}

export default function ReputationHub({ ethosScore, amlStatus }: ReputationProps) {
  if (ethosScore === 0) return null;

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ethos Score Badge */}
        <div className="relative overflow-hidden bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Users className="text-blue-400 mb-4 opacity-80" size={22} />
          <h3 className="text-white/40 font-semibold text-[11px] uppercase tracking-[0.2em] mb-1">Ethos Score</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-medium text-white tracking-tight">{ethosScore}</span>
            <span className="text-white/30 text-lg">/100</span>
          </div>
        </div>

        {/* Compliance/AML Badge */}
        <div className="relative overflow-hidden bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <ShieldCheck className={amlStatus === 'CLEARED' ? "text-green-400 opacity-80" : "text-white/40"} size={22} />
          <h3 className="text-white/40 font-semibold text-[11px] uppercase tracking-[0.2em] mb-1">Compliance</h3>
          <span className={`text-2xl font-medium tracking-tight ${amlStatus === 'CLEARED' ? "text-green-400" : "text-white/50"}`}>
            {amlStatus}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 py-3 opacity-60">
        <Fingerprint size={14} className="text-blue-400" />
        <span className="text-blue-400 text-[10px] font-semibold uppercase tracking-widest">
          Verified by EAS & Ethos Protocol
        </span>
      </div>
    </div>
  );
}
