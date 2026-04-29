import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Layer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  
  contain: layout paint style;
`;

const Reticle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  margin-left: -14px;
  margin-top: -14px;
  border: 1px solid rgba(180, 80, 255, 0.7);
  mix-blend-mode: screen;
  will-change: transform;
`;

const Dot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  margin-top: -3px;
  border-radius: 50%;
  background: rgb(220, 170, 255);
  box-shadow: 0 0 8px rgba(180, 80, 255, 0.95);
  will-change: transform;
`;

const DistortionField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 90px;
  height: 90px;
  margin-left: -45px;
  margin-top: -45px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(180, 80, 255, 0.22) 0%,
    rgba(180, 80, 255, 0.07) 45%,
    transparent 70%
  );
  mix-blend-mode: screen;
  will-change: transform;
`;

const TrailDot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 3px;
  margin-left: -1.5px;
  margin-top: -1.5px;
  border-radius: 50%;
  background: rgba(180, 80, 255, 0.6);
  box-shadow: 0 0 6px rgba(180, 80, 255, 0.6);
  will-change: transform, opacity;
`;

const TRAIL = 5;

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

export function CursorDistortion() {
  const [enabled] = useState(() => !isCoarsePointer());

  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const target = useRef({ x: -100, y: -100 });
  const trail = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      target.current.x = x;
      target.current.y = y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(45deg)`;
      }
      if (fieldRef.current) {
        fieldRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let idleFrames = 0;
    const SLEEP_AFTER = 30; 
    const loop = () => {
      const tx = target.current.x;
      const ty = target.current.y;

      for (let i = trail.current.length - 1; i > 0; i--) {
        trail.current[i].x = trail.current[i - 1].x;
        trail.current[i].y = trail.current[i - 1].y;
      }
      const head = trail.current[0];
      const prevX = head.x;
      const prevY = head.y;
      head.x += (tx - head.x) * 0.55;
      head.y += (ty - head.y) * 0.55;

      for (let i = 0; i < trail.current.length; i++) {
        const el = trailRefs.current[i];
        if (!el) continue;
        const t = trail.current[i];
        el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0)`;
        el.style.opacity = String(1 - i / TRAIL);
      }

      const moved =
        Math.abs(prevX - head.x) + Math.abs(prevY - head.y) > 0.1 ||
        Math.abs(head.x - tx) + Math.abs(head.y - ty) > 0.5;
      idleFrames = moved ? 0 : idleFrames + 1;
      if (idleFrames < SLEEP_AFTER) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const wake = () => {
      if (raf === 0) {
        idleFrames = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    window.addEventListener('pointermove', wake, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', wake);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Layer aria-hidden>
      <DistortionField ref={fieldRef} />
      {Array.from({ length: TRAIL }, (_, i) => (
        <TrailDot
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
        />
      ))}
      <Reticle ref={reticleRef} />
      <Dot ref={dotRef} />
    </Layer>
  );
}
