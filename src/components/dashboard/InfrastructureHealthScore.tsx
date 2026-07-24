// src/components/dashboard/InfrastructureHealthScore.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, AlertTriangle } from "lucide-react";

const InfrastructureHealthScore: React.FC = () => {
  const score = 84;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl"
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-500/15 blur-2xl" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Infrastructure Health Index</h3>
            <p className="text-[11px] text-slate-400">Ward 14 • Real-time AI Score</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <ShieldCheck className="h-3.5 w-3.5" /> Optimal
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-gradient-cyan">{score}</span>
            <span className="text-sm text-slate-400 font-semibold">/ 100</span>
          </div>
          <span className="text-xs text-slate-300 font-medium">84% Operational Efficiency</span>
        </div>

        {/* Custom Glass Progress Bar */}
        <div className="h-3 w-full rounded-full bg-white/5 border border-white/10 overflow-hidden p-0.5 backdrop-blur-md">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 glow-cyan"
          />
        </div>

        {/* Metric breakdowns */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
          <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-slate-400">Road Quality</span>
            <span className="font-bold text-cyan-300">88%</span>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-slate-400">Lighting</span>
            <span className="font-bold text-indigo-300">92%</span>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
            <span className="block text-slate-400">Drainage</span>
            <span className="font-bold text-amber-300 flex items-center gap-0.5">
              <AlertTriangle className="h-3 w-3" /> 72%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfrastructureHealthScore;
