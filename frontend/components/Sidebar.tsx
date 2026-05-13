"use client";
import { LayoutGrid, Server, BellRing, Activity, Settings, BookOpen, FileText, ChevronsLeft, GraduationCap, Bot } from "lucide-react";
import { useLayout } from "@/lib/layout-state";
import { useToast } from "@/lib/toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navMain = [
  { icon: LayoutGrid, label: "Overview", href: "/" },
  { icon: Server, label: "Resources", count: 10, href: "/" },
  { icon: Bot, label: "Agents", href: "/agents", count: 5 },
  { icon: Activity, label: "Metrics", href: null },
  { icon: BellRing, label: "Alerts", count: 0, href: null },
];

const navSecondary = [
  { icon: FileText, label: "Reports", href: null },
  { icon: BookOpen, label: "Documentation", href: null },
  { icon: Settings, label: "Settings", href: null },
];

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  count?: number;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  href?: string | null;
}

function NavItem({ icon: Icon, label, count, active, collapsed, onClick, href }: NavItemProps) {
  const body = (
    <>
      <Icon size={15} className={active ? "text-amber-400" : "text-white/45 group-hover:text-white/75"} />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {typeof count === "number" && count > 0 && (
            <span className="text-[10px] text-amber-200 bg-amber-500/15 border border-amber-500/25 rounded-full px-1.5 py-px font-medium tnum">{count}</span>
          )}
        </>
      )}
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-amber-400" />}
    </>
  );

  const cls = `group relative w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
    active
      ? "bg-white/[0.06] text-white"
      : "text-white/55 hover:text-white hover:bg-white/[0.03]"
  }`;

  if (href) {
    return <Link href={href} className={cls}>{body}</Link>;
  }
  return <button onClick={onClick} className={cls}>{body}</button>;
}

export function Sidebar() {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useLayout();
  const { push } = useToast();
  const pathname = usePathname();
  const [peek, setPeek] = useState(false);
  const notImpl = (label: string) => push({ kind: "info", title: `${label}`, message: "Coming soon — wire collector first." });

  // Reveal on mouse near left edge
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (collapsed) setPeek(e.clientX < 12);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [collapsed]);

  const effective = !collapsed || peek;
  const width = effective ? "w-56" : "w-14";

  return (
    <aside className={`${width} flex-shrink-0 surface border-r border-t-0 border-b-0 border-l-0 flex flex-col h-screen sticky top-0 transition-all duration-300 ${peek ? "shadow-2xl shadow-black/40 z-50" : ""}`}>
      {/* Brand */}
      <div className="h-14 flex items-center gap-2.5 px-3 border-b divider bg-binus-gradient">
        <div className="w-7 h-7 rounded-md bg-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
          <GraduationCap size={14} className="text-blue-900" strokeWidth={2.5} />
        </div>
        {effective && (
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-white">Binus Cloud</span>
            <span className="text-[10px] text-amber-200/80 font-medium">Monitor v0.1.0</span>
          </div>
        )}
      </div>

      {/* Workspace switcher */}
      {effective && (
        <div className="p-2 border-b divider">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors">
            <div className="w-5 h-5 rounded bg-emerald-500/15 flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-300">P</span>
            </div>
            <span className="text-[13px] text-white/85 font-medium flex-1 text-left">Production</span>
            <span className="text-[10px] text-white/30 font-mono">sub1</span>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {effective && <p className="text-overline px-2 mb-1.5">Workspace</p>}
        {navMain.map((item) => {
          const active = item.href ? pathname === item.href : false;
          return (
            <NavItem
              key={item.label}
              {...item}
              active={active}
              collapsed={!effective}
              onClick={() => !item.href && notImpl(item.label)}
            />
          );
        })}

        {effective && <p className="text-overline px-2 mb-1.5 mt-5">System</p>}
        <div className={!effective ? "mt-3" : ""}>
          {navSecondary.map((item) => (
            <NavItem key={item.label} {...item} collapsed={!effective} onClick={() => notImpl(item.label)} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t divider flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
        >
          <ChevronsLeft size={14} className={`transition-transform ${!effective ? "rotate-180" : ""}`} />
        </button>
        {effective && (
          <div className="flex items-center gap-2 flex-1 px-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex-shrink-0 flex items-center justify-center text-[10px] font-semibold text-white">J</div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white/85 font-medium truncate">jovi@org</p>
              <p className="text-[10px] text-white/35 truncate">Admin</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
