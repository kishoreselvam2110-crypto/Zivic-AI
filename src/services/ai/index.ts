export interface AIPipelineResult {
  detectedIssue: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  priority: "low" | "medium" | "high" | "critical";
  department: string;
  estimatedResolution: string;
  summary: string;
}

/**
 * Runs the mock AI pipeline.
 * This simulates the execution of several agents:
 * - Vision Agent: Analyzes the image/video to detect the civic issue.
 * - Severity Agent: Estimates the potential danger and impact.
 * - Duplicate Detection Agent: Checks if this issue was already reported.
 * - Priority Agent: Assigns response urgency.
 * - Routing Agent: Identifies the responsible department.
 *
 * Later, this implementation can be swapped out with Google Gemini + Antigravity agents.
 */
export const runAIPipeline = async (
  title: string,
  description: string,
  category: string,
  imageUrl: string | null
): Promise<AIPipelineResult> => {
  // Simulate network latency for running the multi-agent pipeline
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerTitle = title.toLowerCase();
  const lowerDesc = (description || "").toLowerCase();
  const lowerCat = (category || "").toLowerCase();

  let detectedIssue = "General Civic Issue";
  let department = "Urban Planning & Management";
  let severity: "low" | "medium" | "high" | "critical" = "medium";
  let priority: "low" | "medium" | "high" | "critical" = "medium";
  let estimatedResolution = "72 Hours";
  let summary = "The issue has been logged and queued for inspection by municipality operators.";

  if (
    lowerTitle.includes("pothole") ||
    lowerDesc.includes("pothole") ||
    lowerCat.includes("pothole")
  ) {
    detectedIssue = "Pothole / Road Damage";
    department = "Roads & Traffic Maintenance";
    severity = "high";
    priority = "high";
    estimatedResolution = "48 Hours";
    summary = "Vision Agent identified a road surface cavity (pothole). Severity Agent classified this as High due to active vehicle traffic. Duplicate Detection confirmed no existing open reports in a 50m radius. Assigned to Road Maintenance.";
  } else if (
    lowerTitle.includes("streetlight") ||
    lowerDesc.includes("light") ||
    lowerCat.includes("streetlight")
  ) {
    detectedIssue = "Streetlight Outage";
    department = "Electrical & Public Lighting";
    severity = "medium";
    priority = "medium";
    estimatedResolution = "72 Hours";
    summary = "Vision Agent verified an inactive municipal luminaire. Severity Agent set to Medium based on the location safety assessment. Routed to Public Lighting.";
  } else if (
    lowerTitle.includes("signal") ||
    lowerDesc.includes("traffic") ||
    lowerCat.includes("traffic_signal")
  ) {
    detectedIssue = "Traffic Signal Malfunction";
    department = "Traffic Engineering & Control";
    severity = "critical";
    priority = "critical";
    estimatedResolution = "24 Hours";
    summary = "Vision Agent verified non-responsive or flashing signals at intersection. Severity Agent flagged as Critical due to imminent safety hazards. Routed to Emergency Traffic Team.";
  } else if (
    lowerTitle.includes("graffiti") ||
    lowerDesc.includes("paint") ||
    lowerCat.includes("graffiti")
  ) {
    detectedIssue = "Graffiti / Vandalism";
    department = "Public Spaces & Sanitation";
    severity = "low";
    priority = "low";
    estimatedResolution = "5 Days";
    summary = "Vision Agent identified paint spray vandalism on a concrete retaining wall. Severity Agent set to Low. Routed to Graffiti Removal.";
  }

  // Add random variation to confidence (between 92% and 99%)
  const confidence = Math.floor(Math.random() * 8) + 92;

  return {
    detectedIssue,
    confidence,
    severity,
    priority,
    department,
    estimatedResolution,
    summary,
  };
};
