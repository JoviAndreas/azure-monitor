"use client";
import { AzureResource } from "@/lib/types";
import { getMockMetrics } from "@/lib/mock-data";
import { resourceTypeLabel } from "@/lib/utils";
import { ResourceTypeIcon } from "@/lib/icons";
import { StatusBadge } from "./StatusBadge";
import { MetricBar } from "./MetricBar";
import { X, MapPin, Tag, ExternalLink, Copy, Activity, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface ResourceDetailProps {
  resource: AzureResource;
  onClose: () => void;
}

function MetricChart({ resourceId, metric, color, gradientId }: {
  resourceId: string;
  metric: string;
  color: string;
  gradientId: string;
}) {
  const data = getMockMetrics(resourceId, metric).map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    value: Math.round(p.value),
  }));

  return (
    <ResponsiveContainer width="100%" height={90}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }}
          tickLine={false}
          interval={5}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }}
          tickLine={false}
          domain={[0, 100]}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(20, 24, 31, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            fontSize: 11,
            padding: "6px 10px",
            color: "rgba(255,255,255,0.9)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
          labelStyle={{ color: "rgba(255,255,255,0.4)", marginBottom: 2, fontSize: 10 }}
          itemStyle={{ color, padding: 0 }}
          cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#${gradientId})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MetricRow({ label, avg, max }: { label: string; avg: number; max: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b divider last:border-0">
      <span className="text-[12px] text-white/55">{label}</span>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[11px] text-white/35 font-mono">avg</p>
          <p className="text-[12px] text-white tnum font-medium">{avg.toFixed(0)}%</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-white/35 font-mono">max</p>
          <p className="text-[12px] text-white tnum font-medium">{max.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
}

export function ResourceDetail({ resource, onClose }: ResourceDetailProps) {
  const hasDtu = resource.metrics.dtuAvg !== undefined;
  const hasConnections = resource.metrics.connectionsAvg !== undefined;
  const hasRequests = resource.metrics.requestsPerMin !== undefined;

  return (
    <div className="surface rounded-lg overflow-hidden flex flex-col min-h-0 h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b divider">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg surface-elevated flex items-center justify-center text-white/65 flex-shrink-0">
            <ResourceTypeIcon type={resource.type} size={16} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-white truncate tracking-tight">{resource.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-[11px] text-white/45">{resourceTypeLabel(resource.type)}</span>
              <span className="text-white/15">·</span>
              <span className="text-[11px] text-white/45 inline-flex items-center gap-1">
                <MapPin size={9} />
                {resource.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors">
            <ExternalLink size={13} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="surface-elevated rounded-md p-2.5">
            <p className="text-overline text-[10px] mb-1">SKU</p>
            <p className="font-mono text-[11px] text-white">{resource.sku}</p>
          </div>
          <div className="surface-elevated rounded-md p-2.5">
            <p className="text-overline text-[10px] mb-1">Tier</p>
            <p className="text-[12px] text-white font-medium">{resource.tier}</p>
          </div>
          <div className="surface-elevated rounded-md p-2.5">
            <p className="text-overline text-[10px] mb-1">RG</p>
            <p className="font-mono text-[11px] text-white truncate">{resource.resourceGroup}</p>
          </div>
        </div>

        {/* Status block */}
        <div className="surface-elevated rounded-md p-3">
          <p className="text-overline mb-2.5">Status</p>
          <div className="flex items-center justify-between gap-3">
            <StatusBadge value={resource.status} variant="status" />
            <span className="text-white/15">→</span>
            <StatusBadge value={resource.recommendation} variant="recommendation" />
          </div>
        </div>

        {/* Metrics table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-overline">Resource Metrics</p>
            <span className="text-[10px] text-white/30 font-mono">24h window</span>
          </div>
          <div className="surface-elevated rounded-md px-3">
            <MetricRow label="CPU" avg={resource.metrics.cpuAvg} max={resource.metrics.cpuMax} />
            <MetricRow label="Memory" avg={resource.metrics.memoryAvg} max={resource.metrics.memoryMax} />
            {hasDtu && <MetricRow label="DTU" avg={resource.metrics.dtuAvg!} max={resource.metrics.dtuMax!} />}
          </div>
        </div>

        {(hasConnections || hasRequests) && (
          <div className="grid grid-cols-2 gap-2">
            {hasConnections && (
              <div className="surface-elevated rounded-md p-3">
                <p className="text-overline mb-1.5">Connections</p>
                <p className="text-[20px] font-semibold text-white tnum tracking-tight leading-none">{resource.metrics.connectionsAvg}</p>
                <p className="text-[10px] text-white/35 mt-1">average</p>
              </div>
            )}
            {hasRequests && (
              <div className="surface-elevated rounded-md p-3">
                <p className="text-overline mb-1.5">Requests / min</p>
                <p className="text-[20px] font-semibold text-white tnum tracking-tight leading-none">{resource.metrics.requestsPerMin}</p>
                <p className="text-[10px] text-white/35 mt-1">average</p>
              </div>
            )}
          </div>
        )}

        {/* Charts */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <p className="text-[12px] font-medium text-white/75 inline-flex items-center gap-1.5">
                <span className="dot bg-red-400"></span> CPU
              </p>
              <span className="text-[10px] text-white/35 font-mono">peak {resource.metrics.cpuMax}%</span>
            </div>
            <div className="surface-elevated rounded-md p-2">
              <MetricChart resourceId={resource.id} metric="cpu" color="#f87171" gradientId="cpu-grad" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <p className="text-[12px] font-medium text-white/75 inline-flex items-center gap-1.5">
                <span className="dot bg-blue-400"></span> Memory
              </p>
              <span className="text-[10px] text-white/35 font-mono">peak {resource.metrics.memoryMax}%</span>
            </div>
            <div className="surface-elevated rounded-md p-2">
              <MetricChart resourceId={resource.id} metric="memory" color="#60a5fa" gradientId="mem-grad" />
            </div>
          </div>
          {hasDtu && (
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[12px] font-medium text-white/75 inline-flex items-center gap-1.5">
                  <span className="dot bg-amber-400"></span> DTU
                </p>
                <span className="text-[10px] text-white/35 font-mono">peak {resource.metrics.dtuMax}%</span>
              </div>
              <div className="surface-elevated rounded-md p-2">
                <MetricChart resourceId={resource.id} metric="dtu" color="#fbbf24" gradientId="dtu-grad" />
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {Object.keys(resource.tags).length > 0 && (
          <div>
            <p className="text-overline mb-2 inline-flex items-center gap-1">
              <Tag size={9} /> Tags
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(resource.tags).map(([k, v]) => (
                <span key={k} className="text-[11px] font-mono surface-elevated rounded px-2 py-0.5">
                  <span className="text-white/35">{k}=</span>
                  <span className="text-white/85">{v}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resource ID */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-overline">Resource ID</p>
            <button className="p-1 rounded text-white/35 hover:text-white/80 hover:bg-white/[0.05] transition-colors">
              <Copy size={10} />
            </button>
          </div>
          <p className="surface-elevated rounded-md p-2.5 text-[10.5px] font-mono text-white/55 break-all leading-relaxed">{resource.id}</p>
        </div>

        {/* Last updated */}
        <div className="flex items-center gap-1.5 text-[10px] text-white/30 pt-1">
          <Clock size={10} />
          <span>Last updated {new Date(resource.lastUpdated).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
