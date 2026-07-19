// src/components/dashboard/Layout.tsx
"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ReportIssueButton from "@/components/dashboard/ReportIssueButton";
import ReportIssueModal from "@/components/dashboard/ReportIssueModal";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-cyan-600">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="p-4 overflow-auto flex-1">
          {children}
        </main>
        <ReportIssueButton onClick={() => setIsReportOpen(true)} />
        <ReportIssueModal open={isReportOpen} onOpenChange={setIsReportOpen} />
      </div>
    </div>
  );
};

export default Layout;
