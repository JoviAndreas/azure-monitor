"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

export function Modal({ open, onClose, title, subtitle, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="backdrop-enter absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        className={`modal-enter relative ${sizeMap[size]} w-full surface-elevated rounded-xl shadow-2xl overflow-hidden`}
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
      >
        <div className="px-5 py-4 border-b divider flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-[12px] text-white/45 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors -mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t divider bg-white/[0.015] flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
