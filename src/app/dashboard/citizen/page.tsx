// src/app/dashboard/citizen/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/dashboard/Layout";
import OverviewStats from "@/components/dashboard/OverviewStats";
import InfrastructureHealthScore from "@/components/dashboard/InfrastructureHealthScore";
import AIInsights from "@/components/dashboard/AIInsights";
import RecentReports from "@/components/dashboard/RecentReports";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import { useAuth } from "@/app/auth/AuthProvider";
import { Sparkles, Calendar, MapPin } from "lucide-react";

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const userName = user?.email ? user.email.split("@")[0] : "Citizen";

  return (
    <Layout>
      <motion.div 
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              Urban Intelligence Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient-vibrant capitalize">{userName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 flex items-center gap-2 pt-0.5">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" /> Active Jurisdiction: Indiranagar Ward 14
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Overview Stats */}
        <OverviewStats />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <InfrastructureHealthScore />
            <RecentReports />
          </div>
          <div className="flex flex-col gap-6">
            <AIInsights />
            <NotificationsPanel />
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
