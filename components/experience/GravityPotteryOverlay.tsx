"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Matter from "matter-js";
import {
  FOOTER_POTTERY_PLACEMENTS,
  type PotteryBodyPlacement,
} from "./footerPotteryAssets";

export interface FooterStageMetrics {
  stageWidth: number;
  stageHeight: number;
  wordmarkLeft: number;
  wordmarkWidth: number;
  wordmarkTop: number;
  wordmarkBottom: number;
  capHeight: number;
  taglineBottom: number;
  dividerTop: number;
  isMobile: boolean;
}

interface GravityPotteryOverlayProps {
  footerRef: React.RefObject<HTMLElement | null>;
  metrics: FooterStageMetrics | null;
  hasEntered: boolean;
  prefersReducedMotion: boolean;
}

interface SizedPot {
  placement: PotteryBodyPlacement;
  pixelWidth: number;
  pixelHeight: number;
  spawnX: number;
  spawnY: number;
  staticRestY: number;
  delayMs: number;
}

interface ActivePhysicsItem {
  sized: SizedPot;
  body: Matter.Body;
  imgOffsetX: number;
  imgOffsetY: number;
  lastHoverForceMs: number;
}

const SLEEP_SPEED_EPS = 0.16;
const SLEEP_ANGULAR_EPS = 0.014;
const WALL_THICKNESS = 140;

export default function GravityPotteryOverlay({
  footerRef,
  metrics,
  hasEntered,
  prefersReducedMotion,
}: GravityPotteryOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const shadowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const engineRef = useRef<Matter.Engine | null>(null);
  const itemsRef = useRef<ActivePhysicsItem[]>([]);
  const wallsRef = useRef<{
    floor: Matter.Body;
    left: Matter.Body;
    right: Matter.Body;
    ceiling: Matter.Body;
  } | null>(null);

  const floorYRef = useRef(0);
  const ceilingActiveYRef = useRef(0);
  const ceilingOpenRef = useRef(true);
  const isLoopRunningRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const spawnEndTimeRef = useRef(0);
  const stillFramesRef = useRef(0);
  const initializedRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const dragStateRef = useRef<{
    body: Matter.Body;
    constraint: Matter.Constraint;
    instanceId: string;
    lastPoints: { x: number; y: number; t: number }[];
  } | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [settledPoseTick, setSettledPoseTick] = useState(0);

  // Compute responsive geometry strictly keeping footer typography, tagline & bottom links clear
  const layout = useMemo(() => {
    if (!metrics || metrics.stageWidth <= 0 || metrics.stageHeight <= 0) {
      return null;
    }

    const {
      stageWidth,
      stageHeight,
      wordmarkLeft,
      wordmarkWidth,
      wordmarkBottom,
      capHeight,
      taglineBottom,
      dividerTop,
      isMobile,
    } = metrics;

    const effectiveCap = Math.max(40, capHeight);
    const desiredOverlapDepth = isMobile
      ? Math.max(24, Math.round(effectiveCap * 0.68))
      : Math.max(62, Math.round(effectiveCap * 0.64));
    const maxSafeFloor = isMobile ? dividerTop - 26 : dividerTop - 52;
    const minSafeFloor = wordmarkBottom + (isMobile ? 20 : 42);
    const floorY = Math.max(
      minSafeFloor,
      Math.min(maxSafeFloor, wordmarkBottom + desiredOverlapDepth)
    );

    const activePlacements = isMobile
      ? FOOTER_POTTERY_PLACEMENTS.filter((p) => p.showOnMobile)
      : FOOTER_POTTERY_PLACEMENTS;

    const pots: SizedPot[] = activePlacements.map((placement) => {
      const mul = isMobile ? placement.mobileScaleMultiplier ?? 1 : 1;
      const targetH = Math.round(
        effectiveCap * placement.heightToCapRatio * mul * (isMobile ? 0.94 : 1)
      );
      const pixelHeight = Math.max(30, targetH);
      const pixelWidth = Math.max(
        20,
        Math.round(pixelHeight * (placement.naturalWidth / placement.naturalHeight))
      );
      const xRatio = isMobile
        ? placement.mobileSpawnXRatio ?? placement.spawnXRatio
        : placement.spawnXRatio;

      const margin = Math.max(14, pixelWidth * 0.52);
      const spawnX = Math.max(
        margin,
        Math.min(stageWidth - margin, wordmarkLeft + wordmarkWidth * xRatio)
      );

      // Spawn cleanly ABOVE the wordmark area inside visible upper footer space so fall is dramatic and legible
      const spawnY = Math.max(
        taglineBottom + 24,
        wordmarkBottom - effectiveCap * 2.15 - placement.spawnTierOffset
      );

      const staticRestY = floorY - pixelHeight * 0.485;

      return {
        placement,
        pixelWidth,
        pixelHeight,
        spawnX,
        spawnY,
        staticRestY,
        delayMs: isMobile
          ? placement.mobileDelayMs ?? placement.delayMs
          : placement.delayMs,
      };
    });

    const activeCeilingY = Math.max(taglineBottom + 14, 96);

    return {
      floorY,
      activeCeilingY,
      stageWidth,
      stageHeight,
      pots,
    };
  }, [metrics]);

  // Paint a physics body & its dynamic proximity floor shadow to DOM
  const paintBodyDom = (item: ActivePhysicsItem, currentFloorY: number) => {
    const { sized, body, imgOffsetX, imgOffsetY } = item;
    const id = sized.placement.instanceId;
    const btn = spriteRefs.current[id];
    if (btn) {
      const tx = body.position.x + imgOffsetX - sized.pixelWidth / 2;
      const ty = body.position.y + imgOffsetY - sized.pixelHeight / 2;
      const cxLocal = sized.pixelWidth / 2 - imgOffsetX;
      const cyLocal = sized.pixelHeight / 2 - imgOffsetY;
      btn.style.transformOrigin = `${cxLocal.toFixed(1)}px ${cyLocal.toFixed(1)}px`;
      btn.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${body.angle.toFixed(4)}rad)`;
      btn.style.opacity = "1";
    }

    const shadow = shadowRefs.current[id];
    if (shadow) {
      const bottomEdge = body.bounds.max.y;
      const distAboveFloor = Math.max(0, currentFloorY - bottomEdge);
      const proximity = Math.max(0, 1 - distAboveFloor / 150);
      const scale = 0.7 + proximity * 0.3;
      const sx = body.position.x - sized.pixelWidth * 0.46;
      const sy = currentFloorY - 4;
      shadow.style.width = `${Math.round(sized.pixelWidth * 0.92)}px`;
      shadow.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      shadow.style.opacity = (proximity * 0.22).toFixed(3);
    }
  };

  // Start / resume Matter.js RAF simulation loop
  const wakeSimulation = (wakeAll = true) => {
    const engine = engineRef.current;
    if (!engine) return;
    if (wakeAll) {
      itemsRef.current.forEach((it) => {
        Matter.Sleeping.set(it.body, false);
      });
    }
    stillFramesRef.current = 0;

    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    let prevNow = performance.now();
    const tick = (now: number) => {
      if (!isLoopRunningRef.current || !engineRef.current) return;

      const dtMs = Math.min(26, Math.max(8, now - prevNow));
      prevNow = now;

      const isDragging = Boolean(dragStateRef.current);
      const items = itemsRef.current;

      // Once initial cascade finishes dropping, close ceiling gently beneath tagline so throws stay contained
      if (ceilingOpenRef.current && now > spawnEndTimeRef.current && wallsRef.current) {
        ceilingOpenRef.current = false;
        Matter.Body.setPosition(wallsRef.current.ceiling, {
          x: wallsRef.current.ceiling.position.x,
          y: ceilingActiveYRef.current - WALL_THICKNESS / 2,
        });
      }

      // Subtle lower-center-of-mass righting torque on upright earthenware shapes (disabled when knocked past ~65deg so wild throws tumble naturally!)
      for (const item of items) {
        const b = item.body;
        if (b.isStatic || dragStateRef.current?.body === b) continue;
        if (Math.abs(b.angle) < 1.05) {
          Matter.Body.setAngularVelocity(
            b,
            b.angularVelocity * 0.95 - Math.sin(b.angle) * item.sized.placement.bottomWeightBias
          );
        }
      }

      Matter.Engine.update(engineRef.current, dtMs);

      const maxW = footerRef.current?.clientWidth || window.innerWidth;
      const floorY = floorYRef.current;
      for (const item of items) {
        const b = item.body;
        if (b.position.y > floorY + 4) {
          Matter.Body.setPosition(b, {
            x: b.position.x,
            y: floorY - item.sized.pixelHeight * 0.35,
          });
          Matter.Body.setVelocity(b, { x: b.velocity.x * 0.6, y: -1.2 });
        }
        if (b.position.x < 8 || b.position.x > maxW - 8) {
          Matter.Body.setPosition(b, {
            x: Math.max(16, Math.min(maxW - 16, b.position.x)),
            y: b.position.y,
          });
          Matter.Body.setVelocity(b, { x: b.velocity.x * -0.4, y: b.velocity.y });
        }
        paintBodyDom(item, floorY);
      }

      const spawnsFinished = now > spawnEndTimeRef.current + 350;
      let anyAwake = isDragging || !spawnsFinished;

      if (!anyAwake) {
        for (const item of items) {
          const b = item.body;
          if (
            !b.isSleeping &&
            (b.speed > SLEEP_SPEED_EPS || Math.abs(b.angularVelocity) > SLEEP_ANGULAR_EPS)
          ) {
            anyAwake = true;
            break;
          }
        }
      }

      if (!anyAwake) {
        stillFramesRef.current += 1;
        if (stillFramesRef.current >= 32) {
          isLoopRunningRef.current = false;
          rafIdRef.current = null;
          setSettledPoseTick((v) => v + 1);
          return;
        }
      } else {
        stillFramesRef.current = 0;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  // Initialize REAL Matter.js falling simulation once footer is meaningfully visible
  useEffect(() => {
    if (prefersReducedMotion || !hasEntered || !layout || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    floorYRef.current = layout.floorY;
    ceilingActiveYRef.current = layout.activeCeilingY;
    ceilingOpenRef.current = true;

    const engine = Matter.Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: 1.15, scale: 0.001 },
      positionIterations: 8,
      velocityIterations: 6,
    });
    engineRef.current = engine;

    const wallOpts = {
      isStatic: true,
      friction: 0.28,
      frictionStatic: 0.36,
      restitution: 0.28,
    };

    const floor = Matter.Bodies.rectangle(
      layout.stageWidth / 2,
      layout.floorY + WALL_THICKNESS / 2,
      layout.stageWidth + 320,
      WALL_THICKNESS,
      { ...wallOpts, label: "pottery-floor" }
    );
    const left = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      layout.stageHeight / 2,
      WALL_THICKNESS,
      layout.stageHeight + 800,
      { ...wallOpts, label: "pottery-wall-left" }
    );
    const right = Matter.Bodies.rectangle(
      layout.stageWidth + WALL_THICKNESS / 2,
      layout.stageHeight / 2,
      WALL_THICKNESS,
      layout.stageHeight + 800,
      { ...wallOpts, label: "pottery-wall-right" }
    );
    // Start high so vessels enter cleanly from upper space; lowered after settle
    const ceiling = Matter.Bodies.rectangle(
      layout.stageWidth / 2,
      -420,
      layout.stageWidth + 320,
      WALL_THICKNESS,
      { ...wallOpts, label: "pottery-ceiling" }
    );

    wallsRef.current = { floor, left, right, ceiling };
    Matter.Composite.add(engine.world, [floor, left, right, ceiling]);

    const maxDelay = Math.max(...layout.pots.map((p) => p.delayMs));
    spawnEndTimeRef.current = performance.now() + maxDelay + 1100;

    layout.pots.forEach((sized) => {
      const id = sized.placement.instanceId;
      const btn = spriteRefs.current[id];
      if (btn) btn.style.opacity = "0";
      const shadow = shadowRefs.current[id];
      if (shadow) shadow.style.opacity = "0";

      const timerId = window.setTimeout(() => {
        if (!engineRef.current) return;

        const localVerts = sized.placement.hull.map(([nx, ny]) => ({
          x: nx * sized.pixelWidth,
          y: ny * sized.pixelHeight,
        }));

        const body = Matter.Bodies.fromVertices(sized.spawnX, sized.spawnY, [localVerts], {
          restitution: 0.32,
          friction: 0.28,
          frictionStatic: 0.38,
          frictionAir: 0.01,
          density: 0.0022,
          sleepThreshold: 45,
          label: `pot-${id}`,
        });

        const firstLocalInBody = {
          x: body.vertices[0].x - body.position.x,
          y: body.vertices[0].y - body.position.y,
        };
        const imgOffsetX = firstLocalInBody.x - localVerts[0].x;
        const imgOffsetY = firstLocalInBody.y - localVerts[0].y;

        Matter.Body.setAngle(body, sized.placement.initialAngle);
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 1.4,
          y: 1.8,
        });
        Matter.Body.setAngularVelocity(
          body,
          (Math.random() > 0.5 ? 1 : -1) * (0.01 + Math.random() * 0.014)
        );

        const item: ActivePhysicsItem = {
          sized,
          body,
          imgOffsetX,
          imgOffsetY,
          lastHoverForceMs: 0,
        };
        itemsRef.current.push(item);
        Matter.Composite.add(engineRef.current.world, body);
        paintBodyDom(item, floorYRef.current);
        wakeSimulation(false);
      }, sized.delayMs);

      timeoutsRef.current.push(timerId);
    });
  }, [hasEntered, layout, prefersReducedMotion]);

  // Cursor proximity physics interaction on footer hover (zero impact on scrolling/links)
  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl || prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!initializedRef.current || !engineRef.current || dragStateRef.current) return;
      if (e.pointerType === "touch") return; // Touch screens scroll / tap-drag cleanly without hover repulsion

      const rect = footerEl.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const now = performance.now();

      const prev = lastPointerRef.current;
      let moveVx = 0;
      let moveVy = 0;
      if (prev) {
        const dt = Math.max(8, now - prev.t);
        moveVx = Math.max(-2.5, Math.min(2.5, (px - prev.x) / dt));
        moveVy = Math.max(-2.5, Math.min(2.5, (py - prev.y) / dt));
      }
      lastPointerRef.current = { x: px, y: py, t: now };

      const distMovedPx = prev ? Math.hypot(px - prev.x, py - prev.y) : 0;
      if (distMovedPx < 1.5) return;

      let wokeAny = false;
      const items = itemsRef.current;

      for (const item of items) {
        const b = item.body;
        const dx = b.position.x - px;
        const dy = b.position.y - py;
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(
          92,
          Math.min(132, 62 + Math.max(item.sized.pixelWidth, item.sized.pixelHeight) * 0.48)
        );

        if (dist < radius && dist > 1) {
          if (now - item.lastHoverForceMs < 42) continue;
          item.lastHoverForceMs = now;

          Matter.Sleeping.set(b, false);
          wokeAny = true;

          // Wake immediate neighbors so physical impulse ripples through real pot-to-pot collisions
          for (const other of items) {
            if (other !== item) {
              const nd = Math.hypot(
                other.body.position.x - b.position.x,
                other.body.position.y - b.position.y
              );
              if (nd < radius * 1.65) {
                Matter.Sleeping.set(other.body, false);
              }
            }
          }

          const falloff = Math.pow(1 - dist / radius, 1.15);
          const nx = dx / dist;
          const ny = dy / dist;

          // Physical force push + slight off-center spin torque so hovered clay vessels visibly roll/shift & nudge neighbors
          const rawFx = (nx * 0.0085 + moveVx * 0.0065) * falloff * b.mass;
          const rawFy = (ny * 0.0032 + moveVy * 0.0022 - 0.0036) * falloff * b.mass;
          const maxF = 0.017 * b.mass;
          const fx = Math.max(-maxF, Math.min(maxF, rawFx));
          const fy = Math.max(-maxF, Math.min(maxF, rawFy));

          Matter.Body.applyForce(
            b,
            {
              x: b.position.x,
              y: b.position.y - item.sized.pixelHeight * 0.2,
            },
            { x: fx, y: fy }
          );
        }
      }

      if (wokeAny) {
        wakeSimulation(false);
      }
    };

    const handlePointerLeave = () => {
      lastPointerRef.current = null;
    };

    footerEl.addEventListener("pointermove", handlePointerMove, { passive: true });
    footerEl.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      footerEl.removeEventListener("pointermove", handlePointerMove);
      footerEl.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [footerRef, prefersReducedMotion]);

  // Update boundaries cleanly on resize without restarting falling animation
  useEffect(() => {
    if (!initializedRef.current || !layout || !wallsRef.current) return;
    floorYRef.current = layout.floorY;
    ceilingActiveYRef.current = layout.activeCeilingY;

    const { floor, left, right, ceiling } = wallsRef.current;
    Matter.Body.setPosition(floor, {
      x: layout.stageWidth / 2,
      y: layout.floorY + WALL_THICKNESS / 2,
    });
    Matter.Body.setPosition(left, {
      x: -WALL_THICKNESS / 2,
      y: layout.stageHeight / 2,
    });
    Matter.Body.setPosition(right, {
      x: layout.stageWidth + WALL_THICKNESS / 2,
      y: layout.stageHeight / 2,
    });
    if (!ceilingOpenRef.current) {
      Matter.Body.setPosition(ceiling, {
        x: layout.stageWidth / 2,
        y: layout.activeCeilingY - WALL_THICKNESS / 2,
      });
    }

    itemsRef.current.forEach((item) => {
      paintBodyDom(item, layout.floorY);
    });
    wakeSimulation(true);
  }, [layout]);

  // Complete unmount cleanup
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
      isLoopRunningRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
      itemsRef.current = [];
    };
  }, []);

  // Custom Spring Drag & Throw per vessel (does not interfere with normal page scroll)
  const handlePotPointerDown = (
    instanceId: string,
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (prefersReducedMotion || !engineRef.current || !footerRef.current) return;
    const item = itemsRef.current.find((i) => i.sized.placement.instanceId === instanceId);
    if (!item) return;

    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = footerRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const dx = px - item.body.position.x;
    const dy = py - item.body.position.y;
    const cos = Math.cos(-item.body.angle);
    const sin = Math.sin(-item.body.angle);
    const localAnchor = {
      x: dx * cos - dy * sin,
      y: dx * sin + dy * cos,
    };

    const constraint = Matter.Constraint.create({
      pointA: { x: px, y: py },
      bodyB: item.body,
      pointB: localAnchor,
      stiffness: 0.28,
      damping: 0.28,
      length: 0,
    });

    Matter.Composite.add(engineRef.current.world, constraint);
    dragStateRef.current = {
      body: item.body,
      constraint,
      instanceId,
      lastPoints: [{ x: px, y: py, t: performance.now() }],
    };
    setDraggingId(instanceId);
    wakeSimulation(true);
  };

  const handlePotPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag || !footerRef.current) return;

    e.stopPropagation();
    const rect = footerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const clampedX = Math.max(20, Math.min(rect.width - 20, rawX));
    const clampedY = Math.max(
      ceilingActiveYRef.current + 18,
      Math.min(floorYRef.current - 12, rawY)
    );

    drag.constraint.pointA = { x: clampedX, y: clampedY };
    const now = performance.now();
    drag.lastPoints.push({ x: clampedX, y: clampedY, t: now });
    if (drag.lastPoints.length > 4) drag.lastPoints.shift();
    wakeSimulation(true);
  };

  const handlePotPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag || !engineRef.current) return;

    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    Matter.Composite.remove(engineRef.current.world, drag.constraint);

    const pts = drag.lastPoints;
    if (pts.length >= 2) {
      const first = pts[0];
      const last = pts[pts.length - 1];
      const elapsed = Math.max(12, last.t - first.t);
      const vx = ((last.x - first.x) / elapsed) * 14;
      const vy = ((last.y - first.y) / elapsed) * 14;
      Matter.Body.setVelocity(drag.body, {
        x: Math.max(-18, Math.min(18, vx)),
        y: Math.max(-18, Math.min(18, vy)),
      });
    }

    dragStateRef.current = null;
    setDraggingId(null);
    wakeSimulation(true);
  };

  if (!layout) return null;

  return (
    <div
      ref={containerRef}
      data-testid="footer-pottery-layer"
      data-pottery-state={
        prefersReducedMotion
          ? "reduced-motion-static"
          : !hasEntered
            ? "waiting"
            : draggingId
              ? "dragging"
              : settledPoseTick > 0
                ? "settled"
                : "active"
      }
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
      aria-label="Interactive illustrated pottery collection"
    >
      {/* Dynamic contact shadows directly along floor plane */}
      {layout.pots.map((sized) => {
        const id = sized.placement.instanceId;
        const shadowStyle: React.CSSProperties = prefersReducedMotion
          ? {
              left: 0,
              top: 0,
              width: `${Math.round(sized.pixelWidth * 0.92)}px`,
              height: "10px",
              transform: `translate3d(${Math.round(sized.spawnX - sized.pixelWidth * 0.46)}px, ${Math.round(layout.floorY - 4)}px, 0)`,
              opacity: 0.22,
            }
          : {
              left: 0,
              top: 0,
              width: `${Math.round(sized.pixelWidth * 0.92)}px`,
              height: "10px",
              opacity: 0,
            };

        return (
          <div
            key={`shadow-${id}`}
            ref={(el) => {
              shadowRefs.current[id] = el;
            }}
            aria-hidden="true"
            style={shadowStyle}
            className="pointer-events-none absolute rounded-full bg-[#4A2E1B]/45 blur-[5px] will-change-transform"
          />
        );
      })}

      {/* Illustrated pottery vessels driven cleanly by Matter.js bodies */}
      {layout.pots.map((sized) => {
        const id = sized.placement.instanceId;
        const isDragging = draggingId === id;
        const staticLeft = Math.round(sized.spawnX - sized.pixelWidth / 2);
        const staticTop = Math.round(sized.staticRestY - sized.pixelHeight / 2);

        const style: React.CSSProperties = prefersReducedMotion
          ? {
              width: `${sized.pixelWidth}px`,
              height: `${sized.pixelHeight}px`,
              transform: `translate3d(${staticLeft}px, ${staticTop}px, 0) rotate(${(sized.placement.initialAngle * 0.25).toFixed(3)}rad)`,
              zIndex: sized.placement.zOrder,
              opacity: 1,
            }
          : {
              width: `${sized.pixelWidth}px`,
              height: `${sized.pixelHeight}px`,
              zIndex: isDragging ? 45 : sized.placement.zOrder,
              opacity: 0,
            };

        return (
          <button
            key={id}
            ref={(el) => {
              spriteRefs.current[id] = el;
            }}
            type="button"
            data-testid={`pottery-item-${id}`}
            aria-label={`${sized.placement.label} — hover to nudge or drag to drop`}
            style={style}
            onPointerDown={(e) => handlePotPointerDown(id, e)}
            onPointerMove={handlePotPointerMove}
            onPointerUp={handlePotPointerUp}
            onPointerCancel={handlePotPointerUp}
            className={`pointer-events-auto absolute left-0 top-0 m-0 border-0 bg-transparent p-0 touch-none will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 ${
              prefersReducedMotion
                ? "cursor-default"
                : isDragging
                  ? "cursor-grabbing drop-shadow-[0_12px_18px_rgba(25,25,23,0.16)]"
                  : "cursor-grab"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sized.placement.src}
              alt={sized.placement.label}
              width={sized.placement.naturalWidth}
              height={sized.placement.naturalHeight}
              draggable={false}
              className="block h-full w-full select-none object-contain pointer-events-none"
              style={sized.placement.flipX ? { transform: "scaleX(-1)" } : undefined}
            />
          </button>
        );
      })}
    </div>
  );
}
