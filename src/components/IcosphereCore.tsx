import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const PHI = (1 + Math.sqrt(5)) / 2;

interface V3 {
  x: number;
  y: number;
  z: number;
}

const RAW: V3[] = [
  { x: -1, y: PHI, z: 0 },
  { x: 1, y: PHI, z: 0 },
  { x: -1, y: -PHI, z: 0 },
  { x: 1, y: -PHI, z: 0 },
  { x: 0, y: -1, z: PHI },
  { x: 0, y: 1, z: PHI },
  { x: 0, y: -1, z: -PHI },
  { x: 0, y: 1, z: -PHI },
  { x: PHI, y: 0, z: -1 },
  { x: PHI, y: 0, z: 1 },
  { x: -PHI, y: 0, z: -1 },
  { x: -PHI, y: 0, z: 1 },
];

const FACES: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

// 12 base vertices each represent a backend service node
const NODE_LABELS = [
  'JVM CORE',
  'PYTHON KERNEL',
  '.NET RUNTIME',
  'GO ROUTER',
  'POSTGRES',
  'REDIS',
  'KAFKA BUS',
  'GRAPHQL GW',
  'REST API',
  'WEBSOCKET',
  'AUTH / OIDC',
  'GRPC MESH',
];

function normalize(v: V3): V3 {
  const m = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return { x: v.x / m, y: v.y / m, z: v.z / m };
}

function buildIcosphere(subdivisions: number) {
  const verts: V3[] = RAW.map(normalize);
  let faces: [number, number, number][] = FACES.map((f) => [...f] as [number, number, number]);

  for (let s = 0; s < subdivisions; s++) {
    const mid = new Map<number, number>();
    const key = (a: number, b: number) => (a < b ? a * 100000 + b : b * 100000 + a);
    const getMid = (a: number, b: number): number => {
      const k = key(a, b);
      const found = mid.get(k);
      if (found !== undefined) return found;
      const va = verts[a];
      const vb = verts[b];
      const m = normalize({ x: (va.x + vb.x) / 2, y: (va.y + vb.y) / 2, z: (va.z + vb.z) / 2 });
      verts.push(m);
      const idx = verts.length - 1;
      mid.set(k, idx);
      return idx;
    };
    const next: [number, number, number][] = [];
    for (const [a, b, c] of faces) {
      const ab = getMid(a, b);
      const bc = getMid(b, c);
      const ca = getMid(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }

  const seen = new Set<number>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    [[a, b], [b, c], [c, a]].forEach(([x, y]) => {
      const k = x < y ? x * 100000 + y : y * 100000 + x;
      if (!seen.has(k)) {
        seen.add(k);
        edges.push(x < y ? [x, y] : [y, x]);
      }
    });
  }

  return { verts, edges };
}

/* GPU-composited only: transform + opacity (no filter, no box-shadow) */
const corePulse = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.92; }
  50%      { transform: translate(-50%, -50%) scale(1.07); opacity: 1; }
`;

const ping = keyframes`
  0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
`;

const Stage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  cursor: grab;
  touch-action: none;
  user-select: none;
  &:active { cursor: grabbing; }
`;

const FrameSvg = styled.svg`
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  pointer-events: none;
  overflow: visible;
  & .ring  { fill: none; stroke: rgba(180, 80, 255, 0.35); stroke-width: 0.6; }
  & .cross { stroke: rgba(180, 80, 255, 0.18); stroke-width: 0.4; stroke-dasharray: 1.2 1.6; }
  & .vertex { fill: rgb(220, 170, 255); filter: drop-shadow(0 0 4px rgba(180, 80, 255, 0.85)); }
  & .tag {
    font-family: var(--font-mono);
    font-size: 2.4px;
    letter-spacing: 0.4px;
    fill: rgba(180, 80, 255, 0.55);
    text-transform: uppercase;
  }
`;

const SphereSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* drop-shadow on every line was forcing a per-frame filter pass over hundreds
     of segments — removed. The vertices still glow which is enough visually. */
  & line {
    stroke: rgb(180, 80, 255);
    stroke-width: 0.55;
    stroke-linecap: round;
  }
  & .vert {
    fill: rgb(220, 170, 255);
    filter: drop-shadow(0 0 4px rgba(180, 80, 255, 0.85));
  }
  & .vert.named {
    stroke: rgba(255, 230, 255, 0.9);
    stroke-width: 0.4;
  }
  & .vert.hot {
    fill: rgb(255, 230, 255);
    filter: drop-shadow(0 0 8px rgba(220, 170, 255, 1));
  }
`;

const Core = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14%;
  height: 14%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 32%,
    rgba(255, 240, 255, 0.95) 0%,
    rgba(220, 170, 255, 0.9) 22%,
    rgba(180, 80, 255, 0.7) 55%,
    rgba(80, 20, 160, 0.5) 90%
  );
  box-shadow:
    0 0 24px rgba(180, 80, 255, 0.85),
    inset 0 0 14px rgba(220, 170, 255, 0.6);
  animation: ${corePulse} 3.2s ease-in-out infinite;
  pointer-events: none;
`;

const PingRing = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14%;
  height: 14%;
  border-radius: 50%;
  border: 1px solid rgba(220, 170, 255, 0.85);
  pointer-events: none;
  animation: ${ping} 0.8s ease-out forwards;
`;

const HintTag = styled.div`
  position: absolute;
  left: 50%;
  bottom: -2px;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.32em;
  color: rgba(180, 80, 255, 0.55);
  text-transform: uppercase;
  pointer-events: none;
  white-space: nowrap;
`;

const NodeBadge = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${(p) => p.$x}px;
  top: ${(p) => p.$y}px;
  transform: translate(-50%, calc(-100% - 10px));
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgb(220, 170, 255);
  background: rgba(20, 0, 40, 0.92);
  border: 1px solid rgb(180, 80, 255);
  padding: 4px 10px;
  white-space: nowrap;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  box-shadow: 0 0 14px rgba(180, 80, 255, 0.45);
  z-index: 4;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    margin-left: -3px;
    width: 6px;
    height: 6px;
    background: rgb(180, 80, 255);
    transform: rotate(45deg);
  }
`;

interface Props {
  subdivisions?: number;
}

/**
 * Geodesic icosphere core.
 *
 * - 12 base vertices labelled as backend "service nodes" (JVM, Python, Postgres…)
 * - subdivisions=1 → 42 verts, ~60 edges; back faces dimmed by depth.
 *   (Was 2 → ~480 edges — 8× more DOM mutations per frame, dropped for perf.)
 * - drag to rotate (pointer events), auto-rotates when idle.
 * - hover near a named vertex highlights it + shows tooltip badge.
 * - click anywhere ⇒ ping ring around the central core.
 * - SVG attributes are mutated imperatively in a throttled RAF loop.
 */
export function IcosphereCore({ subdivisions = 1 }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const projectedRef = useRef<{ x: number; y: number; z: number }[]>([]);

  const rot = useRef({ x: 0.34, y: 0 });
  const target = useRef({ x: 0.34, y: 0 });
  const lastInteract = useRef(0);
  const drag = useRef({ active: false, x: 0, y: 0, moved: 0 });
  const pointerXY = useRef({ x: -1, y: -1, inside: false });
  /* Separate hover gate: when > -1 the auto-rotate branch is skipped this
     frame. Decoupled from `lastInteract` so the moment the cursor leaves a
     vertex, rotation resumes immediately (no 1.4s cooldown). */
  const hoverRef = useRef(-1);

  const [size, setSize] = useState(360);
  const [hover, setHover] = useState<{ idx: number; x: number; y: number } | null>(null);
  const [pings, setPings] = useState<number[]>([]);

  const data = useMemo(() => buildIcosphere(subdivisions), [subdivisions]);

  // resize observer
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      if (w > 1) setSize(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // animation loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastFrame = 0;
    let paused = document.hidden;
    /* Throttle to ~40fps. Visually indistinguishable from 60 for a slow
       drag-to-rotate icosphere, but cuts work by ~33%. */
    const FRAME_MS = 1000 / 40;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (paused) return;
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // ease toward target
      rot.current.x += (target.current.x - rot.current.x) * 0.12;
      rot.current.y += (target.current.y - rot.current.y) * 0.12;

      // resume auto-rotate after a short cooldown post drag/click. Hovering
      // a vertex pauses via hoverRef instead, so un-hover is instantaneous.
      if (hoverRef.current < 0 && now - lastInteract.current > 600) {
        target.current.y += dt * 0.18;
      }

      const cx = Math.cos(rot.current.x);
      const sx = Math.sin(rot.current.x);
      const cy = Math.cos(rot.current.y);
      const sy = Math.sin(rot.current.y);
      const R = size / 2 - 6;
      const c = size / 2;

      const projected = projectedRef.current;
      // ensure length
      if (projected.length !== data.verts.length) {
        projected.length = data.verts.length;
        for (let i = 0; i < data.verts.length; i++) projected[i] = { x: 0, y: 0, z: 0 };
      }

      for (let i = 0; i < data.verts.length; i++) {
        const v = data.verts[i];
        // rotateY then rotateX
        const x1 = v.x * cy + v.z * sy;
        const z1 = -v.x * sy + v.z * cy;
        const y2 = v.y * cx - z1 * sx;
        const z2 = v.y * sx + z1 * cx;
        projected[i].x = x1 * R + c;
        projected[i].y = -y2 * R + c;
        projected[i].z = z2;
      }

      // edges
      for (let i = 0; i < data.edges.length; i++) {
        const ln = lineRefs.current[i];
        if (!ln) continue;
        const a = projected[data.edges[i][0]];
        const b = projected[data.edges[i][1]];
        ln.setAttribute('x1', a.x.toFixed(1));
        ln.setAttribute('y1', a.y.toFixed(1));
        ln.setAttribute('x2', b.x.toFixed(1));
        ln.setAttribute('y2', b.y.toFixed(1));
        // back-face fade based on average z (front = positive z toward viewer)
        const avgZ = (a.z + b.z) * 0.5;
        const op = (avgZ + 1) * 0.5; // 0..1
        ln.setAttribute('stroke-opacity', (0.12 + op * 0.7).toFixed(2));
      }

      // verts (only the 12 named ones get circles for perf)
      for (let i = 0; i < 12; i++) {
        const d = dotRefs.current[i];
        if (!d) continue;
        const p = projected[i];
        d.setAttribute('cx', p.x.toFixed(1));
        d.setAttribute('cy', p.y.toFixed(1));
        const op = (p.z + 1) * 0.5;
        d.setAttribute('opacity', (0.25 + op * 0.75).toFixed(2));
        d.setAttribute('r', p.z > 0 ? '3.2' : '2.2');
      }

      // hover detection: nearest of 12 named vertices to pointer (front-facing only)
      if (pointerXY.current.inside) {
        let bestIdx = -1;
        let bestD2 = 14 * 14;
        const px = pointerXY.current.x;
        const py = pointerXY.current.y;
        for (let i = 0; i < 12; i++) {
          const p = projected[i];
          if (p.z < -0.1) continue;
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < bestD2) {
            bestD2 = d2;
            bestIdx = i;
          }
        }
        if (bestIdx >= 0) {
          // Pause auto-rotation via the hover gate (NOT lastInteract). target.y
          // stays frozen, rot lerps smoothly to a halt, and as soon as the
          // cursor leaves the vertex auto-rotate fires the very next frame.
          hoverRef.current = bestIdx;
          const p = projected[bestIdx];
          setHover((prev) =>
            prev && prev.idx === bestIdx
              ? prev
              : { idx: bestIdx, x: p.x, y: p.y }
          );
          // mark active dot
          for (let i = 0; i < 12; i++) {
            const d = dotRefs.current[i];
            if (!d) continue;
            d.classList.toggle('hot', i === bestIdx);
          }
        } else if (hoverRef.current >= 0) {
          hoverRef.current = -1;
          setHover(null);
          for (let i = 0; i < 12; i++) dotRefs.current[i]?.classList.remove('hot');
        }
      } else if (hoverRef.current >= 0) {
        hoverRef.current = -1;
        setHover(null);
        for (let i = 0; i < 12; i++) dotRefs.current[i]?.classList.remove('hot');
      }

    };
    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) last = performance.now();
    };
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // hover state intentionally omitted from deps (RAF reads through closure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, size]);

  // pointer handlers
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY, moved: 0 };
    lastInteract.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pointerXY.current.x = e.clientX - rect.left;
    pointerXY.current.y = e.clientY - rect.top;
    pointerXY.current.inside = true;
    if (drag.current.active) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      drag.current.moved += Math.abs(dx) + Math.abs(dy);
      target.current.y += dx * 0.006;
      target.current.x = Math.max(-1.2, Math.min(1.2, target.current.x + dy * 0.006));
      lastInteract.current = performance.now();
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const wasDrag = drag.current.moved > 4;
    drag.current.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    // After drag with pointer capture, native pointerleave may not fire.
    // Verify pointer is still inside; clear hover otherwise so the badge
    // doesn't stay stuck on a vertex the cursor is no longer near.
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointerXY.current.x = x;
    pointerXY.current.y = y;
    const stillInside =
      x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    pointerXY.current.inside = stillInside;
    if (!stillInside) clearHover();
    // click (no drag) → emit a ping
    if (!wasDrag) {
      const id = Date.now() + Math.random();
      setPings((arr) => [...arr, id]);
      window.setTimeout(() => setPings((arr) => arr.filter((x) => x !== id)), 820);
    }
  };
  /* Clear hover state synchronously so the tooltip cannot survive past the
     cursor leaving — previously this was deferred to the throttled RAF tick,
     which left a ghost badge on screen if the loop happened to be paused. */
  const clearHover = () => {
    hoverRef.current = -1;
    setHover(null);
    for (let i = 0; i < 12; i++) dotRefs.current[i]?.classList.remove('hot');
  };
  const onPointerLeave = () => {
    pointerXY.current.inside = false;
    clearHover();
  };
  const onPointerCancel = () => {
    drag.current.active = false;
    pointerXY.current.inside = false;
    clearHover();
  };

  // outer hex frame geometry (from -50..50 viewBox)
  const FRAME_R = 52;
  const hexPts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * FRAME_R, y: Math.sin(a) * FRAME_R };
  });
  const hexPolyPts = hexPts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

  return (
    <Stage
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
      role="img"
      aria-label="interactive backend reactor core"
    >
      {/* outer hex frame + decorative crosses (static) */}
      <FrameSvg viewBox="-60 -60 120 120">
        <circle className="ring" cx="0" cy="0" r="56" />
        <polygon className="ring" points={hexPolyPts} />
        {/* internal star-of-david style cross-lines through opposite vertices */}
        {[0, 1, 2].map((i) => {
          const p1 = hexPts[i];
          const p2 = hexPts[i + 3];
          return <line key={i} className="cross" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
        })}
        {/* a faint rotated inner hex */}
        <polygon
          className="ring"
          points={hexPolyPts}
          transform="rotate(30) scale(0.78)"
          opacity="0.55"
        />
        {/* corner vertex markers + labels */}
        {hexPts.map((p, i) => (
          <g key={i}>
            <circle className="vertex" cx={p.x} cy={p.y} r="1.6" />
            <text
              className="tag"
              x={p.x * 1.12}
              y={p.y * 1.12 + 1}
              textAnchor={p.x > 1 ? 'start' : p.x < -1 ? 'end' : 'middle'}
            >
              N{(i + 1).toString().padStart(2, '0')}
            </text>
          </g>
        ))}
      </FrameSvg>

      {/* the wireframe icosphere */}
      <SphereSvg viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="xMidYMid meet">
        <g>
          {data.edges.map((_, i) => (
            <line
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
            />
          ))}
        </g>
        <g>
          {/* only 12 named base vertices get visible dots */}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={i}
              className="vert named"
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
            />
          ))}
        </g>
      </SphereSvg>

      {/* central core sphere + click-pings */}
      <Core />
      {pings.map((id) => (
        <PingRing key={id} />
      ))}

      {/* hover badge */}
      {hover && (
        <NodeBadge $x={hover.x} $y={hover.y}>
          {NODE_LABELS[hover.idx]}
        </NodeBadge>
      )}

      <HintTag>▸ DRAG TO ROTATE · CLICK TO PING · HOVER NODES</HintTag>
    </Stage>
  );
}
