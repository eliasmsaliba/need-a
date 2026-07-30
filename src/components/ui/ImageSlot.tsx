"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface ImageSlotProps {
  placeholder: string;
  shape?: "circle" | "rounded";
  className?: string;
}

// Real file picker + local preview, replacing the prototype's `image-slot` placeholder.
// Not uploaded to persistent storage yet — see repo README follow-up note.
export function ImageSlot({ placeholder, shape = "rounded", className }: ImageSlotProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={cn(
        "flex items-center justify-center border border-dashed border-neutral-700 bg-surface text-neutral-400 text-xs cursor-pointer overflow-hidden text-center px-2",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className,
      )}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a remote image
        <img src={preview} alt="" className="w-full h-full object-cover" />
      ) : (
        placeholder
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}
