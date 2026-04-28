import styled, { keyframes } from 'styled-components';

const drift = keyframes`
  0%   { transform: translate3d(0,0,0) rotate(0deg); }
  50%  { transform: translate3d(-2%, 1%, 0) rotate(0.3deg); }
  100% { transform: translate3d(0,0,0) rotate(0deg); }
`;

const pulseRing = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.55; }
  50%      { transform: scale(1.08); opacity: 0.85; }
`;

const Wrap = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 50%, rgba(80, 20, 160, 0.18) 0%, rgba(20, 0, 40, 0) 35%, rgba(0,0,3,1) 70%),
    radial-gradient(circle at 80% 20%, rgba(120, 40, 220, 0.10) 0%, rgba(0,0,3,0) 40%),
    radial-gradient(circle at 15% 85%, rgba(140, 60, 240, 0.08) 0%, rgba(0,0,3,0) 45%),
    rgb(0, 0, 3);
`;

const Distortion = styled.div`
  position: absolute;
  inset: -10%;
  filter: blur(0.4px);
  animation: ${drift} 24s ease-in-out infinite;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(180, 80, 255, 0.04) 0 1px,
      transparent 1px 80px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(180, 80, 255, 0.04) 0 1px,
      transparent 1px 80px
    );
  mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 75%);
`;

const Ring = styled.div<{ $size: number; $duration: number; $delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  margin: -${(p) => p.$size / 2}px 0 0 -${(p) => p.$size / 2}px;
  border-radius: 50%;
  border: 1px solid rgba(180, 80, 255, 0.18);
  box-shadow: 0 0 60px rgba(180, 80, 255, 0.05) inset;
  animation: ${pulseRing} ${(p) => p.$duration}s ease-in-out ${(p) => p.$delay}s infinite;
`;

const Stars = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 12% 18%, rgba(220, 180, 255, 0.6), transparent 50%),
    radial-gradient(1px 1px at 72% 38%, rgba(220, 180, 255, 0.45), transparent 50%),
    radial-gradient(1px 1px at 28% 78%, rgba(220, 180, 255, 0.5), transparent 50%),
    radial-gradient(1.5px 1.5px at 88% 82%, rgba(220, 180, 255, 0.4), transparent 50%),
    radial-gradient(1px 1px at 50% 8%, rgba(220, 180, 255, 0.5), transparent 50%),
    radial-gradient(1px 1px at 92% 12%, rgba(220, 180, 255, 0.45), transparent 50%),
    radial-gradient(1px 1px at 6% 52%, rgba(220, 180, 255, 0.5), transparent 50%);
  opacity: 0.7;
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,3,0.85) 100%);
`;

export function BackgroundShader() {
  return (
    <Wrap aria-hidden>
      <Stars />
      <Distortion />
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="warpGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(180, 80, 255, 0.30)" />
            <stop offset="60%" stopColor="rgba(80, 20, 160, 0.10)" />
            <stop offset="100%" stopColor="rgba(0,0,3,0)" />
          </radialGradient>
          <filter id="warpTurb">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="5">
              <animate attributeName="baseFrequency" dur="22s" values="0.010;0.018;0.010" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="22" />
          </filter>
        </defs>
        <g filter="url(#warpTurb)">
          <circle cx="500" cy="500" r="460" fill="url(#warpGrad)" />
          <circle cx="500" cy="500" r="320" fill="none" stroke="rgba(180, 80, 255, 0.10)" strokeWidth="1" />
          <circle cx="500" cy="500" r="220" fill="none" stroke="rgba(180, 80, 255, 0.14)" strokeWidth="1" />
        </g>
      </svg>
      <Ring $size={320} $duration={6} $delay={0} />
      <Ring $size={520} $duration={8} $delay={0.4} />
      <Ring $size={780} $duration={10} $delay={0.8} />
      <Vignette />
    </Wrap>
  );
}
