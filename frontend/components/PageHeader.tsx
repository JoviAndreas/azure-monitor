"use client";
import { RefreshCw, Download, MoreHorizontal, FileJson, FileSpreadsheet, Settings2, Trash2 } from "lucide-react";
import { useToast } from "@/lib/toast";
import { DropdownMenu } from "./DropdownMenu";

export function PageHeader() {
  const { push, dismiss } = useToast();

  function handleRefresh() {
    const id = push({ kind: "loading", title: "Syncing Azure resources...", message: "Fetching latest metrics" });
    setTimeout(() => {
      dismiss(id);
      push({ kind: "success", title: "Synced 10 resources", message: "All metrics up to date" });
    }, 1600);
  }

  function handleExport(format: string) {
    push({ kind: "info", title: `Exporting as ${format}...`, message: "Download will start shortly" });
    setTimeout(() => push({ kind: "success", title: `Downloaded resources.${format.toLowerCase()}` }), 1200);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <h1 className="text-display text-white">Overview</h1>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="dot dot-pulse bg-emerald-400"></span>
            Live
          </span>
        </div>
        <p className="text-body text-white/45">
          Monitoring 10 resources across 4 resource groups · Last synced 12s ago
        </p>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu
          trigger={
            <button className="btn-secondary rounded-md px-3 py-1.5 text-[13px] font-medium flex items-center gap-1.5">
              <Download size={13} />
              Export
            </button>
          }
          items={[
            { label: "Export as JSON", icon: <FileJson size={13} />, onClick: () => handleExport("JSON") },
            { label: "Export as CSV", icon: <FileSpreadsheet size={13} />, onClick: () => handleExport("CSV") },
            { label: "Export as XLSX", icon: <FileSpreadsheet size={13} />, onClick: () => handleExport("XLSX") },
          ]}
        />
        <button onClick={handleRefresh} className="btn-secondary rounded-md px-3 py-1.5 text-[13px] font-medium flex items-center gap-1.5">
          <RefreshCw size={13} />
          Refresh
        </button>
        <DropdownMenu
          trigger={
            <button className="btn-secondary rounded-md p-1.5">
              <MoreHorizontal size={14} />
            </button>
          }
          items={[
            { label: "Configure view", icon: <Settings2 size={13} />, shortcut: "⌘,", onClick: () => push({ kind: "info", title: "Settings", message: "Configure view options" }) },
            { divider: true, label: "", onClick: () => {} },
            { label: "Clear all filters", icon: <Trash2 size={13} />, variant: "danger", onClick: () => push({ kind: "success", title: "Filters cleared" }) },
          ]}
        />
      </div>
    </div>
  );
}
