// src/components/dashboard/NotificationsPanel.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Clock, Info } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  time: string;
  type: "success" | "info" | "warning";
}

const mockNotifications: Notification[] = [
  { id: '1', message: 'Report #104 (Indiranagar Pothole) assigned to Road Maintenance', time: '12m ago', type: 'info' },
  { id: '2', message: 'Streetlight outage on 5th Main marked as Resolved', time: '1h ago', type: 'success' },
  { id: '3', message: 'AI Vision model re-assessed priority score to Critical', time: '3h ago', type: 'warning' },
];

const NotificationsPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live System Updates</h3>
            <p className="text-[11px] text-slate-400 font-mono">Real-time Feed</p>
          </div>
        </div>
        <span className="text-[10px] text-cyan-300 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30">
          3 New
        </span>
      </div>

      <div className="space-y-2.5">
        {mockNotifications.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            {n.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : n.type === 'warning' ? (
              <Bell className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-slate-200 leading-snug">{n.message}</p>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <Clock className="h-3 w-3 text-slate-500" /> {n.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;
