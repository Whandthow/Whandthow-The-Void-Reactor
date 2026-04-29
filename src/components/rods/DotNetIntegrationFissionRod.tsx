import styled, { keyframes } from 'styled-components';
import { useResonance } from '../../context/ResonanceContext';

const burst = keyframes`
  0%, 88%, 100% { opacity: 0.45; transform: scale(1); }
  90%           { opacity: 1;    transform: scale(1.18); }
  92%           { opacity: 0.6;  transform: scale(1.05); }
  94%           { opacity: 1;    transform: scale(1.12); }
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
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
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
  margin-top: 4px;

  @media (max-width: 720px) {
    grid-template-columns: 50px 1fr;
  }
`;

const StackBox = styled.div`
  position: relative;
  width: 60px;
  height: 116px;
  border: 1px solid rgba(180, 80, 255, 0.4);
  background: rgba(0, 0, 3, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 720px) {
    width: 50px;
    height: 92px;
  }
`;

const Crystal = styled.svg`
  width: 100%;
  height: 100%;
  & .core {
    fill: rgba(180, 80, 255, 0.18);
    stroke: rgb(180, 80, 255);
    stroke-width: 1.2;
    filter: drop-shadow(0 0 6px rgba(180, 80, 255, 0.7));
    animation: ${burst} 2.6s ease-in-out infinite;
    transform-origin: 30px 58px;
  }
  & .facet {
    fill: none;
    stroke: rgba(220, 170, 255, 0.55);
    stroke-width: 0.6;
  }
  & .center {
    fill: rgb(220, 170, 255);
    filter: drop-shadow(0 0 6px rgba(220, 170, 255, 0.9));
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

  @media (max-width: 720px) {
    font-size: 20px;
  }
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

export function DotNetIntegrationFissionRod({ enrichment }: Props) {
  const { activeLang, setActiveLang } = useResonance();
  const active = activeLang === 'C#';

  return (
    <Frame
      $active={active}
      onMouseEnter={() => setActiveLang('C#')}
      onMouseLeave={() => setActiveLang(null)}
      onClick={() => setActiveLang(active ? null : 'C#')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveLang(active ? null : 'C#');
        }
      }}
      aria-pressed={active}
      aria-label="C# fuel rod"
    >
      <Tag>
        <span>// FR-03</span>
        <span>C# // FUEL TYPE: HIGH-PERFORMANCE INTEGRATION</span>
      </Tag>
      <Title>C#</Title>
      <Column>
        <StackBox>
          <Crystal viewBox="0 0 60 116" preserveAspectRatio="none">
            <polygon className="core" points="30,12 52,32 52,84 30,104 8,84 8,32" />
            <polygon className="facet" points="30,12 30,104 52,84 52,32" />
            <polygon className="facet" points="30,12 30,104 8,84 8,32" />
            <line className="facet" x1="8" y1="32" x2="52" y2="84" />
            <line className="facet" x1="52" y1="32" x2="8" y2="84" />
            <circle className="center" cx="30" cy="58" r="3" />
          </Crystal>
        </StackBox>
        <Meta>
          <Big>{enrichment}%</Big>
          <div>KESTREL::COMPILE</div>
          <Bar>
            <Fill $w={enrichment} />
          </Bar>
          <div>JIT // OPTIMIZED</div>
        </Meta>
      </Column>
    </Frame>
  );
}
