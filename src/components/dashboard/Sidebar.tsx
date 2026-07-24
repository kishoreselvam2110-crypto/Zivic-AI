// src/components/dashboard/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/auth/AuthProvider";
import { Home, AlertCircle, FileText, Bot, MapPin, Bell, LogOut, User, Sparkles } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard/citizen", icon: Home },
  { name: "Report Issue", href: "/dashboard/citizen", icon: AlertCircle },
  { name: "My Reports", href: "/dashboard/citizen", icon: FileText },
  { name: "AI Insights", href: "/dashboard/citizen", icon: Bot },
  { name: "Map View", href: "/dashboard/citizen", icon: MapPin },
  { name: "Notifications", href: "/dashboard/citizen", icon: Bell },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r border-white/10 bg-slate-900/40 backdrop-blur-2xl p-4 flex-shrink-0 z-20">
      {/* Brand logo & Badge */}
      <div className="mb-6 px-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-lg glow-cyan">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gradient-vibrant">Zivic AI</h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Urban Intelligence</p>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/30 to-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User profile & Sign Out */}
      <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white font-bold text-xs">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-semibold text-white truncate">{user?.email || "Citizen User"}</p>
            <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono">{role || "Citizen"}</p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-start gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-300 hover:bg-red-500/20 hover:border hover:border-red-500/30 transition-all"
        >
          <LogOut className="h-4 w-4 text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
