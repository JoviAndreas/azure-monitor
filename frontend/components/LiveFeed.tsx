"use client";
import { useEffect, useRef, useState } from "react";
import { FeedEvent, sampleFeedMessages } from "@/lib/agents-data";
import { Activity, Pause, Play } from "lucide-react";
import { RoleIcon } from "./RoleIcon";

const typeColors: Record<FeedEvent["type"], string> = {
  thought: "text-blue-300 bg-blue-500/10 border-blue-500/20",
  tool: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  result: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  error: "text-red-300 bg-red-500/10 border-red-500/20",
  milestone: "text-violet-300 bg-violet-500/10 border-violet-500/20",
};

const typeLabel: Record<FeedEvent["type"], string> = {
  thought: "thought",
  tool: "tool_call",
  result: "result",
  error: "error",
  milestone: "milestone",
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function LiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const counter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Seed: inject 6 starter events immediately on mount
  useEffect(() => {
    const now = Date.now();
    const seeded: FeedEvent[] = [];
    for (let i = 0; i < 6; i++) {
      counter.current += 1;
      const tmpl = pickRandom(sampleFeedMessages);
      seeded.unshift({
        ...tmpl,
        id: counter.current,
        timestamp: new Date(now - i * 1500),
      });
    }
    setEvents(seeded);
  }, []);

  // Continuous feed — only surface anomalies, errors, milestones, results
  const signal = sampleFeedMessages.filter((m) => m.type === "error" || m.type === "milestone" || m.type === "result");
  const noise  = sampleFeedMessages.filter((m) => m.type === "thought" || m.type === "tool");

  useEffect(() => {
    if (paused) return;
    let active = true;
    const schedule = () => {
      if (!active) return;
      // signals arrive less often but always shown; noise suppressed 80%
      const isSignal = Math.random() < 0.45;
      const pool = isSignal ? signal : noise;
      const delay = isSignal ? 1200 + Math.random() * 1800 : 400 + Math.random() * 800;
      setTimeout(() => {
        if (!active) return;
        if (!isSignal && Math.random() < 0.80) { schedule(); return; } // suppress noise
        const tmpl = pickRandom(pool.length ? pool : sampleFeedMessages);
        counter.current += 1;
        setEvents((prev) => {
          const next = [{ ...tmpl, id: counter.current, timestamp: new Date() }, ...prev];
          return next.slice(0, 60);
        });
        schedule();
      }, delay);
    };
    schedule();
    return () => { active = false; };
  }, [paused]);

  // Force re-render every 5s for "time ago" updates
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  function timeAgo(d: Date) {
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 1) return "just now";
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    return `${m}m ago`;
  }

  return (
    <div className="surface rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b divider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-blue-300" />
          <h3 className="text-heading text-white text-[14px]">Live Activity</h3>
          {!paused && <span className="dot dot-pulse bg-emerald-400 ml-1"></span>}
        </div>
        <button
          onClick={() => setPaused(!paused)}
          className="btn-secondary rounded-md p-1.5 text-[11px] flex items-center gap-1"
        >
          {paused ? <><Play size={11} /> Resume</> : <><Pause size={11} /> Pause</>}
        </button>
      </div>

      <div ref={containerRef} className="overflow-y-auto scrollbar-thin p-3 space-y-1.5 flex-1 min-h-0" style={{ overflowY: "auto" }}>
        {events.length === 0 && (
          <div className="text-center text-white/30 text-[12px] py-8">Waiting for activity...</div>
        )}
        {events.map((e, i) => (
          <div
            key={e.id}
            className="toast-enter flex items-start gap-2.5 p-2 rounded-md hover:bg-white/[0.025] transition-colors"
            style={{ opacity: Math.max(0.25, 1 - i * 0.055), transform: `scale(${Math.max(0.94, 1 - i * 0.008)})`, transformOrigin: "top left" }}
          >
            <div className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
              <RoleIcon role={e.role} size={12} className="text-white/65" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-[12px] font-semibold text-white tracking-tight">{e.agent}</span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-px rounded border ${typeColors[e.type]}`}>
                  {typeLabel[e.type]}
                </span>
                <span className="text-[10px] text-white/25 ml-auto font-mono tnum">{timeAgo(e.timestamp)}</span>
              </div>
              <p className="text-[12px] text-white/65 leading-relaxed break-words line-clamp-2">{e.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 border-t divider text-[10px] text-white/30 font-mono flex items-center justify-between">
        <span>{events.length} events</span>
        <span>auto-truncated @ 60</span>
      </div>
    </div>
  );
}
