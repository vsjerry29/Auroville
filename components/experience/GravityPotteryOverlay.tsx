"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Matter from "matter-js";
import { FOOTER_POTTERY_ASSETS, type PotteryAssetSpec } from "./footerPotteryAssets";

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
  spec: PotteryAssetSpec;
  pixelWidth: number;
  pixelHeight: number;
  homeX: number;
  restY: number;
  spawnY: number;
  delayMs: number;
}

interface ActivePhysicsItem {
  sized: SizedPot;
  body: Matter.Body;
  /** Offset from Matter body centroid (0,0) to sprite image geometric center */
  imgOffsetX: number;
  imgOffsetY: number;
}

const SLEEP_SPEED_EPS = 0.14;
const SLEEP_ANGULAR_EPS = 0.012;
const STATIC_WALL_THICKNESS = 120;

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
  const ceilingYRef = useRef(0);
  const isLoopRunningRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const spawnEndTimeRef = useRef(0);
  const stillFramesRef = useRef(0);
  const initializedRef = useRef(false);

  const dragStateRef = useRef<{
    body: Matter.Body;
    constraint: Matter.Constraint;
    potId: string;
    lastPoints: { x: number; y: number; t: number }[];
  } | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [settledPoseTick, setSettledPoseTick] = useState(0);

  // Compute responsive geometry & floor line cleanly above the bottom divider
  const layout = useMemo(() => {
    if (!metrics || metrics.stageWidth <= 0 || metrics.stageHeight <= 0) {
      return null;
    }
    const {
      stageWidth,
      wordmarkLeft,
      wordmarkWidth,
      wordmarkTop,
      wordmarkBottom,
      capHeight,
      taglineBottom,
      dividerTop,
      isMobile,
    } = metrics;

    const effectiveCap = Math.max(42, capHeight);
    // Floor sits right beneath AUROVILLE baseline so tall vessels overlap only its lower ~30%
    // while leaving a clean archival gap above the divider and never obstructing Bottom links
    const desiredOverlapDepth = isMobile
      ? Math.max(24, Math.round(effectiveCap * 0.68))
      : Math.max(58, Math.round(effectiveCap * 0.62));
    const maxSafeFloor = isMobile ? dividerTop - 28 : dividerTop - 56;
    const minSafeFloor = wordmarkBottom + (isMobile ? 20 : 40);
    const floorY = Math.max(
      minSafeFloor,
      Math.min(maxSafeFloor, wordmarkBottom + desiredOverlapDepth)
    );

    const activeSpecs = isMobile
      ? FOOTER_POTTERY_ASSETS.filter((a) => a.showOnMobile)
      : FOOTER_POTTERY_ASSETS;

    const pots: SizedPot[] = activeSpecs.map((spec) => {
      const mul = isMobile ? spec.mobileScaleMultiplier ?? 1 : 1;
      const targetH = Math.round(
        effectiveCap * spec.heightToCapRatio * mul * (isMobile ? 0.94 : 1)
      );
      const pixelHeight = Math.max(32, targetH);
      const pixelWidth = Math.max(20, Math.round(pixelHeight * (spec.width / spec.height)));
      const xRatio = isMobile ? spec.mobileX ?? spec.desktopX : spec.desktopX;
      const homeX = Math.max(
        pixelWidth * 0.5 + 16,
        Math.min(stageWidth - pixelWidth * 0.5 - 16, wordmarkLeft + wordmarkWidth * xRatio)
      );

      // Spawn visibly in open white space below the tagline so vessels rotate gently as they fall into the wordmark zone
      const spawnY = Math.max(
        taglineBottom + pixelHeight * 0.5 + 14,
        wordmarkTop - (isMobile ? 76 : 165)
      );
      const restY = floorY - pixelHeight * 0.485;

      return {
        spec,
        pixelWidth,
        pixelHeight,
        homeX,
        restY,
        spawnY,
        delayMs: isMobile ? spec.mobileDelayMs ?? spec.desktopDelayMs : spec.desktopDelayMs,
      };
    });

    const ceilingY = Math.max(
      taglineBottom + 8,
      Math.min(wordmarkTop - (isMobile ? 90 : 185), floorY - 260)
    );

    return { floorY, ceilingY, stageWidth, stageHeight: metrics.stageHeight, pots };
  }, [metrics]);

  // Apply DOM visual transforms for one body + its grounded floor contact shadow
  const paintBodyDom = (item: ActivePhysicsItem, currentFloorY: number) => {
    const { sized, body, imgOffsetX, imgOffsetY } = item;
    const btn = spriteRefs.current[sized.spec.id];
    if (btn) {
      const tx = body.position.x + imgOffsetX - sized.pixelWidth / 2;
      const ty = body.position.y + imgOffsetY - sized.pixelHeight / 2;
      // Rotate around Matter centroid relative to element top-left corner
      const cxLocal = sized.pixelWidth / 2 - imgOffsetX;
      const cyLocal = sized.pixelHeight / 2 - imgOffsetY;
      btn.style.transformOrigin = `${cxLocal.toFixed(1)}px ${cyLocal.toFixed(1)}px`;
      btn.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${body.angle.toFixed(4)}rad)`;
      btn.style.opacity = "1";
    }

    const shadow = shadowRefs.current[sized.spec.id];
    if (shadow) {
      const bottomEdge = body.bounds.max.y;
      const distAboveFloor = Math.max(0, currentFloorY - bottomEdge);
      const proximity = Math.max(0, 1 - distAboveFloor / 140);
      const scale = 0.72 + proximity * 0.28;
      const sx = body.position.x - (sized.pixelWidth * 0.46);
      const sy = currentFloorY - 4;
      shadow.style.width = `${Math.round(sized.pixelWidth * 0.92)}px`;
      shadow.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      shadow.style.opacity = (proximity * 0.22).toFixed(3);
    }
  };

  // Start or wake RAF physics loop
  const wakeSimulation = () => {
    const engine = engineRef.current;
    if (!engine) return;
    itemsRef.current.forEach((it) => {
      Matter.Sleeping.set(it.body, false);
    });
    stillFramesRef.current = 0;

    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    let prevNow = performance.now();
    const tick = (now: number) => {
      if (!isLoopRunningRef.current || !engineRef.current) return;

      const dtMs = Math.min(32, Math.max(8, now - prevNow));
      prevNow = now;

      const isDragging = Boolean(dragStateRef.current);
      const currentItems = itemsRef.current;

      // Apply delicate self-righting pottery torque while settled/landing near upright
      for (const item of currentItems) {
        const b = item.body;
        if (b.isStatic || dragStateRef.current?.body === b) continue;
        const angleDiff = item.sized.spec.restAngle - b.angle;
        if (Math.abs(angleDiff) < 0.75) {
          Matter.Body.setAngularVelocity(
            b,
            b.angularVelocity * 0.93 + angleDiff * item.sized.spec.uprightRestore
          );
        }
      }

      Matter.Engine.update(engineRef.current, dtMs);

      // Keep bodies strictly inside walls and above floor in case of fast resize/throw
      const maxW = footerRef.current?.clientWidth || window.innerWidth;
      const floorY = floorYRef.current;
      for (const item of currentItems) {
        const b = item.body;
        if (b.position.y > floorY) {
          Matter.Body.setPosition(b, { x: b.position.x, y: floorY - item.sized.pixelHeight * 0.3 });
          Matter.Body.setVelocity(b, { x: b.velocity.x * 0.5, y: 0 });
        }
        if (b.position.x < 12 || b.position.x > maxW - 12) {
          Matter.Body.setPosition(b, {
            x: Math.max(20, Math.min(maxW - 20, b.position.x)),
            y: b.position.y,
          });
          Matter.Body.setVelocity(b, { x: b.velocity.x * -0.4, y: b.velocity.y });
        }
        paintBodyDom(item, floorY);
      }

      const allSpawnsDone = performance.now() > spawnEndTimeRef.current;
      let anyMoving = isDragging || !allSpawnsDone;

      if (!anyMoving) {
        for (const item of currentItems) {
          const b = item.body;
          if (
            b.speed > SLEEP_SPEED_EPS ||
            Math.abs(b.angularVelocity) > SLEEP_ANGULAR_EPS
          ) {
            anyMoving = true;
            break;
          }
        }
      }

      if (!anyMoving) {
        stillFramesRef.current += 1;
        if (stillFramesRef.current >= 28) {
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

  // Initialize Matter.js falling simulation ONCE when footer becomes meaningfully visible
  useEffect(() => {
    if (prefersReducedMotion || !hasEntered || !layout || initializedRef.current) {
      return;
    }
    initializedRef.current = true;
    floorYRef.current = layout.floorY;
    ceilingYRef.current = layout.ceilingY;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.05, scale: 0.001 },
      positionIterations: 8,
      velocityIterations: 6,
    });
    engineRef.current = engine;

    const wallOpts = {
      isStatic: true,
      friction: 0.65,
      restitution: 0.2,
    };

    const floor = Matter.Bodies.rectangle(
      layout.stageWidth / 2,
      layout.floorY + STATIC_WALL_THICKNESS / 2,
      layout.stageWidth + 240,
      STATIC_WALL_THICKNESS,
      { ...wallOpts, label: "pottery-floor" }
    );
    const left = Matter.Bodies.rectangle(
      -STATIC_WALL_THICKNESS / 2,
      layout.stageHeight / 2,
      STATIC_WALL_THICKNESS,
      layout.stageHeight + 600,
      { ...wallOpts, label: "pottery-wall-left" }
    );
    const right = Matter.Bodies.rectangle(
      layout.stageWidth + STATIC_WALL_THICKNESS / 2,
      layout.stageHeight / 2,
      STATIC_WALL_THICKNESS,
      layout.stageHeight + 600,
      { ...wallOpts, label: "pottery-wall-right" }
    );
    const ceiling = Matter.Bodies.rectangle(
      layout.stageWidth / 2,
      layout.ceilingY - STATIC_WALL_THICKNESS / 2,
      layout.stageWidth + 240,
      STATIC_WALL_THICKNESS,
      { ...wallOpts, label: "pottery-ceiling" }
    );

    wallsRef.current = { floor, left, right, ceiling };
    Matter.Composite.add(engine.world, [floor, left, right, ceiling]);

    const maxDelay = Math.max(...layout.pots.map((p) => p.delayMs));
    spawnEndTimeRef.current = performance.now() + maxDelay + 900;

    layout.pots.forEach((sized) => {
      const btn = spriteRefs.current[sized.spec.id];
      if (btn) btn.style.opacity = "0";
      const shadow = shadowRefs.current[sized.spec.id];
      if (shadow) shadow.style.opacity = "0";

      const timerId = window.setTimeout(() => {
        if (!engineRef.current) return;

        // Build convex hull vertices around image center
        const localVerts = sized.spec.hull.map(([nx, ny]) => ({
          x: nx * sized.pixelWidth,
          y: ny * sized.pixelHeight,
        }));

        const spawnY = Math.max(layout.ceilingY + sized.pixelHeight * 0.45 + 6, sized.spawnY);
        const body = Matter.Bodies.fromVertices(
          sized.homeX,
          spawnY,
          [localVerts],
          {
            restitution: 0.24,
            friction: 0.56,
            frictionStatic: 0.85,
            frictionAir: 0.014,
            density: 0.0022,
            label: `pot-${sized.spec.id}`,
          }
        );

        // Preserve exact pixel correspondence between Matter centroid and image center
        const firstLocalInBody = {
          x: body.vertices[0].x - body.position.x,
          y: body.vertices[0].y - body.position.y,
        };
        const imgOffsetX = firstLocalInBody.x - localVerts[0].x;
        const imgOffsetY = firstLocalInBody.y - localVerts[0].y;

        Matter.Body.setAngle(body, sized.spec.initialAngle);
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 0.45,
          y: 0.65,
        });
        Matter.Body.setAngularVelocity(body, sized.spec.initialAngle * -0.025);

        const item: ActivePhysicsItem = { sized, body, imgOffsetX, imgOffsetY };
        itemsRef.current.push(item);
        Matter.Composite.add(engineRef.current.world, body);
        paintBodyDom(item, floorYRef.current);
        wakeSimulation();
      }, sized.delayMs);

      timeoutsRef.current.push(timerId);
    });
  }, [hasEntered, layout, prefersReducedMotion]);

  // Update boundaries cleanly on viewport resizes without resetting existing arrangement
  useEffect(() => {
    if (!initializedRef.current || !layout || !wallsRef.current) return;
    floorYRef.current = layout.floorY;
    ceilingYRef.current = layout.ceilingY;

    const { floor, left, right, ceiling } = wallsRef.current;
    Matter.Body.setPosition(floor, {
      x: layout.stageWidth / 2,
      y: layout.floorY + STATIC_WALL_THICKNESS / 2,
    });
    Matter.Body.setPosition(left, {
      x: -STATIC_WALL_THICKNESS / 2,
      y: layout.stageHeight / 2,
    });
    Matter.Body.setPosition(right, {
      x: layout.stageWidth + STATIC_WALL_THICKNESS / 2,
      y: layout.stageHeight / 2,
    });
    Matter.Body.setPosition(ceiling, {
      x: layout.stageWidth / 2,
      y: layout.ceilingY - STATIC_WALL_THICKNESS / 2,
    });

    itemsRef.current.forEach((item) => {
      paintBodyDom(item, layout.floorY);
    });
    wakeSimulation();
  }, [layout]);

  // Full cleanup on unmount
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

  // Custom Pointer Spring Drag & Release (zero interference with page wheel/scroll)
  const handlePotPointerDown = (
    potId: string,
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (prefersReducedMotion || !engineRef.current || !footerRef.current) return;
    const item = itemsRef.current.find((i) => i.sized.spec.id === potId);
    if (!item) return;

    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = footerRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Anchor relative to body's centroid so grabbing rim/neck swings naturally
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
      stiffness: 0.26,
      damping: 0.3,
      length: 0,
    });

    Matter.Composite.add(engineRef.current.world, constraint);
    dragStateRef.current = {
      body: item.body,
      constraint,
      potId,
      lastPoints: [{ x: px, y: py, t: performance.now() }],
    };
    setDraggingId(potId);
    wakeSimulation();
  };

  const handlePotPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag || !footerRef.current) return;

    e.stopPropagation();
    const rect = footerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const maxW = rect.width;
    const clampedX = Math.max(24, Math.min(maxW - 24, rawX));
    const clampedY = Math.max(
      ceilingYRef.current + 20,
      Math.min(floorYRef.current - 12, rawY)
    );

    drag.constraint.pointA = { x: clampedX, y: clampedY };
    const now = performance.now();
    drag.lastPoints.push({ x: clampedX, y: clampedY, t: now });
    if (drag.lastPoints.length > 4) drag.lastPoints.shift();
    wakeSimulation();
  };

  const handlePotPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag || !engineRef.current) return;

    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    Matter.Composite.remove(engineRef.current.world, drag.constraint);

    // Compute smooth clamped throw velocity from recent pointer delta
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
    wakeSimulation();
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
      {/* Dynamic floor contact shadows underneath the pots */}
      {layout.pots.map((sized) => {
        const shadowStyle: React.CSSProperties = prefersReducedMotion
          ? {
              left: 0,
              top: 0,
              width: `${Math.round(sized.pixelWidth * 0.92)}px`,
              height: "10px",
              transform: `translate3d(${Math.round(sized.homeX - sized.pixelWidth * 0.46)}px, ${Math.round(layout.floorY - 4)}px, 0)`,
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
            key={`shadow-${sized.spec.id}`}
            ref={(el) => {
              shadowRefs.current[sized.spec.id] = el;
            }}
            aria-hidden="true"
            style={shadowStyle}
            className="pointer-events-none absolute rounded-full bg-[#4A2E1B]/45 blur-[5px] will-change-transform"
          />
        );
      })}

      {/* Illustrated transparent pottery vessels */}
      {layout.pots.map((sized) => {
        const isDragging = draggingId === sized.spec.id;
        const staticLeft = Math.round(sized.homeX - sized.pixelWidth / 2);
        const staticTop = Math.round(sized.restY - sized.pixelHeight / 2);

        const style: React.CSSProperties = prefersReducedMotion
          ? {
              width: `${sized.pixelWidth}px`,
              height: `${sized.pixelHeight}px`,
              transform: `translate3d(${staticLeft}px, ${staticTop}px, 0) rotate(${sized.spec.restAngle}rad)`,
              zIndex: sized.spec.zOrder,
              opacity: 1,
            }
          : {
              width: `${sized.pixelWidth}px`,
              height: `${sized.pixelHeight}px`,
              zIndex: isDragging ? 40 : sized.spec.zOrder,
              opacity: 0,
            };

        return (
          <button
            key={sized.spec.id}
            ref={(el) => {
              spriteRefs.current[sized.spec.id] = el;
            }}
            type="button"
            data-testid={`pottery-item-${sized.spec.id}`}
            aria-label={`${sized.spec.label} — drag to pick up and drop`}
            style={style}
            onPointerDown={(e) => handlePotPointerDown(sized.spec.id, e)}
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
              src={sized.spec.src}
              alt={sized.spec.label}
              width={sized.spec.width}
              height={sized.spec.height}
              draggable={false}
              className="block h-full w-full select-none object-contain pointer-events-none"
            />
          </button>
        );
      })}
    </div>
  );
}
