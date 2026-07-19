// src/components/ui/GlassCard.tsx
import { ReactNode } from "react";

export function GlassCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg">
      {children}
    </div>
  );
}
