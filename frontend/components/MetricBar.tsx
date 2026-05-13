"use client";
import { cn } from "@/lib/utils";

interface MetricBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

function barColor(v: number) {
  if (v >= 80) return "bg-red-400";
  if (v >= 60) return "bg-amber-400";
  return "bg-emerald-400";
}

function barTextColor(v: number) {
  if (v >= 80) return "text-red-300";
  if (v >= 60) return "text-amber-300";
  return "text-emerald-300";
}

export function MetricBar({ value, showLabel = true, className }: MetricBarProps) {
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className={cn("text-[12px] font-medium tnum mb-1", barTextColor(value))}>
          {value.toFixed(0)}%
        </div>
      )}
      <div className="h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-300", barColor(value))}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}
