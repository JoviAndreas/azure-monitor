import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResourceStatus, Recommendation, ResourceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function statusColor(status: ResourceStatus): string {
  return {
    healthy: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-red-400",
    unknown: "text-zinc-400",
  }[status];
}

export function statusBg(status: ResourceStatus): string {
  return {
    healthy: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
    warning: "bg-amber-400/10 text-amber-400 ring-amber-400/20",
    critical: "bg-red-400/10 text-red-400 ring-red-400/20",
    unknown: "bg-zinc-400/10 text-zinc-400 ring-zinc-400/20",
  }[status];
}

export function recommendationBg(rec: Recommendation): string {
  return {
    upgrade: "bg-red-400/10 text-red-400 ring-red-400/20",
    downgrade: "bg-blue-400/10 text-blue-400 ring-blue-400/20",
    ok: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
    review: "bg-amber-400/10 text-amber-400 ring-amber-400/20",
  }[rec];
}

export function resourceTypeLabel(type: ResourceType): string {
  return {
    "app-service": "App Service",
    "app-service-plan": "App Plan",
    "sql-database": "SQL Database",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    cosmosdb: "CosmosDB",
    redis: "Redis",
    aks: "AKS",
    storage: "Storage",
  }[type];
}

export function metricBarColor(value: number): string {
  if (value >= 80) return "bg-red-500";
  if (value >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}
