import { Suspense } from "react";
import { LibraryView } from "./LibraryView";

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <p className="text-text-muted">Loading…</p>
      }
    >
      <LibraryView />
    </Suspense>
  );
}
