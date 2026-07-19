// src/components/ui/button.tsx
import React, { forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'ghost' | 'default' }>(
  ({ variant = 'default', className = '', ...props }, ref) => {
    const base = "rounded-md px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";
    const styles = {
      default: "bg-indigo-600 hover:bg-indigo-700 text-white",
      ghost: "bg-transparent hover:bg-white/10 text-white",
    }[variant];
    return (
      <button ref={ref} className={`${base} ${styles} ${className}`} {...props} />
    );
  }
);

Button.displayName = "Button";
