import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotateX(20deg) rotateY(0deg); }
  to   { transform: rotateX(20deg) rotateY(360deg); }
`;

const counterSpin = keyframes`
  from { transform: rotateX(20deg) rotateY(0deg); }
  to   { transform: rotateX(20deg) rotateY(-360deg); }
`;

const corePulse = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1);    filter: brightness(1); }
  50%      { transform: translate(-50%, -50%) scale(1.04); filter: brightness(1.25); }
`;

const Stage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  perspective: 1200px;
`;

const Globe = styled.div<{ $reverse?: boolean }>`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: ${(p) => (p.$reverse ? counterSpin : spin)} 38s linear infinite;
  pointer-events: none;
`;

const Meridian = styled.div<{ $angle: number }>`
  position: absolute;
  inset: 0;
  border: 1px solid rgba(180, 80, 255, 0.42);
  border-radius: 50%;
  transform: rotateY(${(p) => p.$angle}deg);
  box-shadow:
    0 0 14px rgba(180, 80, 255, 0.18),
    inset 0 0 14px rgba(180, 80, 255, 0.08);
`;

const Parallel = styled.div<{ $size: number; $ty: number }>`
  position: absolute;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  left: 50%;
  top: 50%;
  margin-left: ${(p) => -p.$size / 2}px;
  margin-top: ${(p) => -p.$size / 2}px;
  border: 1px solid rgba(180, 80, 255, 0.42);
  border-radius: 50%;
  transform: rotateX(90deg) translateZ(${(p) => p.$ty}px);
  box-shadow: 0 0 10px rgba(180, 80, 255, 0.18);
`;

const Axis = styled.div`
  position: absolute;
  left: 50%;
  top: -4%;
  bottom: -4%;
  width: 1px;
  margin-left: -0.5px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(220, 170, 255, 0.7) 12%,
    rgba(180, 80, 255, 0.55) 50%,
    rgba(220, 170, 255, 0.7) 88%,
    transparent 100%
  );
  transform: rotateZ(-20deg);
  filter: drop-shadow(0 0 4px rgba(180, 80, 255, 0.7));
`;

const Pole = styled.div<{ $top?: boolean }>`
  position: absolute;
  left: 50%;
  ${(p) => (p.$top ? 'top: -4%;' : 'bottom: -4%;')}
  width: 6px;
  height: 6px;
  margin-left: -3px;
  border-radius: 50%;
  background: rgb(220, 170, 255);
  box-shadow: 0 0 10px rgba(180, 80, 255, 0.95);
`;

const Lattice = styled.div`
  position: absolute;
  inset: -22%;
  pointer-events: none;
  opacity: 0.35;
  background-image:
    /* hexagonal-ish lattice via two layered repeating-linear-gradients */
    repeating-linear-gradient(60deg,
      rgba(180, 80, 255, 0.18) 0 1px,
      transparent 1px 36px),
    repeating-linear-gradient(-60deg,
      rgba(180, 80, 255, 0.18) 0 1px,
      transparent 1px 36px),
    repeating-linear-gradient(0deg,
      rgba(180, 80, 255, 0.10) 0 1px,
      transparent 1px 36px);
  mask-image: radial-gradient(circle at 50% 50%, black 25%, rgba(0,0,0,0.55) 55%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, black 25%, rgba(0,0,0,0.55) 55%, transparent 80%);
`;

const Halo = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 86%;
  height: 86%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(180, 80, 255, 0.35) 0%,
    rgba(180, 80, 255, 0.10) 30%,
    rgba(180, 80, 255, 0.0) 60%
  );
  filter: blur(6px);
  pointer-events: none;
`;

const Core = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 18%;
  height: 18%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 35% 32%,
      rgba(255, 240, 255, 0.95) 0%,
      rgba(220, 170, 255, 0.85) 18%,
      rgba(180, 80, 255, 0.7) 45%,
      rgba(80, 20, 160, 0.5) 80%
    );
  box-shadow:
    0 0 26px rgba(180, 80, 255, 0.85),
    0 0 80px rgba(180, 80, 255, 0.4),
    inset 0 0 14px rgba(220, 170, 255, 0.5);
  animation: ${corePulse} 3.2s ease-in-out infinite;
`;

interface Props {
  meridianCount?: number;
  parallelLatitudes?: number[];
}

/**
 * 3D wireframe globe built with CSS preserve-3d.
 * - Two counter-rotating wireframe shells for depth.
 * - Static parallels (latitude rings).
 * - Hex lattice background + soft halo + glowing core.
 * Sizing is measured at runtime so translateZ values stay correct on resize.
 */
export function WireframeGlobe({
  meridianCount = 12,
  parallelLatitudes = [-72, -52, -32, -14, 14, 32, 52, 72],
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(340);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && Math.abs(w - size) > 1) setSize(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  const R = size / 2;

  const meridians = useMemo(
    () =>
      Array.from({ length: meridianCount }, (_, i) => (i * 180) / meridianCount),
    [meridianCount]
  );

  const parallels = useMemo(
    () =>
      parallelLatitudes.map((lat) => {
        const rad = (lat * Math.PI) / 180;
        const radius = R * Math.cos(rad);
        const ty = -R * Math.sin(rad); // negative => higher up the screen
        return { lat, size: radius * 2, ty };
      }),
    [parallelLatitudes, R]
  );

  return (
    <Stage ref={stageRef} aria-hidden>
      <Lattice />
      <Halo />

      <Globe>
        {meridians.map((angle) => (
          <Meridian key={`m-${angle}`} $angle={angle} />
        ))}
        {parallels.map((p) => (
          <Parallel key={`p-${p.lat}`} $size={p.size} $ty={p.ty} />
        ))}
      </Globe>

      <Globe $reverse>
        {meridians.map((angle) => (
          <Meridian key={`m2-${angle}`} $angle={angle + 90 / meridianCount} />
        ))}
      </Globe>

      <Axis />
      <Pole $top />
      <Pole />
      <Core />
    </Stage>
  );
}
