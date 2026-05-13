"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X, Loader2 } from "lucide-react";

type ToastKind = "success" | "error" | "info" | "loading";

interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

interface ToastCtx {
  push: (t: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
}

const Ctx = createContext<ToastCtx>({ push: () => 0, dismiss: () => {} });
export const useToast = () => useContext(Ctx);

const iconMap = {
  success: <CheckCircle2 size={16} className="text-emerald-300" />,
  error: <AlertTriangle size={16} className="text-red-300" />,
  info: <Info size={16} className="text-blue-300" />,
  loading: <Loader2 size={16} className="text-amber-300 animate-spin" />,
};

const ringMap: Record<ToastKind, string> = {
  success: "border-emerald-500/30",
  error: "border-red-500/30",
  info: "border-blue-500/30",
  loading: "border-amber-500/30",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((s) => s.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { ...t, id }]);
    if (t.kind !== "loading") {
      setTimeout(() => dismiss(id), 3500);
    }
    return id;
  }, [dismiss]);

  return (
    <Ctx.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm">
        {items.map((t) => (
          <div
            key={t.id}
            className={`toast-enter surface-elevated rounded-lg border-l-2 ${ringMap[t.kind]} p-3 shadow-2xl flex items-start gap-3 min-w-[280px]`}
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
          >
            <div className="mt-0.5">{iconMap[t.kind]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white">{t.title}</p>
              {t.message && <p className="text-[12px] text-white/55 mt-0.5">{t.message}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-white/30 hover:text-white/80 transition-colors p-0.5 -mt-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
