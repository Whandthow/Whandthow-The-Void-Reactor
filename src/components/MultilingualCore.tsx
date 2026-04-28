import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { WireframeGlobe } from './WireframeGlobe';

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: none;
`;

const Stage = styled.div`
  position: relative;
  width: clamp(260px, 30vw, 380px);
  aspect-ratio: 1;
`;

const TextBlock = styled.div`
  position: relative;
  margin-top: 22px;
  text-align: center;
  pointer-events: auto;
`;

const Name = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0.32em;
  font-size: 14px;
  color: rgb(220, 200, 255);
  text-shadow: 0 0 12px rgba(180, 80, 255, 0.65);
`;

const Sub = styled.div`
  margin-top: 6px;
  font-size: 10px;
  letter-spacing: 0.32em;
  color: rgba(180, 80, 255, 0.85);
  text-transform: uppercase;
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
`;

const StabValue = styled.span`
  color: rgb(180, 80, 255);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 8px rgba(180, 80, 255, 0.7);
`;

export function MultilingualCore() {
  const [stability, setStability] = useState(98.7);
  const tickRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      const wave = Math.sin(tickRef.current / 6) * 0.6 + (Math.random() - 0.5) * 0.4;
      const next = 98.5 + wave;
      setStability(Number(next.toFixed(2)));
    }, 420);
    return () => clearInterval(id);
  }, []);

  return (
    <Wrap aria-label="multilingual core">
      <Stage>
        <WireframeGlobe />
      </Stage>

      <TextBlock>
        <Name>ALEX WHANDTHOW // BACKEND POLIGLOT ENGINEER</Name>
        <Sub>Orchestrating high-stability multilingual cores</Sub>
        <StabilityRow>
          CORE_STABILITY:&nbsp;<StabValue>{stability.toFixed(2)}%</StabValue>
        </StabilityRow>
      </TextBlock>
    </Wrap>
  );
}
