// src/components/dashboard/ReportIssueButton.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

type Props = {
  onClick: () => void;
};

const ReportIssueButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg z-50 flex items-center"
    >
      <AlertCircle className="h-5 w-5 mr-2" />
      Report Issue
    </Button>
  );
};

export default ReportIssueButton;
