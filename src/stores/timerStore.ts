import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimerState {
  /** Seconds remaining on the current timer. */
  seconds: number;
  /** Total duration the timer was started with. */
  totalSeconds: number;
  /** Whether the timer is actively counting down. */
  isRunning: boolean;

  /**
   * Begin a countdown of `duration` seconds.
   * Sets both `seconds` and `totalSeconds`, and marks isRunning = true.
   * The actual interval that calls `tick()` must live in a component useEffect.
   */
  startTimer: (duration: number) => void;

  /**
   * Decrement the remaining seconds by 1.
   * Automatically stops the timer when it reaches 0.
   */
  tick: () => void;

  /** Stop the timer and reset seconds back to 0. */
  stopTimer: () => void;

  /** Full reset — clears seconds, totalSeconds, and isRunning. */
  resetTimer: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTimerStore = create<TimerState>()((set) => ({
  seconds: 0,
  totalSeconds: 0,
  isRunning: false,

  startTimer: (duration: number) => {
    set({
      seconds: duration,
      totalSeconds: duration,
      isRunning: true,
    });
  },

  tick: () => {
    set((state) => {
      if (!state.isRunning) return state;

      const next = state.seconds - 1;
      if (next <= 0) {
        return { seconds: 0, isRunning: false };
      }
      return { seconds: next };
    });
  },

  stopTimer: () => {
    set({ seconds: 0, isRunning: false });
  },

  resetTimer: () => {
    set({ seconds: 0, totalSeconds: 0, isRunning: false });
  },
}));
