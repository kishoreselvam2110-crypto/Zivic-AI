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

export default function CitizenDashboardPage() {
  return (
    <Layout>
      <motion.div 
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center text-white">
          <h1 className="text-3xl font-bold">Welcome back, Citizen</h1>
          <span className="text-sm text-white/80">Today is {new Date().toLocaleDateString()}</span>
        </div>

        <OverviewStats />

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
