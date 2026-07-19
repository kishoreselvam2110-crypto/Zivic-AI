// src/components/dashboard/NotificationsPanel.tsx
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"

interface Notification {
  id: string
  message: string
  time: string
}

const mockNotifications: Notification[] = [
  { id: '1', message: 'New inspection scheduled for sector 3', time: '2h ago' },
  { id: '2', message: 'Report #12 resolved', time: '5h ago' },
  { id: '3', message: 'AI insight: potential water leakage near sector 5', time: '1d ago' },
]

const NotificationsPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white h-full">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-sm font-medium text-white/80">Notifications</CardTitle>
          <Bell className="h-5 w-5 text-white/60" />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {mockNotifications.map((n) => (
            <div key={n.id} className="flex justify-between text-sm">
              <span>{n.message}</span>
              <span className="text-white/60">{n.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default NotificationsPanel
