// src/components/dashboard/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, AlertCircle, FileText, Bot, MapPin, Bell, Settings, HelpCircle, User } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard/citizen", icon: Home },
  { name: "Report Issue", href: "/dashboard/citizen", icon: AlertCircle }, // placeholder link
  { name: "My Reports", href: "/dashboard/citizen", icon: FileText },
  { name: "AI Insights", href: "/dashboard/citizen", icon: Bot },
  { name: "Map", href: "/dashboard/citizen", icon: MapPin },
  { name: "Notifications", href: "/dashboard/citizen", icon: Bell },
  { name: "Settings", href: "/dashboard/citizen", icon: Settings },
  { name: "Help", href: "/dashboard/citizen", icon: HelpCircle },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 p-4">
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/20"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
      {/* Bottom user profile */}
      <div className="mt-4 border-t border-white/20 pt-4">
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
