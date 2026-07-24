// src/components/dashboard/OverviewStats.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, Activity, TrendingUp } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  badge: string;
}

const stats: StatItem[] = [
  {
    label: "Active Reports",
    value: 12,
    subtext: "3 urgent priority",
    icon: AlertCircle,
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
    glow: "hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]",
    badge: "+2 today",
  },
  {
    label: "Issues Resolved",
    value: 34,
    subtext: "Verified by AI vision",
    icon: CheckCircle2,
    gradient: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30",
    glow: "hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
    badge: "89.4% rate",
  },
  {
    label: "Pending Inspections",
    value: 5,
    subtext: "Routed to field units",
    icon: Activity,
    gradient: "from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30",
    glow: "hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]",
    badge: "In queue",
  },
  {
    label: "Avg. Resolution Time",
    value: "2d 4h",
    subtext: "Faster than target",
    icon: Clock,
    gradient: "from-purple-500/20 to-fuchsia-500/20 text-purple-300 border-purple-500/30",
    glow: "hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
    badge: "-18% time",
  },
];

const OverviewStats: React.FC = () => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl transition-all duration-300 ${stat.glow}`}
          >
            {/* Top Accent line */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300/80">{stat.label}</span>
              <div className={`p-2 rounded-xl border ${stat.gradient}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/10">
                <TrendingUp className="h-2.5 w-2.5" />
                {stat.badge}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              {stat.subtext}
            </p>
          </div>
        );
      })}
    </motion.div>
  );
};

export default OverviewStats;
