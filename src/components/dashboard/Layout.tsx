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
    <div className="relative flex min-h-screen bg-[#070b14] text-white overflow-hidden">
      {/* Background Animated Ambient Mesh Gradient */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-700/30 via-purple-600/20 to-pink-500/10 blur-[140px] animate-blob-slow" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-600/25 via-teal-600/20 to-indigo-800/30 blur-[150px] animate-blob-delay" />
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px] animate-blob-fast" />

      {/* Grid texture overlay */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="p-4 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </main>
        <ReportIssueButton onClick={() => setIsReportOpen(true)} />
        <ReportIssueModal open={isReportOpen} onOpenChange={setIsReportOpen} />
      </div>
    </div>
  );
};

export default Layout;
