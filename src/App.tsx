import { useState } from 'react';
import styled from 'styled-components';
import { BackgroundShader } from './components/BackgroundShader';
import { BrowserChrome } from './components/BrowserChrome';
import { HeaderBar } from './components/HeaderBar';
import { MultilingualCore } from './components/MultilingualCore';
import { PolyglotFuelReactor } from './components/PolyglotFuelReactor';
import { ProjectReactionGraph } from './components/ProjectReactionGraph';
import { ActivityMonitorTerminal } from './components/ActivityMonitorTerminal';
import { ContactEmergencyPanel } from './components/ContactEmergencyPanel';
import { CursorDistortion } from './components/CursorDistortion';
import { ProjectGitGraphModal } from './components/ProjectGitGraphModal';
import { ResonanceProvider, useResonance } from './context/ResonanceContext';
import type { Repository } from './types';

const Shell = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: 100%;
  padding: 84px 24px 28px; /* below browser chrome (32) + header (36) + gap */
  display: flex;
  flex-direction: column;
`;

const Grid = styled.main`
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr minmax(360px, 1fr) 1fr;
  grid-template-rows: minmax(340px, 1fr) minmax(340px, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div<{ $area: string }>`
  grid-area: ${(p) => p.$area};
  min-height: 0;
  display: flex;
`;

const TopLeft = styled(Cell).attrs({ $area: 'tl' })``;
const TopRight = styled(Cell).attrs({ $area: 'tr' })``;
const BottomLeft = styled(Cell).attrs({ $area: 'bl' })``;
const BottomRight = styled(Cell).attrs({ $area: 'br' })``;

const Center = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
`;

const ConnectorSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.55;
`;

const Footer = styled.footer`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(180, 80, 255, 0.55);
  padding: 10px 4px 0;
  border-top: 1px dashed rgba(180, 80, 255, 0.2);
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-areas:
    'tl center tr'
    'bl center br';
  grid-template-columns: 1fr minmax(360px, 1.05fr) 1fr;
  grid-template-rows: minmax(340px, 1fr) minmax(340px, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  position: relative;

  & > .center {
    grid-area: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 1100px) {
    grid-template-areas:
      'tl tr'
      'center center'
      'bl br';
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 360px auto;

    & > .center { min-height: 360px; }
  }
  @media (max-width: 720px) {
    grid-template-areas:
      'tl'
      'center'
      'tr'
      'bl'
      'br';
    grid-template-columns: 1fr;
  }
`;

function AppInner() {
  const [openRepo, setOpenRepo] = useState<Repository | null>(null);
  const { setSelectedRepo } = useResonance();

  const onSelect = (r: Repository) => {
    setSelectedRepo(r);
    setOpenRepo(r);
  };
  const onClose = () => {
    setSelectedRepo(null);
    setOpenRepo(null);
  };

  return (
    <>
      <BackgroundShader />
      <BrowserChrome />
      <HeaderBar />
      <Shell>
        <GridLayout>
          {/* connector lattice between center core and corners */}
          <ConnectorSvg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <line x1="50" y1="50" x2="0"   y2="0"   stroke="rgba(180, 80, 255, 0.35)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
            <line x1="50" y1="50" x2="100" y2="0"   stroke="rgba(180, 80, 255, 0.35)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
            <line x1="50" y1="50" x2="0"   y2="100" stroke="rgba(180, 80, 255, 0.35)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
            <line x1="50" y1="50" x2="100" y2="100" stroke="rgba(180, 80, 255, 0.35)" strokeWidth="0.18" strokeDasharray="0.6 0.8" />
          </ConnectorSvg>

          <TopLeft><PolyglotFuelReactor /></TopLeft>
          <TopRight><ProjectReactionGraph onSelect={onSelect} /></TopRight>
          <div className="center"><MultilingualCore /></div>
          <BottomLeft><ActivityMonitorTerminal /></BottomLeft>
          <BottomRight><ContactEmergencyPanel /></BottomRight>
        </GridLayout>

        <Footer>
          <span>// WHANDTHOW // FISSION SYNTHESIZER ::: VOID REACTOR v0.1.21</span>
          <span>BUILD: STABLE · DATA: GITHUB-MOCK · UI: STYLED-COMPONENTS</span>
        </Footer>
      </Shell>

      <CursorDistortion />
      {openRepo && <ProjectGitGraphModal repo={openRepo} onClose={onClose} />}
    </>
  );
}

export default function App() {
  return (
    <ResonanceProvider>
      <AppInner />
    </ResonanceProvider>
  );
}
