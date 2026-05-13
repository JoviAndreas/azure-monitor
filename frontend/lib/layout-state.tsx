"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface LayoutCtx {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

const Ctx = createContext<LayoutCtx>({ sidebarCollapsed: false, toggleSidebar: () => {}, setSidebarCollapsed: () => {} });

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored) setCollapsed(stored === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <Ctx.Provider value={{ sidebarCollapsed: collapsed, toggleSidebar: () => setCollapsed((c) => !c), setSidebarCollapsed: setCollapsed }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLayout = () => useContext(Ctx);
