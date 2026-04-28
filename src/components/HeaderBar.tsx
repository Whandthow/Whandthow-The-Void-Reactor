import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const Bar = styled.header`
  position: fixed;
  top: 32px;
  left: 0;
  right: 0;
  height: 36px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  background: rgba(0, 0, 3, 0.9);
  border-bottom: 1px solid rgba(180, 80, 255, 0.25);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(220, 200, 255, 0.85);
  clip-path: polygon(
    0 0, 100% 0,
    100% calc(100% - 6px), calc(100% - 18px) 100%,
    18px 100%, 0 calc(100% - 6px)
  );
`;

const Brand = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  color: rgb(180, 80, 255);
  text-shadow: 0 0 8px rgba(180, 80, 255, 0.7);
  letter-spacing: 0.32em;
`;

const Sep = styled.span`
  color: rgba(180, 80, 255, 0.4);
`;

const Pill = styled.div<{ $live?: boolean }>`
  border: 1px solid rgba(180, 80, 255, 0.4);
  padding: 3px 10px;
  border-radius: 1px;
  background: rgba(20, 0, 40, 0.6);
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    background: ${(p) => (p.$live ? 'rgb(180, 80, 255)' : 'rgba(180, 80, 255, 0.5)')};
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(180, 80, 255, 0.9);
    animation: ${blink} 1.4s ease-in-out infinite;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const Time = styled.div`
  font-variant-numeric: tabular-nums;
  color: rgba(180, 80, 255, 0.85);
`;

import { useEffect, useState } from 'react';

export function HeaderBar() {
  const [time, setTime] = useState(() => new Date().toISOString().slice(11, 19));
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toISOString().slice(11, 19)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Bar>
      <Brand>WHANDTHOW</Brand>
      <Sep>//</Sep>
      <Pill>OPERATOR ID: 001</Pill>
      <Sep>//</Sep>
      <Pill $live>SYNTHESIS STATUS: STABLE</Pill>
      <Sep>//</Sep>
      <Pill>POLIGLOT CORE</Pill>
      <Spacer />
      <Time>UTC {time}</Time>
    </Bar>
  );
}
