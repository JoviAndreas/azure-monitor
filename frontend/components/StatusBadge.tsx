import { ResourceStatus, Recommendation } from "@/lib/types";

const statusConfig: Record<ResourceStatus, { dot: string; text: string; bg: string }> = {
  healthy:  { dot: "bg-emerald-400", text: "text-emerald-200", bg: "bg-emerald-500/10 border-emerald-500/20" },
  warning:  { dot: "bg-amber-400",   text: "text-amber-200",   bg: "bg-amber-500/10 border-amber-500/20" },
  critical: { dot: "bg-red-400",     text: "text-red-200",     bg: "bg-red-500/10 border-red-500/20" },
  unknown:  { dot: "bg-white/30",    text: "text-white/50",    bg: "bg-white/[0.04] border-white/10" },
};

const recConfig: Record<Recommendation, { text: string; bg: string }> = {
  upgrade:   { text: "text-red-200",     bg: "bg-red-500/10 border-red-500/20" },
  downgrade: { text: "text-blue-200",    bg: "bg-blue-500/10 border-blue-500/20" },
  ok:        { text: "text-emerald-200", bg: "bg-emerald-500/10 border-emerald-500/20" },
  review:    { text: "text-amber-200",   bg: "bg-amber-500/10 border-amber-500/20" },
};

interface StatusBadgeProps {
  value: string;
  variant: "status" | "recommendation";
}

export function StatusBadge({ value, variant }: StatusBadgeProps) {
  if (variant === "status") {
    const cfg = statusConfig[value as ResourceStatus];
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize border ${cfg.bg} ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
        {value}
      </span>
    );
  }
  const cfg = recConfig[value as Recommendation];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize border ${cfg.bg} ${cfg.text}`}>
      {value}
    </span>
  );
}
