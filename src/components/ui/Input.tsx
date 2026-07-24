// src/components/ui/Input.tsx
import React, { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-all duration-200 focus:border-indigo-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";
