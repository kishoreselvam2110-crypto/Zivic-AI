// src/components/dashboard/ReportIssueModal.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, Upload, AlertTriangle, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/app/auth/AuthProvider";
import { useCreateReport } from "@/hooks/useReports";
import { useRouter } from "next/navigation";
import { AIPredictionRow } from "@/services/reports";

interface ReportIssueModalProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportIssueModal({ open, onOpenChange }: ReportIssueModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: createReportMutate } = useCreateReport();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // File State
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Flow State
  const [step, setStep] = useState<"form" | "submitting" | "ai_result">("form");
  const [aiResult, setAiResult] = useState<AIPredictionRow | null>(null);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Reset form on open
      setStep("form");
      setTitle("");
      setCategory("");
      setDescription("");
      setWard("");
      setLocation("");
      setFile(null);
      setFilePreview(null);
      setUploadProgress(0);
      setError(null);
      setAiResult(null);
      setCreatedReportId(null);
      
      // Auto Geolocation
      captureGps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const captureGps = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsLoading(false);
      },
      (err) => {
        console.error("GPS capture failed:", err);
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WEBP images are allowed.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError("File exceeds the maximum size limit of 10 MB.");
      return;
    }

    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const removeFile = () => {
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be signed in to submit reports.");
      return;
    }

    if (latitude === null || longitude === null) {
      setError("Location GPS coordinates are required. Please fill them manually.");
      return;
    }

    setStep("submitting");

    // Smooth UI progress simulation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    try {
      const response = await createReportMutate({
        file,
        userId: user.id,
        title,
        description,
        category,
        location,
        latitude,
        longitude,
      });

      clearInterval(interval);
      setUploadProgress(100);
      setAiResult(response.prediction);
      setCreatedReportId(response.report.id);
      setStep("ai_result");
    } catch (err: any) {
      clearInterval(interval);
      setError(err?.message || "Failed to create report. Please try again.");
      setStep("form");
    }
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
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => step !== "submitting" && onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl shadow-2xl text-white max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {step === "form" && "Report Infrastructure Issue"}
                {step === "submitting" && "Uploading & Analyzing..."}
                {step === "ai_result" && "AI Analysis Complete"}
              </h2>
              {step !== "submitting" && (
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Step 1: Form Inputs */}
              {step === "form" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/80">Issue Title</label>
                    <Input
                      type="text"
                      placeholder="E.g., Deep pothole in middle of the road"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-white/40 focus-visible:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="" disabled className="bg-slate-900 text-white">Select...</option>
                        <option value="pothole" className="bg-slate-900 text-white">Pothole</option>
                        <option value="streetlight" className="bg-slate-900 text-white">Streetlight Outage</option>
                        <option value="traffic_signal" className="bg-slate-900 text-white">Traffic Signal</option>
                        <option value="graffiti" className="bg-slate-900 text-white">Graffiti / Vandalism</option>
                        <option value="other" className="bg-slate-900 text-white">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/80">Ward / Area</label>
                      <Input
                        type="text"
                        placeholder="E.g., Ward 14"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder-white/40 focus-visible:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/80">Location / Address</label>
                    <Input
                      type="text"
                      placeholder="E.g., 5th Cross Road, Indiranagar"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-white/40 focus-visible:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Geolocation Input */}
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wide uppercase text-white/50 flex items-center gap-1.5">
                        <MapPin className="h-3 w.3" /> GPS Coordinates
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={captureGps}
                        disabled={gpsLoading}
                        className="h-7 px-2.5 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                      >
                        {gpsLoading ? "Capturing..." : "Refetch GPS"}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-xs text-white/60">Latitude</label>
                        <Input
                          type="number"
                          step="any"
                          value={latitude !== null ? latitude : ""}
                          onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="Latitude"
                          className="h-8 bg-slate-900 border-white/10 text-white placeholder-white/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">Longitude</label>
                        <Input
                          type="number"
                          step="any"
                          value={longitude !== null ? longitude : ""}
                          onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="Longitude"
                          className="h-8 bg-slate-900 border-white/10 text-white placeholder-white/30"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/80">Description</label>
                    <textarea
                      placeholder="Provide additional details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      required
                    />
                  </div>

                  {/* Image Drag and Drop */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/80">Upload Photo (Max 10MB)</label>
                    {!filePreview ? (
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          dragActive
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25"
                        }`}
                      >
                        <Camera className="w-8 h-8 mb-2 text-white/45" />
                        <p className="text-sm text-white/70">
                          <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-white/45 mt-1">JPEG, PNG, or WEBP</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-white/20 h-32 bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={filePreview}
                          alt="Upload Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/95 text-white rounded-full transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-3 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      className="hover:bg-white/15 text-white"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      Submit Report
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 2: Upload progress */}
              {step === "submitting" && (
                <div className="py-10 flex flex-col items-center justify-center space-y-6">
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-indigo-500 animate-spin" />
                    <Cpu className="absolute h-8 w-8 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="w-full max-w-xs text-center space-y-2">
                    <p className="text-base font-semibold">Running Multi-Agent AI Pipeline</p>
                    <p className="text-xs text-white/60">
                      Uploading image & analyzing severity and routing...
                    </p>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mt-3">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: AI results */}
              {step === "ai_result" && aiResult && (
                <div className="space-y-5">
                  <div className="flex flex-col items-center text-center p-4 border border-green-500/20 bg-green-500/10 rounded-2xl">
                    <CheckCircle2 className="h-12 w-12 text-green-400 mb-2" />
                    <h3 className="text-lg font-bold text-green-300">Report Successfully Submitted</h3>
                    <p className="text-sm text-white/70 mt-1">
                      Our automated agents have analyzed the issue and dispatched maintenance services.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
                    <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="h-4 w-4" /> AI Diagnostics
                    </h4>

                    <div className="grid grid-cols-2 gap-4 text-sm border-b border-white/10 pb-4">
                      <div>
                        <span className="text-white/50 block text-xs">Detected Issue</span>
                        <span className="font-semibold">{aiResult.detected_issue}</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-xs">Confidence Score</span>
                        <span className="font-semibold text-green-300">{aiResult.confidence}%</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-xs">Severity Level</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border font-medium mt-1 ${getPriorityBadgeClass(aiResult.severity)}`}>
                          {aiResult.severity.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-xs">Assigned Priority</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border font-medium mt-1 ${getPriorityBadgeClass(aiResult.priority)}`}>
                          {aiResult.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm border-b border-white/10 pb-4">
                      <div>
                        <span className="text-white/50 block text-xs">Assigned Department</span>
                        <span className="font-semibold text-indigo-200">{aiResult.department}</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-xs">Estimated Resolution</span>
                        <span className="font-semibold text-indigo-200">{aiResult.estimated_resolution}</span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-white/50 block text-xs mb-1">AI Process Summary</span>
                      <p className="text-white/80 leading-relaxed text-xs">
                        {aiResult.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      className="hover:bg-white/10 text-white"
                    >
                      Dismiss
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        if (createdReportId) {
                          router.push(`/report/${createdReportId}`);
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      View Full Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
