"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer, ScrollToPlugin);
}

interface UseControlledScrollOptions {
  enabled: boolean;
  menuOpen: boolean;
  prefersReducedMotion: boolean;
  getMilestones: () => number[];
}

const INTERACTIVE_BYPASS_SELECTOR =
  '[role="dialog"], [data-interactive-panel], [role="slider"], button, a, input, select, textarea';

/**
 * Picks the next or previous guided milestone strictly relative to `anchorY`
 * using a 28px boundary tolerance so subpixel rounding never locks on the current stop.
 */
function resolveStepMilestone(
  anchorY: number,
  direction: 1 | -1,
  milestones: number[]
): number | null {
  if (milestones.length === 0) return null;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const sorted = Array.from(
    new Set(
      milestones
        .map((y) => Math.max(0, Math.min(maxScroll, Math.round(y))))
        .sort((a, b) => a - b)
    )
  );
  if (sorted.length === 0) return null;

  const tolerance = 28;
  if (direction > 0) {
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] > anchorY + tolerance) return sorted[i];
    }
    return sorted[sorted.length - 1];
  } else {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i] < anchorY - tolerance) return sorted[i];
    }
    return sorted[0];
  }
}

/**
 * Guided Storytelling Scroll Controller
 *
 * Desktop wheel / trackpad:
 *   - Uses a scoped GSAP Observer (`type: "wheel"`) to advance AT MOST ONE
 *     story milestone per deliberate gesture or rapid wheel burst.
 *   - Absorbs trackpad kinetic inertia tails without queuing multi-chapter skips.
 *   - Supports clean reverse-scrolling both after settling and on strong
 *     deliberate direction reversals.
 *
 * Mobile touch:
 *   - Preserves natural 1:1 vertical dragging during `touchmove` (never blocks).
 *   - On `touchend`, caps native fling momentum to AT MOST +/-1 milestone
 *     relative to `touchStartScrollY` with immediate `touchstart` interruptibility.
 *
 * Accessibility & Direct Navigation:
 *   - Completely disabled under `prefers-reduced-motion: reduce`.
 *   - Never blocks menu jumps, scrollbar dragging, dialogs, or interactive sliders.
 */
export function useControlledScroll({
  enabled,
  menuOpen,
  prefersReducedMotion,
  getMilestones,
}: UseControlledScrollOptions) {
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  const prefersReducedRef = useRef(prefersReducedMotion);
  prefersReducedRef.current = prefersReducedMotion;

  const getMilestonesRef = useRef(getMilestones);
  getMilestonesRef.current = getMilestones;

  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false);
  const activeDirRef = useRef<1 | -1 | 0>(0);
  const tweenStartTimeRef = useRef(0);
  const lockUntilRef = useRef(0);

  // Trackpad inertia detection state
  const lastWheelTimeRef = useRef(0);
  const lastWheelDirRef = useRef<1 | -1 | 0>(0);
  const prevWheelAbsRef = useRef(0);

  const killActiveTween = useCallback(() => {
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
      activeTweenRef.current = null;
    }
    isAnimatingRef.current = false;
    activeDirRef.current = 0;
  }, []);

  /**
   * Direct programmatic jump used by Editorial Index navigation & Atlas buttons.
   * Clears any wheel/touch tween cleanly so intentional navigation always wins.
   */
  const navigateToY = useCallback(
    (targetY: number, options?: { immediate?: boolean; duration?: number }) => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const clampedY = Math.max(0, Math.min(maxScroll, Math.round(targetY)));

      killActiveTween();

      if (prefersReducedRef.current || options?.immediate) {
        lockUntilRef.current = performance.now() + 120;
        window.scrollTo({ top: clampedY, behavior: "auto" });
        return;
      }

      const dist = Math.abs(clampedY - window.scrollY);
      if (dist < 4) return;

      const dur = options?.duration ?? Math.min(0.88, Math.max(0.45, dist / 2400));
      isAnimatingRef.current = true;
      tweenStartTimeRef.current = performance.now();
      lockUntilRef.current = tweenStartTimeRef.current + dur * 1000 + 120;

      activeTweenRef.current = gsap.to(window, {
        scrollTo: { y: clampedY, autoKill: false },
        duration: dur,
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: () => {
          isAnimatingRef.current = false;
          activeDirRef.current = 0;
          activeTweenRef.current = null;
          lockUntilRef.current = performance.now() + 140;
        },
      });
    },
    [killActiveTween]
  );

  useEffect(() => {
    if (!enabled || prefersReducedMotion || typeof window === "undefined") {
      return;
    }

    const animateStepTo = (
      targetY: number,
      dir: 1 | -1,
      duration = 0.62,
      ease = "power2.inOut"
    ) => {
      killActiveTween();
      const now = performance.now();
      isAnimatingRef.current = true;
      activeDirRef.current = dir;
      tweenStartTimeRef.current = now;
      lockUntilRef.current = now + duration * 1000 + 160;

      activeTweenRef.current = gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration,
        ease,
        overwrite: "auto",
        onComplete: () => {
          isAnimatingRef.current = false;
          activeDirRef.current = 0;
          activeTweenRef.current = null;
          lockUntilRef.current = performance.now() + 140;
        },
      });
    };

    const isEventInsideInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      if (target.closest('[role="dialog"]')) return true;
      if (target.closest('[role="slider"]')) return true;
      return false;
    };

    // -------------------------------------------------------------------------
    // 1. DESKTOP WHEEL / TRACKPAD SCOPED OBSERVER
    // -------------------------------------------------------------------------
    const wheelObserver = Observer.create({
      target: window,
      type: "wheel",
      debounce: false,
      preventDefault: true,
      tolerance: 4,
      ignoreCheck: (event: Event) => {
        if (menuOpenRef.current || prefersReducedRef.current) return true;
        if (isEventInsideInteractive(event.target)) return true;
        if (event instanceof WheelEvent) {
          // Allow horizontal trackpad gestures or zoom pinch to pass untouched
          if (event.ctrlKey) return true;
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.3) return true;
        }
        return false;
      },
      onWheel: (self) => {
        if (menuOpenRef.current || prefersReducedRef.current) return;
        const wheelEvent = self.event as WheelEvent;
        const rawDeltaY = wheelEvent?.deltaY ?? self.deltaY;
        const absDelta = Math.abs(rawDeltaY);
        if (absDelta < 4) return;

        const dir: 1 | -1 = rawDeltaY > 0 ? 1 : -1;
        const now = performance.now();
        const timeSinceLast = now - lastWheelTimeRef.current;
        const prevAbs = prevWheelAbsRef.current;
        const prevDir = lastWheelDirRef.current;

        lastWheelTimeRef.current = now;
        lastWheelDirRef.current = dir;
        prevWheelAbsRef.current = absDelta;

        // If an editorial transition is currently playing:
        if (isAnimatingRef.current) {
          const elapsed = now - tweenStartTimeRef.current;
          // Ignore same-direction rapid bursts; permit deliberate strong reversal after 150ms
          if (
            dir !== activeDirRef.current &&
            activeDirRef.current !== 0 &&
            elapsed > 150 &&
            absDelta >= 16
          ) {
            const milestones = getMilestonesRef.current();
            const revTarget = resolveStepMilestone(window.scrollY, dir, milestones);
            if (revTarget !== null) {
              animateStepTo(revTarget, dir, 0.56, "power2.inOut");
            }
          }
          return;
        }

        // Absorb lingering trackpad kinetic inertia right after a step finishes
        if (now < lockUntilRef.current) {
          return;
        }

        // Reject decaying inertia tail events firing closely in same direction without fresh rise
        const isSameStream = timeSinceLast < 125 && dir === prevDir;
        const isDecayingInertia =
          isSameStream && absDelta <= prevAbs * 1.25 && absDelta < 70;
        if (isDecayingInertia) {
          return;
        }

        const milestones = getMilestonesRef.current();
        const nextTarget = resolveStepMilestone(window.scrollY, dir, milestones);
        if (nextTarget === null || Math.abs(nextTarget - window.scrollY) < 6) {
          return;
        }

        animateStepTo(nextTarget, dir, 0.62, "power2.inOut");
      },
    });

    // -------------------------------------------------------------------------
    // 2. MOBILE TOUCH SWIPE STEP GUARD (Natural touchmove + Bounded touchend)
    // -------------------------------------------------------------------------
    let touchState: {
      startScrollY: number;
      startClientY: number;
      minAllowedY: number;
      maxAllowedY: number;
      lastMoveClientY: number;
    } | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (menuOpenRef.current || prefersReducedRef.current) {
        touchState = null;
        return;
      }
      if (e.touches.length !== 1) {
        touchState = null;
        return;
      }
      const targetEl = e.target as Element | null;
      if (targetEl?.closest(INTERACTIVE_BYPASS_SELECTOR)) {
        touchState = null;
        return;
      }

      // Immediately release any animated transition so user touch is never trapped
      killActiveTween();

      const curY = window.scrollY;
      const milestones = getMilestonesRef.current();
      const prevY = resolveStepMilestone(curY, -1, milestones) ?? 0;
      const nextY = resolveStepMilestone(curY, 1, milestones) ?? curY;

      touchState = {
        startScrollY: curY,
        startClientY: e.touches[0].clientY,
        lastMoveClientY: e.touches[0].clientY,
        minAllowedY: prevY,
        maxAllowedY: nextY,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchState || e.touches.length !== 1) return;
      touchState.lastMoveClientY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const state = touchState;
      touchState = null;
      if (!state || menuOpenRef.current || prefersReducedRef.current) return;

      const endClientY =
        e.changedTouches[0]?.clientY ?? state.lastMoveClientY;
      const fingerDeltaY = state.startClientY - endClientY; // + => scrolled down
      const scrollDisp = window.scrollY - state.startScrollY;

      // Preserve simple taps (frog tap, hotspot tap, etc.)
      if (Math.abs(fingerDeltaY) < 26 && Math.abs(scrollDisp) < 26) {
        return;
      }

      const dir: 1 | -1 =
        Math.abs(fingerDeltaY) >= 14
          ? fingerDeltaY > 0
            ? 1
            : -1
          : scrollDisp > 0
          ? 1
          : -1;

      const targetY = dir > 0 ? state.maxAllowedY : state.minAllowedY;

      // Cancel runaway native fling velocity & settle smoothly onto at most +/-1 milestone
      if (Math.abs(targetY - window.scrollY) > 4) {
        animateStepTo(targetY, dir, 0.44, "power2.out");
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      wheelObserver.kill();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      killActiveTween();
    };
  }, [enabled, prefersReducedMotion, killActiveTween]);

  return { navigateToY, killActiveTween };
}
