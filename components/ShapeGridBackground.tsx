"use client";

import ShapeGrid from "./ShapeGrid";
import { useBatterySaver } from "./BatterySaverProvider";

/**
 * Fixed, full-viewport honeycomb background using the React Bits ShapeGrid.
 * Sits behind all app content (the app shell is layered above via z-index).
 *
 * When battery optimization is on, the grid is frozen to a single static frame
 * (no requestAnimationFrame loop), eliminating continuous canvas work.
 */
export function ShapeGridBackground() {
  const { batterySaver } = useBatterySaver();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    >
      <ShapeGrid
        speed={0}
        squareSize={100}
        direction="up"
        borderColor="#f9c800"
        hoverFillColor="#222"
        shape="hexagon"
        hoverTrailAmount={0}
        frozen={batterySaver}
      />
    </div>
  );
}
