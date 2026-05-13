"use client";
import { ChevronRight } from "lucide-react";

const colorMap: Record<string, { dot: string; text: string }> = {
  white:   { dot: "bg-white/40",    text: "text-white/70" },
  blue:    { dot: "bg-blue-400",    text: "text-blue-300" },
  violet:  { dot: "bg-violet-400",  text: "text-violet-300" },
  amber:   { dot: "bg-amber-400",   text: "text-amber-300" },
  emerald: { dot: "bg-emerald-400", text: "text-emerald-300" },
  rose:    { dot: "bg-rose-400",    text: "text-rose-300" },
};

export interface PipelineStage {
  stage: string;
  count: number;
  color: string;
}

export function TaskPipeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="surface rounded-lg px-4 py-2.5 flex items-center gap-1 overflow-x-auto scrollbar-thin">
      {stages.map((stage, i) => {
        const c = colorMap[stage.color];
        return (
          <div key={stage.stage} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
              <span className="text-[11px] text-white/40 font-medium">{stage.stage}</span>
              <span className={`text-[13px] font-bold tnum tabular-nums ${c.text}`}>{stage.count}</span>
            </div>
            {i < stages.length - 1 && <ChevronRight size={12} className="text-white/10 flex-shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}
