"use client";
import { Search, Bell, HelpCircle, ChevronRight, PanelLeft, Sun, Moon, BookOpen, MessageCircle, Code2, Keyboard, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useLayout } from "@/lib/layout-state";
import { useToast } from "@/lib/toast";
import { DropdownMenu } from "./DropdownMenu";

export function TopBar() {
  const { theme, toggle } = useTheme();
  const { toggleSidebar } = useLayout();
  const { push } = useToast();

  return (
    <header className="h-14 sticky top-0 z-30 surface-overlay border-l-0 border-r-0 border-t-0 px-3 sm:px-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="btn-secondary rounded-md p-1.5"
          title="Toggle sidebar"
        >
          <PanelLeft size={14} />
        </button>
        <nav className="flex items-center gap-1.5 text-[13px] ml-1">
          <span className="text-white/40">Production</span>
          <ChevronRight size={12} className="text-white/20" />
          <span className="text-white/85 font-medium">Overview</span>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search resources, metrics..."
            onFocus={() => push({ kind: "info", title: "Command Palette", message: "Full search coming soon" })}
            className="input-base rounded-md pl-8 pr-12 py-1.5 text-[13px] w-72"
          />
          <span className="kbd absolute right-2 top-1/2 -translate-y-1/2">⌘K</span>
        </div>
        <button
          onClick={() => {
            toggle();
            push({ kind: "success", title: `Switched to ${theme === "dark" ? "light" : "dark"} mode` });
          }}
          className="btn-secondary rounded-md p-1.5"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <DropdownMenu
          trigger={
            <button className="btn-secondary rounded-md p-1.5"><HelpCircle size={14} /></button>
          }
          items={[
            { label: "Documentation", icon: <BookOpen size={13} />, onClick: () => push({ kind: "info", title: "Opening docs..." }) },
            { label: "Keyboard shortcuts", icon: <Keyboard size={13} />, shortcut: "?", onClick: () => push({ kind: "info", title: "Shortcuts", message: "⌘K · search   ⌘B · toggle sidebar" }) },
            { label: "Send feedback", icon: <MessageCircle size={13} />, onClick: () => push({ kind: "success", title: "Thanks!", message: "Feedback channel opened" }) },
            { divider: true, label: "", onClick: () => {} },
            { label: "GitHub", icon: <Code2 size={13} />, onClick: () => push({ kind: "info", title: "Opening GitHub..." }) },
          ]}
        />
        <DropdownMenu
          trigger={
            <button className="btn-secondary rounded-md p-1.5 relative">
              <Bell size={14} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </button>
          }
          items={[
            { label: "prod-app-plan: CPU 98%", icon: <AlertTriangle size={13} className="text-red-300" />, onClick: () => push({ kind: "error", title: "Critical: prod-app-plan", message: "CPU sustained at 98% for 1h" }) },
            { label: "api-service: Memory high", icon: <TrendingUp size={13} className="text-amber-300" />, onClick: () => push({ kind: "info", title: "Warning: api-service", message: "Memory trending up over 24h" }) },
            { label: "Sync completed", icon: <CheckCircle2 size={13} className="text-emerald-300" />, onClick: () => push({ kind: "success", title: "Last sync OK" }) },
            { divider: true, label: "", onClick: () => {} },
            { label: "Mark all as read", onClick: () => push({ kind: "success", title: "Notifications cleared" }) },
          ]}
        />
      </div>
    </header>
  );
}
