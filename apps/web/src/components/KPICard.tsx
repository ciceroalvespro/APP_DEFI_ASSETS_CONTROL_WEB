import { ReactNode } from "react";

export default function KPICard({ title, value, footer }: { title: string; value: ReactNode; footer?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-card/60 border border-white/10 p-4 shadow-glow">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
      {footer && <div className="mt-2 text-xs text-white/50">{footer}</div>}
    </div>
  );
}
