import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IcosphereCore } from './IcosphereCore';

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Stage = styled.div`
  position: relative;
  width: clamp(260px, 30vw, 380px);
  aspect-ratio: 1;
  pointer-events: auto;

  @media (max-width: 720px) {
    
    width: min(72vw, 280px);
  }
`;

const TextBlock = styled.div`
  position: relative;
  margin-top: 22px;
  text-align: center;
  pointer-events: auto;
  padding: 0 8px;

  @media (max-width: 720px) {
    margin-top: 14px;
  }
`;

const Name = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0.32em;
  font-size: 14px;
  color: rgb(220, 200, 255);
  text-shadow: 0 0 12px rgba(180, 80, 255, 0.65);

  @media (max-width: 720px) {
    font-size: 12px;
    letter-spacing: 0.22em;
    line-height: 1.4;
  }
`;

const Sub = styled.div`
  margin-top: 6px;
  font-size: 10px;
  letter-spacing: 0.32em;
  color: rgba(180, 80, 255, 0.85);
  text-transform: uppercase;

  @media (max-width: 720px) {
    font-size: 9px;
    letter-spacing: 0.18em;
  }
`;

const StabilityRow = styled.div`
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px;
  border: 1px solid rgba(180, 80, 255, 0.4);
  background: rgba(20, 0, 40, 0.7);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(220, 200, 255, 0.85);
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%);

  @media (max-width: 720px) {
    margin-top: 10px;
    font-size: 9px;
    letter-spacing: 0.16em;
    padding: 4px 10px;
  }
`;

const StabValue = styled.span`
  color: rgb(180, 80, 255);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 8px rgba(180, 80, 255, 0.7);
`;

function StabilityTicker() {
  const [stability, setStability] = useState(98.7);
  const tickRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      const wave = Math.sin(tickRef.current / 6) * 0.6 + (Math.random() - 0.5) * 0.4;
      const next = 98.5 + wave;
      setStability(Number(next.toFixed(2)));
    }, 1000); 
    return () => clearInterval(id);
  }, []);

  return <StabValue>{stability.toFixed(2)}%</StabValue>;
}

function useLowPower(): boolean {
  const [low, setLow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia?.('(hover: none) and (pointer: coarse)').matches ||
      window.innerWidth < 720
    );
  });
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const handler = () => setLow(mq.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return low;
}

export function MultilingualCore() {
  const lowPower = useLowPower();
  return (
    <Wrap aria-label="multilingual core">
      <Stage>
        <IcosphereCore subdivisions={lowPower ? 0 : 1} />
      </Stage>

      <TextBlock>
        <Name>WHANDTHOW // BACKEND POLIGLOT ENGINEER</Name>
        <Sub>Orchestrating high-stability multilingual cores</Sub>
        <StabilityRow>
          CORE_STABILITY:&nbsp;<StabilityTicker />
        </StabilityRow>
      </TextBlock>
    </Wrap>
  );
}
