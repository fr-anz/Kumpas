"use client";

import { forwardRef } from "react";
import { Camera } from "lucide-react";

type CameraPreviewProps = {
  active: boolean;
  error: string | null;
};

/** Video preview surface for the camera demo. */
export const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps>(
  function CameraPreview({ active, error }, ref) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-card border border-border bg-bee-ink shadow-[var(--shadow)]">
        <video
          ref={ref}
          playsInline
          muted
          className={`h-full w-full object-cover ${active ? "" : "hidden"}`}
        />
        {!active && (
          <div className="hex-pattern absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <Camera aria-hidden="true" className="h-12 w-12 text-text-muted" />
            <p className="text-sm font-semibold text-text-muted">
              {error ?? "Camera is off. Press Start to begin the demo."}
            </p>
          </div>
        )}
      </div>
    );
  },
);
