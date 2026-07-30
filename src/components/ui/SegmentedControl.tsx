import { cn } from "@/lib/cn";

interface SegmentedControlProps<T extends string> {
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  name,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex overflow-hidden border border-divider rounded-md",
        className,
      )}
    >
      {options.map((opt) => {
        const checked = opt.value === value;
        return (
          <label
            key={opt.value}
            className={cn(
              "inline-flex items-center gap-1.5 py-[7px] px-3 text-[13px] cursor-pointer",
              "not-first:border-l not-first:border-divider",
              "has-focus-visible:outline-2 has-focus-visible:outline-accent has-focus-visible:-outline-offset-2",
              checked
                ? "text-accent shadow-[inset_0_0_0_1px_var(--color-accent)]"
                : "hover:bg-text/7",
            )}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={checked}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}
