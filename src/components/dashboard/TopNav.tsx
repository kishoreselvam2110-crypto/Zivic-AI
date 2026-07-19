// src/components/dashboard/TopNav.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Bell, User } from "lucide-react";

const TopNav: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-white/10 backdrop-blur-lg border-b border-white/20 px-4 py-2">
      <h1 className="text-xl font-semibold text-white">Citizen Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:bg-white/20">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="text-white hover:bg-white/20">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default TopNav;
