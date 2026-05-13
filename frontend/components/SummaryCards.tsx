"use client";
import { DashboardSummary } from "@/lib/types";
import { AlertTriangle, CheckCircle2, XCircle, TrendingUp, TrendingDown, Server, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/lib/toast";

interface KPICardProps {
  label: string;
  value: number;
  total?: number;
  delta?: { value: number; direction: "up" | "down" | "flat" };
  icon: React.ElementType;
  accentColor: string;
  iconBg: string;
}

function KPICard({ label, value, total, delta, icon: Icon, accentColor, iconBg, onClick }: KPICardProps & { onClick?: () => void }) {
  const pct = total ? Math.round((value / total) * 100) : null;

  return (
    <button
      onClick={onClick}
      className="surface rounded-lg p-4 hover:border-white/[0.12] transition-all hover:-translate-y-0.5 text-left cursor-pointer w-full">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${iconBg}`}>
          <Icon size={14} className={accentColor} />
        </div>
        {delta && (
          <div className={`flex items-center gap-0.5 text-[11px] font-medium ${
            delta.direction === "up" ? "text-emerald-300" :
            delta.direction === "down" ? "text-red-300" : "text-white/40"
          }`}>
            {delta.direction === "up" && <ArrowUp size={10} />}
            {delta.direction === "down" && <ArrowDown size={10} />}
            <span>{Math.abs(delta.value)}%</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-[26px] font-semibold text-white tracking-tight tnum leading-none">{value}</p>
        {total && <p className="text-[13px] text-white/30 tnum">/ {total}</p>}
      </div>
      <p className="text-[12px] text-white/45 mt-1.5 font-medium">{label}</p>
      {pct !== null && (
        <div className="mt-3 h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
          <div className={`h-full rounded-full ${
            label === "Healthy" ? "bg-emerald-400" :
            label === "Warning" ? "bg-amber-400" :
            label === "Critical" ? "bg-red-400" :
            label === "Needs Upgrade" ? "bg-red-400" :
            label === "Can Downgrade" ? "bg-blue-400" :
            "bg-white/30"
          }`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </button>
  );
}

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const { push } = useToast();
  const filter = (label: string) => push({ kind: "info", title: `Filter: ${label}`, message: "Filter applied to resource table" });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard label="Total Resources" value={summary.total} icon={Server} accentColor="text-white/70" iconBg="bg-white/[0.06]" delta={{ value: 0, direction: "flat" }} onClick={() => filter("All resources")} />
      <KPICard label="Healthy" value={summary.healthy} total={summary.total} icon={CheckCircle2} accentColor="text-emerald-300" iconBg="bg-emerald-500/10" delta={{ value: 5, direction: "up" }} onClick={() => filter("Healthy")} />
      <KPICard label="Warning" value={summary.warning} total={summary.total} icon={AlertTriangle} accentColor="text-amber-300" iconBg="bg-amber-500/10" delta={{ value: 2, direction: "up" }} onClick={() => filter("Warning")} />
      <KPICard label="Critical" value={summary.critical} total={summary.total} icon={XCircle} accentColor="text-red-300" iconBg="bg-red-500/10" delta={{ value: 1, direction: "down" }} onClick={() => filter("Critical")} />
      <KPICard label="Needs Upgrade" value={summary.upgradeNeeded} total={summary.total} icon={TrendingUp} accentColor="text-red-300" iconBg="bg-red-500/10" onClick={() => filter("Needs Upgrade")} />
      <KPICard label="Can Downgrade" value={summary.downgradeOpportunity} total={summary.total} icon={TrendingDown} accentColor="text-blue-300" iconBg="bg-blue-500/10" onClick={() => filter("Can Downgrade")} />
    </div>
  );
}
