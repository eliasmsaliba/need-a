import { cn } from "@/lib/cn";

interface ChipToggleProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function ChipToggle({ label, active, onToggle }: ChipToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "cursor-pointer py-1.5 px-3 rounded-full text-[12.5px] border",
        active
          ? "border-accent-500 bg-neutral-800 text-accent-200"
          : "border-neutral-700 text-neutral-300",
      )}
    >
      {label}
    </button>
  );
}
