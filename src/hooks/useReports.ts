import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadReportImage } from "@/services/storage";
import {
  createReport,
  createAIPrediction,
  getReportWithPrediction,
  getReports,
  ReportInsert,
  ReportRow,
  AIPredictionRow
} from "@/services/reports";
import { runAIPipeline } from "@/services/ai";

interface CreateReportVariables {
  file: File | null;
  userId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface CreateReportResponse {
  report: ReportRow;
  prediction: AIPredictionRow;
}

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReportResponse, Error, CreateReportVariables>({
    mutationFn: async (variables: CreateReportVariables) => {
      // 1. Upload image if present
      let imageUrl: string | null = null;
      if (variables.file) {
        imageUrl = await uploadReportImage(variables.file, variables.userId);
      }

      // 2. Create the report in Supabase
      const reportInsertData: Omit<ReportInsert, "id" | "created_at" | "updated_at"> = {
        user_id: variables.userId,
        title: variables.title,
        description: variables.description,
        category: variables.category,
        location: variables.location,
        latitude: variables.latitude,
        longitude: variables.longitude,
        image_url: imageUrl,
        status: "new",
        priority: "medium", // default initial priority
      };

      const report = await createReport(reportInsertData);

      // 3. Trigger Mock AI Pipeline
      const aiResult = await runAIPipeline(
        variables.title,
        variables.description,
        variables.category,
        imageUrl
      );

      // 4. Save AI predictions linked by report_id
      const prediction = await createAIPrediction({
        report_id: report.id,
        detected_issue: aiResult.detectedIssue,
        confidence: aiResult.confidence,
        severity: aiResult.severity,
        priority: aiResult.priority,
        department: aiResult.department,
        estimated_resolution: aiResult.estimatedResolution,
        summary: aiResult.summary,
      });

      // Update status/priority of the report based on AI results
      // (Optional: in a real system we might do this via DB triggers or direct update,
      // let's do a quick update to keep the database record and AI assessment in sync)
      // await updateReport(report.id, { status: "new", priority: aiResult.priority });

      return { report, prediction };
    },
    onSuccess: () => {
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => getReportWithPrediction(id),
    enabled: !!id,
  });
};

export const useAllReports = (userId?: string) => {
  return useQuery({
    queryKey: ["reports", userId],
    queryFn: () => getReports(userId),
  });
};
