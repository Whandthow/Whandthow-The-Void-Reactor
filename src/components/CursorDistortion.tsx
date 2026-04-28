import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Layer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
`;

/**
 * The visible cursor + distortion field.
 * - dot: tiny pulsing core
 * - ring: 50px-radius "spacetime distortion" — a radial purple field
 *         with backdrop-filter that bends the imagery underneath.
 * - cross: micro reticle
 */
const Reticle = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  margin-left: -14px;
  margin-top: -14px;
  border: 1px solid rgba(180, 80, 255, 0.7);
  transform: rotate(45deg);
  mix-blend-mode: screen;
`;

const Dot = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  margin-top: -3px;
  border-radius: 50%;
  background: rgb(220, 170, 255);
  box-shadow: 0 0 8px rgba(180, 80, 255, 0.95);
`;

const DistortionField = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(180, 80, 255, 0.18) 0%, rgba(180, 80, 255, 0.06) 45%, transparent 70%);
  /* the actual visual distortion */
  backdrop-filter: blur(1.2px) hue-rotate(8deg) saturate(1.4);
  -webkit-backdrop-filter: blur(1.2px) hue-rotate(8deg) saturate(1.4);
  mix-blend-mode: screen;
`;

const TrailDot = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  margin-left: -1.5px;
  margin-top: -1.5px;
  border-radius: 50%;
  background: rgba(180, 80, 255, 0.6);
  box-shadow: 0 0 6px rgba(180, 80, 255, 0.6);
`;

const TRAIL = 8;

export function CursorDistortion() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trail = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }))
  );
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      // shift trail
      for (let i = trail.current.length - 1; i > 0; i--) {
        trail.current[i].x = trail.current[i - 1].x;
        trail.current[i].y = trail.current[i - 1].y;
      }
      // smooth lerp leader
      const head = trail.current[0];
      head.x += (target.current.x - head.x) * 0.32;
      head.y += (target.current.y - head.y) * 0.32;

      const x = head.x.toFixed(1);
      const y = head.y.toFixed(1);
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (reticleRef.current) reticleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(45deg)`;
      if (fieldRef.current) fieldRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = trail.current[i];
        el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0)`;
        el.style.opacity = String(1 - i / TRAIL);
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

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
