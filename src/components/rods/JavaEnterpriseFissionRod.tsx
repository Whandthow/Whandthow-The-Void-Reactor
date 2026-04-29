import styled, { keyframes } from 'styled-components';
import { useResonance } from '../../context/ResonanceContext';

const slowPulse = keyframes`
  0%, 100% { opacity: 0.55; transform: scaleY(1); }
  50%      { opacity: 1;    transform: scaleY(1.04); }
`;

const Frame = styled.div<{ $active: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px 12px;
  border: 1px solid ${(p) => (p.$active ? 'rgb(180, 80, 255)' : 'rgba(180, 80, 255, 0.45)')};
  background:
    linear-gradient(180deg, rgba(20, 0, 40, 0.7), rgba(8, 0, 20, 0.85));
  box-shadow: ${(p) => (p.$active ? '0 0 28px rgba(180, 80, 255, 0.45)' : 'none')};
  transition: border-color .2s, box-shadow .2s;
  cursor: pointer;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
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
  position: relative;
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 8px;
  align-items: stretch;
  margin-top: 4px;

  @media (max-width: 720px) {
    grid-template-columns: 34px 1fr;
    gap: 10px;
  }
`;

const Stack = styled.div<{ $enrichment: number }>`
  position: relative;
  width: 38px;
  height: 116px;
  background: rgba(0, 0, 3, 0.6);
  border: 1px solid rgba(180, 80, 255, 0.4);
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  padding: 3px;
  overflow: hidden;

  @media (max-width: 720px) {
    height: 92px;
    width: 34px;
  }
`;

const Segment = styled.div<{ $i: number }>`
  height: 8px;
  background: linear-gradient(90deg, rgba(180, 80, 255, 0.5), rgba(220, 170, 255, 0.9), rgba(180, 80, 255, 0.5));
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: ${slowPulse} 4.6s ease-in-out infinite;
  animation-delay: ${(p) => p.$i * 0.18}s;
  transform-origin: center;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgba(220, 200, 255, 0.7);
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

interface Props {
  enrichment: number;
}

export function JavaEnterpriseFissionRod({ enrichment }: Props) {
  const { activeLang, setActiveLang } = useResonance();
  const active = activeLang === 'Java';

  const segmentsCount = Math.max(4, Math.round(enrichment / 6));
  const segments = Array.from({ length: segmentsCount }, (_, i) => i);

  return (
    <Frame
      $active={active}
      onMouseEnter={() => setActiveLang('Java')}
      onMouseLeave={() => setActiveLang(null)}
      onClick={() => setActiveLang(active ? null : 'Java')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveLang(active ? null : 'Java');
        }
      }}
      aria-pressed={active}
      aria-label="Java fuel rod"
    >
      <Tag>
        <span>// FR-01</span>
        <span>JAVA // FUEL TYPE: HIGH-AVAILABILITY</span>
      </Tag>
      <Title>JAVA</Title>
      <Column>
        <Stack $enrichment={enrichment}>
          {segments.map((i) => (
            <Segment key={i} $i={i} />
          ))}
        </Stack>
        <Meta>
          <Big>{enrichment}%</Big>
          <div>CLASS::ENRICHMENT</div>
          <Bar>
            <Fill $w={enrichment} />
          </Bar>
          <div>JVM_HEAP // STABLE</div>
        </Meta>
      </Column>
    </Frame>
  );
}
