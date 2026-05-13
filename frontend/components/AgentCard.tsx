"use client";
import { useEffect, useRef, useState } from "react";
import { Agent } from "@/lib/agents-data";
import { RoleIcon } from "./RoleIcon";
import { Loader2, CheckCircle2, AlertCircle, Pause, Brain, Wrench } from "lucide-react";

const accentMap: Record<string, { ring: string; text: string; bg: string; bar: string; glow: string }> = {
  blue:    { ring: "ring-cyan-400/30",    text: "text-cyan-300",    bg: "bg-cyan-400/10",    bar: "bg-cyan-400",    glow: "shadow-cyan-500/20" },
  violet:  { ring: "ring-violet-400/30",  text: "text-violet-300",  bg: "bg-violet-500/10",  bar: "bg-violet-400",  glow: "shadow-violet-500/20" },
  amber:   { ring: "ring-amber-400/30",   text: "text-amber-300",   bg: "bg-amber-500/10",   bar: "bg-amber-400",   glow: "shadow-amber-500/20" },
  emerald: { ring: "ring-emerald-400/30", text: "text-emerald-300", bg: "bg-emerald-500/10", bar: "bg-emerald-400", glow: "shadow-emerald-500/20" },
  rose:    { ring: "ring-rose-400/30",    text: "text-rose-300",    bg: "bg-rose-500/10",    bar: "bg-rose-400",    glow: "shadow-rose-500/20" },
};

const statusIcon = {
  idle:      <Pause       size={11} />,
  thinking:  <Brain       size={11} />,
  working:   <Wrench      size={11} />,
  completed: <CheckCircle2 size={11} />,
  error:     <AlertCircle size={11} />,
};

const statusLabel = {
  idle: "Idle",
  thinking: "Thinking",
  working: "Working",
  completed: "Done",
  error: "Error",
};

export function AgentCard({ agent, onClick, hero }: { agent: Agent; onClick?: () => void; hero?: boolean }) {
  const c = accentMap[agent.accent];
  const isActive = agent.status === "working" || agent.status === "thinking";
  const [flash, setFlash] = useState(false);
  const lastStatus = useRef(agent.status);
  const lastTask = useRef(agent.task);

  useEffect(() => {
    if (lastStatus.current !== agent.status || lastTask.current !== agent.task) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      lastStatus.current = agent.status;
      lastTask.current = agent.task;
      return () => clearTimeout(t);
    }
  }, [agent.status, agent.task]);

  return (
    <div onClick={onClick} className={`card-mount surface rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 group ${flash ? "ring-2 ring-amber-400/40" : ""} ${onClick ? "cursor-pointer" : ""} ${isActive ? `ring-1 ${c.ring} shadow-xl ${c.glow} hover:border-white/[0.18]` : "hover:border-white/[0.14]"} ${hero ? "ring-2" : ""}`}>
      {/* Card header */}
      <div className={`px-3 pt-3 pb-2 flex items-center justify-between ${c.bg}`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${c.bg} ring-1 ${c.ring} flex items-center justify-center flex-shrink-0`}>
            <RoleIcon role={agent.role} size={13} className={c.text} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white tracking-tight leading-none">{agent.name}</p>
            <p className={`text-[9px] uppercase tracking-wider font-medium ${c.text} mt-0.5`}>{agent.role}</p>
          </div>
        </div>
        <div className={`inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text} ring-1 ${c.ring}`}>
          {isActive ? <Loader2 size={8} className="animate-spin" /> : statusIcon[agent.status]}
          {statusLabel[agent.status]}
        </div>
      </div>

      {/* Body — water level fill tied to progress */}
      <div className="p-3 space-y-2.5 relative overflow-hidden">
        {/* Water fill from bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 ${c.bar} opacity-[0.06] transition-all duration-700 ease-out pointer-events-none`}
          style={{ height: `${agent.progress}%` }}
        />

        <div className="relative">
          <p className="text-overline mb-1 text-[10px]">Current Task</p>
          <p className="text-[12px] text-white/85 leading-relaxed line-clamp-3 min-h-[54px]">{agent.task}</p>
        </div>

        <div className="relative flex items-center justify-between">
          <p className="text-[10px] text-white/35 font-mono tnum">{agent.progress.toFixed(2)}% complete</p>
          {isActive && <span className="text-[9px] text-white/30 animate-pulse">live</span>}
        </div>

        <div className={`relative text-[11px] italic text-white/55 leading-relaxed ${c.bg} border-l-2 ${c.ring.replace("ring-", "border-").replace("/30", "/40")} pl-2 pt-[2px] pb-1 min-h-[38px] max-h-[38px] overflow-hidden line-clamp-2`}>
          "{agent.thought}"
        </div>

        <div className="relative flex items-center justify-between text-[10px] text-white/30 pt-1 font-mono tnum">
          <span>{agent.tokensUsed.toLocaleString()} tokens</span>
          <span>{agent.toolCalls} tool calls</span>
        </div>
      </div>
    </div>
  );
}
