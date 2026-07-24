// src/components/dashboard/RecentReports.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, AlertTriangle, ChevronRight, ShieldAlert, Cpu } from "lucide-react";
import { useAllReports } from "@/hooks/useReports";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";

// Fallback demo reports for instant visual presentation if Supabase data isn't present
const DEMO_FALLBACK_REPORTS = [
  {
    id: "rep_101",
    title: "Deep Pothole on 100ft Road Indiranagar",
    location: "Indiranagar 100ft Road, Ward 14",
    status: "in_progress",
    priority: "high",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: "pothole",
  },
  {
    id: "rep_102",
    title: "Broken Streetlight & Exposed Cables",
    location: "5th Cross, Koramangala 4th Block",
    status: "new",
    priority: "critical",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    category: "streetlight",
  },
  {
    id: "rep_103",
    title: "Water Overflow from Main Drainage",
    location: "MG Road Metro Junction",
    status: "resolved",
    priority: "medium",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    category: "other",
  },
  {
    id: "rep_104",
    title: "Traffic Signal Malfunction at Outer Ring Rd",
    location: "Marathahalli Bridge Underpass",
    status: "in_progress",
    priority: "high",
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    category: "traffic_signal",
  },
];

export default function RecentReports() {
  const router = useRouter();
  const { data: reports, isLoading } = useAllReports();

  const displayReports = (reports && reports.length > 0) ? reports : DEMO_FALLBACK_REPORTS;

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
      case "high":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
      case "medium":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "resolved":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "in_progress":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-xl p-5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-md">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Recent Infrastructure Reports
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">AI-Classified Citizen Submissions</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Spinner className="h-7 w-7 text-cyan-400" />
          <span className="text-xs text-slate-400">Loading infrastructure feeds...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {displayReports.slice(0, 5).map((report) => (
            <div
              key={report.id}
              onClick={() => router.push(`/report/${report.id}`)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-slate-800/60 hover:border-cyan-400/40 transition-all cursor-pointer shadow-sm gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {report.title}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${getPriorityBadgeClass(report.priority)}`}>
                    {report.priority || "Medium"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" /> {report.location || "Indiranagar, Ward 14"}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-500" /> {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase border ${getStatusBadgeClass(report.status)}`}>
                  {report.status?.replace("_", " ")}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
