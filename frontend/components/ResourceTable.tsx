"use client";
import { useState } from "react";
import { AzureResource, ResourceType } from "@/lib/types";
import { resourceTypeLabel } from "@/lib/utils";
import { ResourceTypeIcon } from "@/lib/icons";
import { StatusBadge } from "./StatusBadge";
import { MetricBar } from "./MetricBar";
import { DropdownMenu } from "./DropdownMenu";
import { Modal } from "./Modal";
import { useToast } from "@/lib/toast";
import { ChevronsUpDown, ArrowUp, ArrowDown, Filter, Search, MoreHorizontal, RotateCw, TrendingUp, TrendingDown, ScrollText, Tag, Trash2, ExternalLink, Copy } from "lucide-react";

type SortKey = "name" | "type" | "status" | "recommendation" | "cpuAvg" | "memoryAvg";

interface ResourceTableProps {
  resources: AzureResource[];
  onSelect: (resource: AzureResource) => void;
  selectedId?: string;
}

export function ResourceTable({ resources, onSelect, selectedId }: ResourceTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortAsc, setSortAsc] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ resource: AzureResource; kind: "restart" | "scale-up" | "scale-down" | "delete" } | null>(null);
  const { push, dismiss } = useToast();

  function rowActions(r: AzureResource) {
    return [
      { label: "Restart", icon: <RotateCw size={13} />, onClick: () => setConfirmAction({ resource: r, kind: "restart" }) },
      { label: "Scale up", icon: <TrendingUp size={13} />, onClick: () => setConfirmAction({ resource: r, kind: "scale-up" }) },
      { label: "Scale down", icon: <TrendingDown size={13} />, onClick: () => setConfirmAction({ resource: r, kind: "scale-down" }) },
      { divider: true, label: "", onClick: () => {} },
      { label: "View logs", icon: <ScrollText size={13} />, onClick: () => push({ kind: "info", title: "Logs", message: `Opening logs for ${r.name}` }) },
      { label: "Edit tags", icon: <Tag size={13} />, onClick: () => push({ kind: "info", title: "Edit tags", message: `Tag editor for ${r.name}` }) },
      { label: "Open in Azure", icon: <ExternalLink size={13} />, onClick: () => push({ kind: "info", title: "Opening Azure Portal...", message: r.id }) },
      { label: "Copy resource ID", icon: <Copy size={13} />, onClick: () => { navigator.clipboard.writeText(r.id); push({ kind: "success", title: "Copied to clipboard" }); } },
      { divider: true, label: "", onClick: () => {} },
      { label: "Delete", icon: <Trash2 size={13} />, variant: "danger" as const, onClick: () => setConfirmAction({ resource: r, kind: "delete" }) },
    ];
  }

  function executeAction() {
    if (!confirmAction) return;
    const { resource, kind } = confirmAction;
    const labels = {
      restart: { loading: "Restarting", done: "Restarted", err: false },
      "scale-up": { loading: "Scaling up", done: "Scaled up", err: false },
      "scale-down": { loading: "Scaling down", done: "Scaled down", err: false },
      delete: { loading: "Deleting", done: "Deleted", err: true },
    };
    const { loading, done, err } = labels[kind];
    setConfirmAction(null);
    const id = push({ kind: "loading", title: `${loading} ${resource.name}...`, message: kind === "delete" ? "This is destructive" : "Operation in progress" });
    setTimeout(() => {
      dismiss(id);
      push({
        kind: err ? "error" : "success",
        title: `${done} ${resource.name}`,
        message: err ? "Resource removed permanently" : `Action completed at ${new Date().toLocaleTimeString()}`,
      });
    }, 1500);
  }

  const types = Array.from(new Set(resources.map((r) => r.type)));

  const filtered = resources
    .filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.resourceGroup.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || r.type === typeFilter;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortKey === "cpuAvg") { av = a.metrics.cpuAvg; bv = b.metrics.cpuAvg; }
      else if (sortKey === "memoryAvg") { av = a.metrics.memoryAvg; bv = b.metrics.memoryAvg; }
      else { av = a[sortKey] as string; bv = b[sortKey] as string; }
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronsUpDown size={11} className="text-white/15" />;
    return sortAsc
      ? <ArrowUp size={11} className="text-blue-300" />
      : <ArrowDown size={11} className="text-blue-300" />;
  }

  const cols: [SortKey | "", string, string][] = [
    ["name", "Resource", ""],
    ["type", "Type", "hidden sm:table-cell"],
    ["", "SKU", "hidden md:table-cell"],
    ["", "Region", "hidden xl:table-cell"],
    ["cpuAvg", "CPU", ""],
    ["memoryAvg", "Memory", "hidden sm:table-cell"],
    ["status", "Status", ""],
    ["recommendation", "Action", "hidden sm:table-cell"],
  ];

  return (
    <div className="surface rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b divider">
        <div className="flex items-center gap-3">
          <h2 className="text-heading text-white">Resources</h2>
          <span className="text-[12px] text-white/40 tnum font-mono px-1.5 py-0.5 rounded bg-white/[0.04]">
            {filtered.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Filter resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base rounded-md pl-7 pr-3 py-1.5 text-[12px] w-44 lg:w-56"
            />
          </div>
          <div className="relative">
            <Filter size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ResourceType | "all")}
              className="input-base rounded-md pl-7 pr-7 py-1.5 text-[12px] appearance-none cursor-pointer min-w-[7rem]"
            >
              <option value="all" className="bg-[#14181f]">All types</option>
              {types.map((t) => (
                <option key={t} value={t} className="bg-[#14181f]">{resourceTypeLabel(t)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b divider bg-white/[0.015]">
              {cols.map(([k, label, extra]) => (
                <th
                  key={label}
                  className={`text-overline text-left px-4 py-2.5 font-medium select-none ${extra} ${k ? "cursor-pointer hover:text-white/60 transition-colors" : ""}`}
                  onClick={() => k && toggleSort(k)}
                >
                  <span className="flex items-center gap-1.5">
                    {label}
                    {k && <SortIcon k={k} />}
                  </span>
                </th>
              ))}
              <th className="w-8 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                onClick={() => onSelect(r)}
                className={`border-b divider cursor-pointer transition-colors group ${
                  selectedId === r.id
                    ? "bg-blue-500/[0.06]"
                    : "hover-row"
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white tracking-tight">{r.name}</span>
                    <span className="text-[11px] text-white/35 font-mono mt-0.5">{r.resourceGroup}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-white/55">
                    <span className="text-white/40"><ResourceTypeIcon type={r.type} size={13} /></span>
                    {resourceTypeLabel(r.type)}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-mono text-[11px] text-white/55 bg-white/[0.04] border divider rounded px-1.5 py-0.5">{r.sku}</span>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell text-[12px] text-white/45">{r.location}</td>
                <td className="px-4 py-3 w-36">
                  <MetricBar value={r.metrics.cpuAvg} />
                </td>
                <td className="px-4 py-3 w-36 hidden sm:table-cell">
                  <MetricBar value={r.metrics.memoryAvg} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={r.status} variant="status" />
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <StatusBadge value={r.recommendation} variant="recommendation" />
                </td>
                <td className="px-2 py-3">
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu
                      trigger={
                        <button className="opacity-30 group-hover:opacity-100 p-1 rounded text-white/55 hover:text-white hover:bg-white/[0.06] transition-all">
                          <MoreHorizontal size={13} />
                        </button>
                      }
                      items={rowActions(r)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30 text-[13px]">No resources match the current filter</div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t divider flex items-center justify-between text-[11px] text-white/35">
        <span>Showing {filtered.length} of {resources.length}</span>
        <span className="font-mono">Updated 12s ago</span>
      </div>

      {/* Confirm modal */}
      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={
          confirmAction?.kind === "restart" ? "Restart resource?" :
          confirmAction?.kind === "scale-up" ? "Scale up resource?" :
          confirmAction?.kind === "scale-down" ? "Scale down resource?" :
          "Delete resource?"
        }
        subtitle={confirmAction ? `${confirmAction.resource.name} · ${resourceTypeLabel(confirmAction.resource.type)}` : ""}
        footer={
          <>
            <button onClick={() => setConfirmAction(null)} className="btn-secondary rounded-md px-3 py-1.5 text-[13px] font-medium">
              Cancel
            </button>
            <button
              onClick={executeAction}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                confirmAction?.kind === "delete"
                  ? "bg-red-500 hover:bg-red-600 text-white border border-red-500"
                  : "btn-gold rounded-md"
              }`}
            >
              {confirmAction?.kind === "restart" ? "Restart" :
               confirmAction?.kind === "scale-up" ? "Scale up" :
               confirmAction?.kind === "scale-down" ? "Scale down" :
               "Delete"}
            </button>
          </>
        }
      >
        {confirmAction && (
          <div className="space-y-3">
            <p className="text-[13px] text-white/70 leading-relaxed">
              {confirmAction.kind === "restart" && "This will restart the resource. Service may be unavailable for up to 30 seconds."}
              {confirmAction.kind === "scale-up" && `Scale ${confirmAction.resource.name} from ${confirmAction.resource.sku} to the next tier. This will affect billing.`}
              {confirmAction.kind === "scale-down" && `Scale ${confirmAction.resource.name} from ${confirmAction.resource.sku} to a smaller tier. Verify capacity requirements first.`}
              {confirmAction.kind === "delete" && "This action is permanent and cannot be undone. All associated data will be lost."}
            </p>
            <div className="surface-elevated rounded-md p-3 text-[12px] font-mono text-white/55 break-all">
              {confirmAction.resource.id}
            </div>
            {confirmAction.kind === "delete" && (
              <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-500/10 border border-red-500/20">
                <span className="text-red-300 text-[11px] font-mono leading-relaxed">
                  ⚠ Resource group <b>{confirmAction.resource.resourceGroup}</b> in <b>{confirmAction.resource.location}</b>
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
