"use client";

import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-neutral-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] max-h-[85vh] overflow-y-auto flex flex-col gap-4 p-5 rounded-lg bg-surface shadow-[var(--shadow-glow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xl font-semibold tracking-tight">{title}</span>
        {children}
      </div>
    </div>
  );
}
