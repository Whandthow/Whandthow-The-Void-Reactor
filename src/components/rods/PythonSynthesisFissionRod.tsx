import styled, { keyframes } from 'styled-components';
import { useResonance } from '../../context/ResonanceContext';

const flow = keyframes`
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -200; }
`;

const fastPulse = keyframes`
  0%, 100% { opacity: .55; }
  50%      { opacity: 1;   }
`;

const Frame = styled.div<{ $active: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px 12px;
  border: 1px solid ${(p) => (p.$active ? 'rgb(180, 80, 255)' : 'rgba(180, 80, 255, 0.45)')};
  background: linear-gradient(180deg, rgba(20, 0, 40, 0.7), rgba(8, 0, 20, 0.85));
  box-shadow: ${(p) => (p.$active ? '0 0 28px rgba(180, 80, 255, 0.45)' : 'none')};
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
`;

const Tag = styled.div`
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180, 80, 255, 0.9);
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.28em;
  font-size: 13px;
  color: rgb(220, 200, 255);
  text-shadow: 0 0 6px rgba(180, 80, 255, 0.6);
`;

const Column = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 10px;
  align-items: stretch;
  margin-top: 4px;
`;

const StackBox = styled.div`
  position: relative;
  width: 60px;
  height: 116px;
  border: 1px solid rgba(180, 80, 255, 0.4);
  background: rgba(0, 0, 3, 0.6);
  overflow: hidden;
`;

const Snake = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  & path {
    fill: none;
    stroke: rgba(180, 80, 255, 0.95);
    stroke-width: 2.4;
    stroke-linecap: round;
    filter: drop-shadow(0 0 4px rgba(180, 80, 255, 0.8));
    stroke-dasharray: 6 8;
    animation: ${flow} 1.6s linear infinite;
  }
  & path.ghost {
    stroke: rgba(180, 80, 255, 0.25);
    stroke-dasharray: none;
    animation: none;
    filter: none;
  }
  & circle {
    fill: rgb(220, 170, 255);
    animation: ${fastPulse} .8s ease-in-out infinite;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgba(220, 200, 255, 0.7);
`;

const Big = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 22px;
  color: rgb(180, 80, 255);
  text-shadow: 0 0 8px rgba(180, 80, 255, 0.8);
`;

const Bar = styled.div`
  height: 4px;
  background: rgba(180, 80, 255, 0.15);
  position: relative;
  overflow: hidden;
`;

const Fill = styled.div<{ $w: number }>`
  position: absolute;
  inset: 0;
  width: ${(p) => p.$w}%;
  background: linear-gradient(90deg, rgba(180, 80, 255, 0.7), rgb(180, 80, 255));
  box-shadow: 0 0 8px rgba(180, 80, 255, 0.7);
`;

interface Props {
  enrichment: number;
}

// Build a vertical sinusoidal path
function buildSnakePath(width: number, height: number, amp: number, freq: number) {
  const cx = width / 2;
  const steps = 60;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * height;
    const x = cx + Math.sin(t * Math.PI * freq) * amp;
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export function PythonSynthesisFissionRod({ enrichment }: Props) {
  const { activeLang, setActiveLang } = useResonance();
  const active = activeLang === 'Python';
  const path = buildSnakePath(60, 116, 14, 4);

  return (
    <Frame
      $active={active}
      onMouseEnter={() => setActiveLang('Python')}
      onMouseLeave={() => setActiveLang(null)}
      aria-label="Python fuel rod"
    >
      <Tag>
        <span>// FR-02</span>
        <span>PYTHON // FUEL TYPE: RAPID DEPLOYMENT</span>
      </Tag>
      <Title>PYTHON</Title>
      <Column>
        <StackBox>
          <Snake viewBox="0 0 60 116" preserveAspectRatio="none">
            <path className="ghost" d={path} />
            <path d={path} />
            <circle cx="30" cy="14" r="2.6" />
            <circle cx="30" cy="58" r="2.6" />
            <circle cx="30" cy="102" r="2.6" />
          </Snake>
        </StackBox>
        <Meta>
          <Big>{enrichment}%</Big>
          <div>ASYNCIO::FLUX</div>
          <Bar>
            <Fill $w={enrichment} />
          </Bar>
          <div>EVENT_LOOP // RUNNING</div>
        </Meta>
      </Column>
    </Frame>
  );
}
