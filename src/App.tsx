import { lazy, Suspense, useState } from 'react';
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
import { ResonanceProvider, useResonance } from './context/ResonanceContext';
import type { Repository } from './types';

/* Code-split: the git-graph modal is only needed when the user opens a repo,
   so we don't ship it in the initial bundle. */
const ProjectGitGraphModal = lazy(() =>
  import('./components/ProjectGitGraphModal').then((m) => ({ default: m.ProjectGitGraphModal })),
);

const Shell = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: 100%;
  padding: 84px 24px 28px; /* below browser chrome (32) + header (36) + gap */
  display: flex;
  flex-direction: column;

  @media (max-width: 1180px) {
    padding: 80px 16px 22px;
  }
  @media (max-width: 720px) {
    /* mobile chrome shrinks to 28+32 = 60, plus 12px gap */
    padding: 72px 10px 18px;
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

  @media (max-width: 720px) {
    flex-direction: column;
    gap: 6px;
    text-align: center;
    letter-spacing: 0.2em;
    font-size: 8.5px;
    margin-top: 14px;
    padding: 8px 4px 0;
  }
`;

const GridLayout = styled.main`
  display: grid;
  grid-template-areas:
    'tl center tr'
    'bl center br';
  grid-template-columns: 1fr minmax(320px, 1fr) 1fr;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  position: relative;
  min-height: 720px; /* whole dashboard fits 1 viewport on tall screens, scrolls on short */

  & > .center {
    grid-area: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }

  /* Tablet: 2 columns, center spans full width */
  @media (max-width: 1180px) {
    grid-template-areas:
      'tl tr'
      'center center'
      'bl br';
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(320px, auto) minmax(320px, auto) minmax(320px, auto);
    min-height: 0;
    gap: 14px;

    & > .center { min-height: 320px; }
  }

  /* Phone: single column, hero core first, then panels in narrative order:
     1. core (identity)
     2. tl   (skills / fuel rods)
     3. tr   (projects graph)
     4. bl   (activity monitor)
     5. br   (contact channels) */
  @media (max-width: 720px) {
    grid-template-areas:
      'center'
      'tl'
      'tr'
      'bl'
      'br';
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 12px;

    & > .center { min-height: 320px; }
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
      {openRepo && (
        <Suspense fallback={null}>
          <ProjectGitGraphModal repo={openRepo} onClose={onClose} />
        </Suspense>
      )}
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
