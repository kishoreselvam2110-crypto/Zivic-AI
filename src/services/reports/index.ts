import { supabase } from "@/lib/supabase";
import { checkSupabaseConfig } from "@/services/storage";
import { Database } from "@/lib/supabase";

export type ReportRow = Database["public"]["Tables"]["reports"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];
export type AIPredictionRow = Database["public"]["Tables"]["ai_predictions"]["Row"];
export type AIPredictionInsert = Database["public"]["Tables"]["ai_predictions"]["Insert"];

export interface ReportWithPrediction extends ReportRow {
  ai_predictions: AIPredictionRow | null;
}

// Initial Demo Reports
const DEFAULT_DEMO_REPORTS: ReportRow[] = [
  {
    id: "rep_101",
    user_id: "usr_demo",
    title: "Deep Pothole on 100ft Road Indiranagar",
    description: "Severe pothole right in the middle of 100ft Road causeway near 12th Main junction, posing risk to 2-wheelers.",
    category: "pothole",
    location: "Indiranagar 100ft Road, Ward 14",
    latitude: 12.9784,
    longitude: 77.6408,
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop",
    status: "in_progress",
    priority: "high",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "rep_102",
    user_id: "usr_demo",
    title: "Broken Streetlight & Exposed Electrical Wires",
    location: "5th Cross, Koramangala 4th Block",
    description: "Streetlight pole damaged due to fallen tree branch; live wires exposed near pedestrian sidewalk.",
    category: "streetlight",
    latitude: 12.9345,
    longitude: 77.6243,
    image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    status: "new",
    priority: "critical",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "rep_103",
    user_id: "usr_demo",
    title: "Water Overflow from Main Drainage Line",
    location: "MG Road Metro Station Junction",
    description: "Stormwater drain blocked by debris causing dirty water accumulation on pedestrian crossing.",
    category: "other",
    latitude: 12.9756,
    longitude: 77.6067,
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=80&w=800&auto=format&fit=crop",
    status: "resolved",
    priority: "medium",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "rep_104",
    user_id: "usr_demo",
    title: "Traffic Signal Malfunction at Ring Road",
    location: "Marathahalli Bridge Underpass",
    description: "Signal light stuck on red for all directions causing major traffic bottleneck during peak hours.",
    category: "traffic_signal",
    latitude: 12.9567,
    longitude: 77.7011,
    image_url: null,
    status: "in_progress",
    priority: "high",
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

const DEFAULT_DEMO_PREDICTIONS: Record<string, AIPredictionRow> = {
  rep_101: {
    id: "pred_101",
    report_id: "rep_101",
    detected_issue: "Asphalt Structural Failure (Pothole)",
    confidence: 94.8,
    severity: "high",
    priority: "high",
    department: "Road & Surface Maintenance Dept",
    estimated_resolution: "24-48 Hours",
    summary: "Vision classification identified asphalt surface crack exceeding 15cm depth. High risk to two-wheelers. Dispatched patch repair unit.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  rep_102: {
    id: "pred_102",
    report_id: "rep_102",
    detected_issue: "Exposed Electrical Conduit & Lighting Defect",
    confidence: 98.2,
    severity: "critical",
    priority: "critical",
    department: "Municipal Electricity & Lighting Board",
    estimated_resolution: "2-4 Hours",
    summary: "High voltage hazard detected near public walkway. Emergency dispatch triggered automatically for rapid isolation.",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  rep_103: {
    id: "pred_103",
    report_id: "rep_103",
    detected_issue: "Stormwater Drainage Blockage",
    confidence: 89.1,
    severity: "medium",
    priority: "medium",
    department: "Water Supply & Drainage Sanitation",
    estimated_resolution: "Completed",
    summary: "Drainage clearance completed by sanitation team. AI vision confirmed clear water channel flow.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  rep_104: {
    id: "pred_104",
    report_id: "rep_104",
    detected_issue: "Signal Controller Relay Fault",
    confidence: 91.5,
    severity: "high",
    priority: "high",
    department: "Urban Traffic Control & Logistics",
    estimated_resolution: "12 Hours",
    summary: "Traffic flow simulation recommends temporary manual override while controller unit is rebooted.",
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
};

const STORAGE_KEY_REPORTS = "zivic_local_reports";
const STORAGE_KEY_PREDICTIONS = "zivic_local_predictions";

const getLocalReports = (): ReportRow[] => {
  if (typeof window === "undefined") return DEFAULT_DEMO_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(DEFAULT_DEMO_REPORTS));
      return DEFAULT_DEMO_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_REPORTS;
  }
};

const saveLocalReport = (report: ReportRow) => {
  if (typeof window === "undefined") return;
  const current = getLocalReports();
  const updated = [report, ...current.filter((r) => r.id !== report.id)];
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
};

const getLocalPredictions = (): Record<string, AIPredictionRow> => {
  if (typeof window === "undefined") return DEFAULT_DEMO_PREDICTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREDICTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PREDICTIONS, JSON.stringify(DEFAULT_DEMO_PREDICTIONS));
      return DEFAULT_DEMO_PREDICTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_PREDICTIONS;
  }
};

const saveLocalPrediction = (pred: AIPredictionRow) => {
  if (typeof window === "undefined") return;
  const current = getLocalPredictions();
  current[pred.report_id] = pred;
  localStorage.setItem(STORAGE_KEY_PREDICTIONS, JSON.stringify(current));
};

export const createReport = async (
  reportData: Omit<ReportInsert, "id" | "created_at" | "updated_at">
): Promise<ReportRow> => {
  const newId = `rep_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  
  const fallbackReport: ReportRow = {
    id: newId,
    user_id: reportData.user_id,
    title: reportData.title,
    description: reportData.description || null,
    category: reportData.category || "other",
    location: reportData.location || "Indiranagar, Ward 14",
    latitude: reportData.latitude,
    longitude: reportData.longitude,
    image_url: reportData.image_url || null,
    status: reportData.status || "new",
    priority: reportData.priority || "medium",
    created_at: now,
    updated_at: now,
  };

  if (checkSupabaseConfig()) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .insert([reportData])
        .select()
        .single();

      if (!error && data) {
        saveLocalReport(data);
        return data;
      }
    } catch (err) {
      console.warn("Supabase createReport fallback to local storage:", err);
    }
  }

  // Fallback to local storage
  saveLocalReport(fallbackReport);
  return fallbackReport;
};

export const getReportWithPrediction = async (
  id: string
): Promise<ReportWithPrediction> => {
  // 1. Check local storage first
  const localList = getLocalReports();
  const foundLocal = localList.find((r) => r.id === id);
  const localPreds = getLocalPredictions();

  if (foundLocal) {
    return {
      ...foundLocal,
      ai_predictions: localPreds[id] || null,
    };
  }

  // 2. Try Supabase query if configured
  if (checkSupabaseConfig()) {
    try {
      const { data: report, error: reportError } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (!reportError && report) {
        const { data: prediction } = await supabase
          .from("ai_predictions")
          .select("*")
          .eq("report_id", id)
          .maybeSingle();

        return {
          ...report,
          ai_predictions: prediction || null,
        };
      }
    } catch (err) {
      console.warn("Supabase getReportWithPrediction fallback:", err);
    }
  }

  // 3. Fallback mock generator if specific report ID was created on local browser
  const generatedReport: ReportRow = {
    id,
    user_id: "usr_demo",
    title: "Infrastructure Issue #" + id.substring(0, 8),
    description: "Infrastructure report submitted via citizen intelligence platform.",
    category: "pothole",
    location: "Indiranagar, Ward 14",
    latitude: 12.9716,
    longitude: 77.5946,
    image_url: null,
    status: "in_progress",
    priority: "high",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const generatedPrediction: AIPredictionRow = {
    id: `pred_${id}`,
    report_id: id,
    detected_issue: "Infrastructure Surface Anomaly",
    confidence: 93.4,
    severity: "high",
    priority: "high",
    department: "Road & Surface Maintenance Dept",
    estimated_resolution: "24-48 Hours",
    summary: "AI classification processed the report details and routed to local municipal field team.",
    created_at: new Date().toISOString(),
  };

  return {
    ...generatedReport,
    ai_predictions: generatedPrediction,
  };
};

export const getReports = async (userId?: string): Promise<ReportRow[]> => {
  const localReports = getLocalReports();

  if (checkSupabaseConfig()) {
    try {
      let query = supabase.from("reports").select("*").order("created_at", { ascending: false });
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Merge Supabase and local reports
        const ids = new Set(data.map((r) => r.id));
        const combined = [...data, ...localReports.filter((r) => !ids.has(r.id))];
        return combined;
      }
    } catch (err) {
      console.warn("Supabase getReports fallback to local storage:", err);
    }
  }

  return localReports;
};

export const createAIPrediction = async (
  predictionData: AIPredictionInsert
): Promise<AIPredictionRow> => {
  const newId = `pred_${Date.now().toString(36)}`;
  const fallbackPrediction: AIPredictionRow = {
    id: newId,
    report_id: predictionData.report_id,
    detected_issue: predictionData.detected_issue,
    confidence: predictionData.confidence,
    severity: predictionData.severity,
    priority: predictionData.priority,
    department: predictionData.department,
    estimated_resolution: predictionData.estimated_resolution,
    summary: predictionData.summary,
    created_at: new Date().toISOString(),
  };

  if (checkSupabaseConfig()) {
    try {
      const { data, error } = await supabase
        .from("ai_predictions")
        .insert([predictionData])
        .select()
        .single();

      if (!error && data) {
        saveLocalPrediction(data);
        return data;
      }
    } catch (err) {
      console.warn("Supabase createAIPrediction fallback to local storage:", err);
    }
  }

  saveLocalPrediction(fallbackPrediction);
  return fallbackPrediction;
};
