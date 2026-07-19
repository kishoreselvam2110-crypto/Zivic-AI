// src/components/dashboard/InfrastructureHealthScore.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";

const InfrastructureHealthScore: React.FC = () => {
  const score = 82; // mock score out of 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-sm font-medium text-white/80">
            Infrastructure Health Score
          </CardTitle>
          <BarChart2 className="h-5 w-5 text-white/60" />
        </CardHeader>
        <CardContent className="p-4 text-3xl font-bold text-center">
          {score}%
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InfrastructureHealthScore;
