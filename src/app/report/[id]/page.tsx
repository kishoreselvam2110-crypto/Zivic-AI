// src/app/report/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useReport } from "@/hooks/useReports";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Cpu,
  MapPin,
  MessageSquare,
  AlertTriangle,
  User,
  ShieldCheck,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

export default function ReportDetailsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: report, isLoading, error } = useReport(id);
  
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Array<{ id: number; author: string; text: string; time: string }>>([
    { id: 1, author: "Citizen", text: "Reported this issue, hope it gets fixed soon.", time: "1 hour ago" },
    { id: 2, author: "System AI", text: "AI verified and assigned to Road & Traffic Maintenance.", time: "45 minutes ago" }
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Citizen",
        text: commentText,
        time: "Just now",
      }
    ]);
    setCommentText("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="h-10 w-10 text-indigo-500" />
          <p className="text-sm text-white/70">Retrieving report details...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-md text-white text-center p-6">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Failed to Load Report</h2>
          <p className="text-sm text-red-400 mt-2">
            {error?.message || "The report you are looking for does not exist or has been deleted."}
          </p>
          <Button
            onClick={() => router.push("/dashboard/citizen")}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const { ai_predictions: prediction } = report;

  const getStatusStepClass = (step: string) => {
    const status = report.status;
    const steps = ["new", "in_progress", "resolved"];
    const currentIdx = steps.indexOf(status);
    const stepIdx = steps.indexOf(step);

    if (stepIdx < currentIdx) return "text-indigo-450 border-indigo-500 bg-indigo-500/20";
    if (stepIdx === currentIdx) return "text-indigo-300 border-indigo-400 bg-indigo-500/10 animate-pulse";
    return "text-white/40 border-white/10 bg-white/5";
  };

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-green-500/20 text-green-300 border-green-500/30";
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 bg-gradient-to-b from-indigo-950/45 via-slate-950 to-slate-950 p-4 md:p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/citizen")}
            className="flex items-center gap-2 hover:bg-white/10 text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
          <span className="text-xs text-white/50">Report ID: {report.id}</span>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info (left columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image card */}
            {report.image_url && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 h-72 md:h-[400px] bg-slate-900/60 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={report.image_url}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic details */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold">{report.title}</h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs border font-medium ${getPriorityBadgeClass(report.priority)}`}>
                    {report.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-white/60 mt-2">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-indigo-400" /> {report.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-indigo-400" /> {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-1">Description</h3>
                  <p className="text-white/70 leading-relaxed text-sm">{report.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 text-sm">
                  <div>
                    <span className="text-white/40 block text-xs">GPS Latitude</span>
                    <code className="text-indigo-200">{report.latitude}</code>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs">GPS Longitude</span>
                    <code className="text-indigo-200">{report.longitude}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments block */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-400" /> Citizen Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comments listing */}
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <User className="h-4 w-4 text-indigo-300" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{comment.author}</span>
                          <span className="text-[10px] text-white/40">{comment.time}</span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment input form */}
                <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-white/5">
                  <Input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ask a question or add details..."
                    className="bg-white/5 border-white/10 text-white placeholder-white/35 focus-visible:ring-indigo-500 h-9 text-xs"
                  />
                  <Button type="submit" className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Status timeline & AI assessment */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" /> Status Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pl-6 space-y-6">
                <div className="absolute left-3.5 top-0 bottom-4 w-0.5 bg-white/10" />

                {/* Timeline Step 1: New / Reported */}
                <div className="relative flex gap-3 items-start">
                  <div className={`absolute -left-[19px] h-3.5 w-3.5 rounded-full border-2 bg-slate-950 flex items-center justify-center z-10 ${getStatusStepClass("new")}`} />
                  <div>
                    <h4 className="text-xs font-bold">Report Received</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">Logged in system & parsed by AI agents</p>
                  </div>
                </div>

                {/* Timeline Step 2: In Progress */}
                <div className="relative flex gap-3 items-start">
                  <div className={`absolute -left-[19px] h-3.5 w-3.5 rounded-full border-2 bg-slate-950 flex items-center justify-center z-10 ${getStatusStepClass("in_progress")}`} />
                  <div>
                    <h4 className="text-xs font-bold">Under Review / Dispatch</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">Assigned to field operator team</p>
                  </div>
                </div>

                {/* Timeline Step 3: Resolved */}
                <div className="relative flex gap-3 items-start">
                  <div className={`absolute -left-[19px] h-3.5 w-3.5 rounded-full border-2 bg-slate-950 flex items-center justify-center z-10 ${getStatusStepClass("resolved")}`} />
                  <div>
                    <h4 className="text-xs font-bold">Issue Resolved</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">Field remediation verified by AI / citizen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Diagnostics details */}
            {prediction && (
              <Card className="bg-gradient-to-b from-indigo-950/20 to-purple-950/20 border border-white/15 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-300">
                    <Cpu className="h-5 w-5" /> AI Diagnostics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/40 block">Detected Issue</span>
                      <span className="font-semibold text-white/80">{prediction.detected_issue}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Confidence</span>
                      <span className="font-semibold text-green-300">{prediction.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-white/45 block">Assigned Dept</span>
                      <span className="font-semibold text-indigo-200">{prediction.department}</span>
                    </div>
                    <div>
                      <span className="text-white/45 block">Est. Resolution</span>
                      <span className="font-semibold text-indigo-200 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {prediction.estimated_resolution}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <span className="text-white/45 block text-[10px] uppercase font-semibold tracking-wider">AI Summary</span>
                    <p className="text-xs text-white/75 mt-1 leading-relaxed">{prediction.summary}</p>
                  </div>

                  {/* Future activity history placeholder */}
                  <div className="border-t border-white/10 pt-3 text-[11px] text-white/40">
                    <span className="block font-semibold uppercase tracking-wider text-[10px] mb-1">Activity Log</span>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Vision classification executed successfully.</li>
                      <li>Department routing determined: {prediction.department}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
