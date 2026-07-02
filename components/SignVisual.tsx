"use client";

import { useEffect, useState } from "react";

/**
 * Sign-language visual for a phrase, prioritizing FSL and falling back to ASL.
 *
 * Convention (no per-phrase config needed): drop image files named by the
 * phrase id into:
 *   public/signs/fsl/<phraseId>.<ext>   ← preferred (Filipino Sign Language)
 *   public/signs/asl/<phraseId>.<ext>   ← fallback (American Sign Language)
 *
 * Resolution order per phrase:
 *   1. Explicit fslUrl prop (if provided in phrase data)
 *   2. Explicit aslUrl prop
 *   3. FSL by convention (png/webp/jpg/gif)
 *   4. ASL by convention
 *   5. Placeholder (handled by the caller when `onUnavailable` fires)
 *
 * All images are local files, so this stays fully offline.
 */

const EXTENSIONS = ["webp", "png", "jpg", "gif"] as const;

type Variant = "FSL" | "ASL";

type Candidate = { src: string; variant: Variant };

function buildCandidates(
  phraseId: string,
  fslUrl?: string,
  aslUrl?: string,
): Candidate[] {
  const candidates: Candidate[] = [];
  if (fslUrl) candidates.push({ src: fslUrl, variant: "FSL" });
  if (aslUrl) candidates.push({ src: aslUrl, variant: "ASL" });
  // Convention-based: FSL first (all extensions), then ASL.
  for (const ext of EXTENSIONS) {
    candidates.push({ src: `/signs/fsl/${phraseId}.${ext}`, variant: "FSL" });
  }
  for (const ext of EXTENSIONS) {
    candidates.push({ src: `/signs/asl/${phraseId}.${ext}`, variant: "ASL" });
  }
  return candidates;
}

type SignVisualProps = {
  phraseId: string;
  alt: string;
  fslUrl?: string;
  aslUrl?: string;
  fslLabel: string;
  aslLabel: string;
  /** Rendered when no FSL or ASL image can be loaded. */
  fallback: React.ReactNode;
};

export function SignVisual({
  phraseId,
  alt,
  fslUrl,
  aslUrl,
  fslLabel,
  aslLabel,
  fallback,
}: SignVisualProps) {
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  const candidates = buildCandidates(phraseId, fslUrl, aslUrl);

  // Reset the search when the phrase changes.
  useEffect(() => {
    setIndex(0);
    setExhausted(false);
  }, [phraseId]);

  if (exhausted || candidates.length === 0) {
    return <>{fallback}</>;
  }

  const current = candidates[index];

  return (
    <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-surface shadow-[var(--shadow)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, local images, need onError fallback chain */}
      <img
        key={current.src}
        src={current.src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => {
          if (index < candidates.length - 1) {
            setIndex(index + 1);
          } else {
            setExhausted(true);
          }
        }}
      />
      <figcaption className="absolute left-2 top-2 rounded-pill bg-bee-black/80 px-2.5 py-1 text-xs font-bold text-bee-yellow">
        {current.variant === "FSL" ? fslLabel : aslLabel}
      </figcaption>
    </figure>
  );
}
