// src/components/ui/Card.tsx
"use client";
import React, { ReactNode } from "react";

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg ${className || ""}`}> {children} </div>
);

export const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`flex flex-col items-center space-y-2 ${className || ""}`}> {children} </div>
);

export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h2 className={`text-2xl font-bold ${className || ""}`}> {children} </h2>
);

export const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);
