// src/components/dashboard/AIInsights.tsx
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Bot } from "lucide-react"
import { motion } from "framer-motion"

const AIInsights: React.FC = () => {
  const insights = [
    "Potential water leakage near sector 5",
    "High foot traffic area recommended for new park",
    "Road wear exceeds maintenance threshold",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-sm font-medium text-white/80">AI Insights</CardTitle>
          <Bot className="h-5 w-5 text-white/60" />
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {insights.map((insight, idx) => (
            <p key={idx} className="text-sm">• {insight}</p>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AIInsights
