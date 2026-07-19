// src/components/dashboard/OverviewStats.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const stats: StatItem[] = [
  { label: "Active Reports", value: 12 },
  { label: "Issues Resolved", value: 34 },
  { label: "Pending Inspections", value: 5 },
  { label: "Avg. Resolution Time", value: "2d 4h" },
];

const OverviewStats: React.FC = () => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white"
        >
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-white/80">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-2xl font-bold">
            {stat.value}
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};

export default OverviewStats;
