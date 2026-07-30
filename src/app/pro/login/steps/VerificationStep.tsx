import { ImageSlot } from "@/components/ui/ImageSlot";

export function VerificationStep() {
  return (
    <>
      <h2 className="text-[22px] font-medium">Verification &amp; portfolio</h2>
      <p className="text-[13px] text-neutral-400">
        ID verification unlocks the &quot;Verified&quot; badge on your profile.
      </p>
      <div className="flex gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-neutral-400">ID / passport</span>
          <ImageSlot placeholder="Upload ID document" className="w-[200px] h-[130px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-neutral-400">Certification (optional)</span>
          <ImageSlot placeholder="Upload certificate" className="w-[200px] h-[130px]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-text/70">Portfolio photos (optional)</span>
        <div className="flex gap-3">
          <ImageSlot placeholder="Work photo" className="w-[120px] h-[120px]" />
          <ImageSlot placeholder="Work photo" className="w-[120px] h-[120px]" />
          <ImageSlot placeholder="Work photo" className="w-[120px] h-[120px]" />
        </div>
      </div>
    </>
  );
}
