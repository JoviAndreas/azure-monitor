"use client";
import { useEffect, useRef, useState } from "react";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "primary";
  shortcut?: string;
  divider?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

const variantCls = {
  default: "text-white/75 hover:text-white hover:bg-white/[0.05]",
  danger: "text-red-300 hover:bg-red-500/10",
  primary: "text-blue-300 hover:bg-blue-500/10",
};

export function DropdownMenu({ trigger, items, align = "right" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>{trigger}</div>
      {open && (
        <div
          className={`dropdown-enter absolute top-full mt-1 ${align === "right" ? "right-0" : "left-0"} z-50 min-w-[200px] surface-elevated rounded-lg shadow-2xl overflow-hidden p-1`}
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="h-px bg-white/[0.06] my-1" />
            ) : (
              <button
                key={i}
                onClick={() => { item.onClick(); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-md text-[13px] text-left transition-colors ${variantCls[item.variant ?? "default"]}`}
              >
                <span className="flex items-center gap-2">
                  {item.icon && <span className="w-3.5 h-3.5 inline-flex items-center justify-center">{item.icon}</span>}
                  {item.label}
                </span>
                {item.shortcut && <span className="text-[10px] font-mono text-white/30">{item.shortcut}</span>}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
