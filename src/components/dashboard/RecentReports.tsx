// src/components/dashboard/RecentReports.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import { useAllReports } from "@/hooks/useReports";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";

export default function RecentReports() {
  const router = useRouter();
  const { data: reports, isLoading, error } = useAllReports();

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-indigo-300" />
          Recent Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="py-10 flex flex-col items-center justify-center space-y-2">
            <Spinner className="h-6 w-6 text-indigo-450" />
            <span className="text-xs text-white/50">Fetching reports...</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg">
            {error.message || "Failed to load reports from Supabase. Verify configuration."}
          </div>
        )}

        {!isLoading && !error && (!reports || reports.length === 0) && (
          <p className="text-center py-6 text-sm text-white/50">
            No reports filed yet. Click &quot;Report Issue&quot; to submit one.
          </p>
        )}

        {!isLoading && !error && reports && reports.length > 0 && (
          <div className="space-y-4">
            {reports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                onClick={() => router.push(`/report/${report.id}`)}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-white">{report.title}</span>
                  <span className="text-sm text-white/70 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {report.location || "Coordinates captured"}
                  </span>
                  <span className="text-xs text-white/50 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${
                    report.status === "resolved" 
                      ? "bg-green-500/20 text-green-300"
                      : report.status === "in_progress"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-indigo-500/20 text-indigo-300"
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-[10px] text-white/40 mt-1">{report.id.substring(0, 8)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
