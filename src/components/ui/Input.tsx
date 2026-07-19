// src/components/ui/Input.tsx
import React, { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      className="rounded-md border border-gray-300 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
      {...props}
    />
  )
);

Input.displayName = "Input";
