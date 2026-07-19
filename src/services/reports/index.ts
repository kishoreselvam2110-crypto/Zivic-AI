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

export const createReport = async (
  reportData: Omit<ReportInsert, "id" | "created_at" | "updated_at">
): Promise<ReportRow> => {
  checkSupabaseConfig();

  const { data, error } = await supabase
    .from("reports")
    .insert([reportData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create report: ${error.message}`);
  }

  return data;
};

export const getReportWithPrediction = async (
  id: string
): Promise<ReportWithPrediction> => {
  checkSupabaseConfig();

  // Fetch report details
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (reportError) {
    throw new Error(`Failed to fetch report: ${reportError.message}`);
  }

  // Fetch linked AI prediction
  const { data: prediction, error: predictionError } = await supabase
    .from("ai_predictions")
    .select("*")
    .eq("report_id", id)
    .maybeSingle();

  return {
    ...report,
    ai_predictions: prediction || null,
  };
};

export const getReports = async (userId?: string): Promise<ReportRow[]> => {
  checkSupabaseConfig();

  let query = supabase.from("reports").select("*").order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch reports: ${error.message}`);
  }

  return data || [];
};

export const createAIPrediction = async (
  predictionData: AIPredictionInsert
): Promise<AIPredictionRow> => {
  checkSupabaseConfig();

  const { data, error } = await supabase
    .from("ai_predictions")
    .insert([predictionData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save AI prediction: ${error.message}`);
  }

  return data;
};
