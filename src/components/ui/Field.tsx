import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs mb-[5px] text-text/70">{label}</label>
      {children}
    </div>
  );
}
