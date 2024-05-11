// Declare this at the top of your file or in a global types file
interface WakeLockSentinel extends EventTarget {
  release(): Promise<void>;
}

// Now TypeScript knows what a WakeLockSentinel is
