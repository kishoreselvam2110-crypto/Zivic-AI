// src/components/dashboard/TopNav.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Bell, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/app/auth/AuthProvider";

const TopNav: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/40 backdrop-blur-2xl px-4 md:px-6 py-3.5 z-20">
      <div className="flex items-center gap-3">
        <div className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 text-white font-bold text-xs">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            Citizen Dashboard
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              LIVE AGENT FEED
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Button variant="ghost" className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400" />
          </Button>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">{user?.email || "Citizen User"}</span>
            <span className="text-[10px] text-slate-400">Authenticated</span>
          </div>
          <button
            onClick={() => signOut()}
            className="md:hidden p-2 text-red-300 hover:bg-red-500/20 rounded-xl transition"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
