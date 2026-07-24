// src/components/ui/Button.tsx
import React, { forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'ghost' | 'default' | 'outline' | 'glass' }
>(
  ({ variant = 'default', className = '', ...props }, ref) => {
    const base = "rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 active:scale-[0.98]";
    const styles = {
      default: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25",
      ghost: "bg-transparent hover:bg-white/10 text-white",
      outline: "border border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md",
      glass: "border border-white/20 bg-slate-900/60 hover:bg-slate-800/80 text-white backdrop-blur-xl shadow-lg",
    }[variant];
    return (
      <button ref={ref} className={`${base} ${styles} ${className}`} {...props} />
    );
  }
);

Button.displayName = "Button";
