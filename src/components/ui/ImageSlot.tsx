"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { cn } from "@/lib/cn";

export type ImageSlotKind = "avatar" | "id-document" | "certification" | "portfolio";

interface ImageSlotProps {
  placeholder: string;
  shape?: "circle" | "rounded";
  className?: string;
  userId: string;
  kind: ImageSlotKind;
  onUploaded: (url: string) => void;
}

const ACCEPT: Record<ImageSlotKind, string> = {
  avatar: "image/jpeg,image/png,image/webp",
  portfolio: "image/jpeg,image/png,image/webp",
  "id-document": "image/jpeg,image/png,image/webp,application/pdf",
  certification: "image/jpeg,image/png,image/webp,application/pdf",
};

const MAX_SIZE_BYTES = 8 * 1024 * 1024;

// Real file picker + upload, replacing the prototype's `image-slot` placeholder.
// Uploads directly to Vercel Blob from the client (see src/app/api/upload/route.ts
// for the token-issuing side) rather than routing bytes through a server action.
export function ImageSlot({ placeholder, shape = "rounded", className, userId, kind, onUploaded }: ImageSlotProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_SIZE_BYTES) {
      setError("File is too large (max 8MB).");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({ userId, kind }),
      });
      onUploaded(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "relative flex items-center justify-center border border-dashed border-neutral-700 bg-surface text-neutral-400 text-xs cursor-pointer overflow-hidden text-center px-2",
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
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/60 text-[11px] text-text">
            Uploading…
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT[kind]}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && <span className="text-[11px] text-accent-300">{error}</span>}
    </div>
  );
}
