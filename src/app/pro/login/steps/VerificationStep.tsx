import { ImageSlot } from "@/components/ui/ImageSlot";
import type { ProviderAuthFlow } from "../useProviderAuthFlow";

export function VerificationStep({ flow }: { flow: ProviderAuthFlow }) {
  const { state, patch } = flow;

  function setPortfolioSlot(index: number, url: string) {
    const next = [...state.portfolioUrls];
    next[index] = url;
    patch({ portfolioUrls: next });
  }

  return (
    <>
      <h2 className="text-[22px] font-medium">Verification &amp; portfolio</h2>
      <p className="text-[13px] text-neutral-400">
        ID verification unlocks the &quot;Verified&quot; badge on your profile.
      </p>
      <div className="flex gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-neutral-400">ID / passport</span>
          <ImageSlot
            placeholder="Upload ID document"
            className="w-[200px] h-[130px]"
            userId={state.userId!}
            kind="id-document"
            onUploaded={(url) => patch({ idDocumentUrl: url })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-neutral-400">Certification (optional)</span>
          <ImageSlot
            placeholder="Upload certificate"
            className="w-[200px] h-[130px]"
            userId={state.userId!}
            kind="certification"
            onUploaded={(url) => patch({ certificationUrl: url })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-text/70">Portfolio photos (optional)</span>
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <ImageSlot
              key={i}
              placeholder="Work photo"
              className="w-[120px] h-[120px]"
              userId={state.userId!}
              kind="portfolio"
              onUploaded={(url) => setPortfolioSlot(i, url)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
