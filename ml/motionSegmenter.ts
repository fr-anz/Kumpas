export type SegmentEvent = {
  state: "idle" | "recording" | "complete";
  motion: number;
  started?: boolean;
  completed?: boolean;
  startTime?: number;
  endTime?: number;
};

export function activityMotion(
  previous: Float32Array | null,
  current: Float32Array,
): number {
  if (!previous) return 0;
  if (previous.length !== 130 || current.length !== 130) {
    throw new Error("Activity arrays must contain two 65-value hand slots.");
  }

  let maximum = 0;
  for (let slot = 0; slot < 2; slot++) {
    const offset = slot * 65;
    const previousPresent = Number.isFinite(previous[offset]);
    const currentPresent = Number.isFinite(current[offset]);
    if (previousPresent !== currentPresent) {
      maximum = Math.max(maximum, 0.1);
      continue;
    }
    if (!currentPresent) continue;

    const wristMotion = Math.hypot(
      current[offset] - previous[offset],
      current[offset + 1] - previous[offset + 1],
    );
    let shapeMotion = 0;
    for (let landmark = 0; landmark < 21; landmark++) {
      const index = offset + 2 + landmark * 3;
      shapeMotion += Math.hypot(
        current[index] - previous[index],
        current[index + 1] - previous[index + 1],
        current[index + 2] - previous[index + 2],
      );
    }
    maximum = Math.max(maximum, 2 * wristMotion + 0.25 * (shapeMotion / 21));
  }
  return maximum;
}

type SegmenterOptions = {
  startThreshold: number;
  stopThreshold: number;
  startFrames: number;
  endHoldMs: number;
  minimumSignMs: number;
  maximumSignMs: number;
  smoothing: number;
};

export class MotionSegmenter {
  private state: "idle" | "recording" = "idle";
  private smoothedMotion = 0;
  private activeFrames = 0;
  private candidateStartTime: number | null = null;
  private recordingStartTime: number | null = null;
  private stableStartTime: number | null = null;

  constructor(private readonly options: SegmenterOptions) {}

  reset(): void {
    this.state = "idle";
    this.smoothedMotion = 0;
    this.activeFrames = 0;
    this.candidateStartTime = null;
    this.recordingStartTime = null;
    this.stableStartTime = null;
  }

  update(motion: number, hasHands: boolean, timestamp: number): SegmentEvent {
    const options = this.options;
    this.smoothedMotion =
      options.smoothing * Math.max(0, motion) +
      (1 - options.smoothing) * this.smoothedMotion;

    if (this.state === "idle") {
      if (hasHands && this.smoothedMotion >= options.startThreshold) {
        if (this.activeFrames === 0) this.candidateStartTime = timestamp;
        this.activeFrames += 1;
      } else {
        this.activeFrames = 0;
        this.candidateStartTime = null;
      }
      if (this.activeFrames < options.startFrames) {
        return { state: "idle", motion: this.smoothedMotion };
      }

      this.state = "recording";
      this.recordingStartTime = this.candidateStartTime ?? timestamp;
      return {
        state: "recording",
        motion: this.smoothedMotion,
        started: true,
        startTime: this.recordingStartTime,
      };
    }

    const startTime = this.recordingStartTime as number;
    const elapsed = timestamp - startTime;
    const stable = !hasHands || this.smoothedMotion <= options.stopThreshold;
    if (stable) this.stableStartTime ??= timestamp;
    else this.stableStartTime = null;

    let endTime: number | null = null;
    if (elapsed >= options.maximumSignMs) endTime = timestamp;
    else if (
      elapsed >= options.minimumSignMs &&
      this.stableStartTime !== null &&
      timestamp - this.stableStartTime >= options.endHoldMs
    ) {
      endTime = this.stableStartTime;
    }

    if (endTime === null) {
      return { state: "recording", motion: this.smoothedMotion, startTime };
    }
    const event: SegmentEvent = {
      state: "complete",
      motion: this.smoothedMotion,
      completed: true,
      startTime,
      endTime,
    };
    this.reset();
    return event;
  }
}
