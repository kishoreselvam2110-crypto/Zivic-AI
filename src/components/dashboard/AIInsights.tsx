// src/components/dashboard/AIInsights.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Zap, ArrowUpRight } from "lucide-react";

const AIInsights: React.FC = () => {
  const insights = [
    {
      title: "Potential Water Leakage",
      desc: "Pressure drops detected near Sector 5 main pipeline",
      priority: "high",
    },
    {
      title: "Pothole Density Warning",
      desc: "3 new reports within 200m on Indiranagar 100ft Road",
      priority: "medium",
    },
    {
      title: "Smart Dispatch Optimization",
      desc: "Auto-routed Unit #4 for streetlight repairs",
      priority: "low",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl"
    >
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-fuchsia-500/15 blur-2xl" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Autonomous AI Insights
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">Multi-Agent Neural Analysis</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Agent Active
        </span>
      </div>

      <div className="space-y-2.5">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-start justify-between p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-300/80 leading-snug pl-5">
                {item.desc}
              </p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIInsights;
