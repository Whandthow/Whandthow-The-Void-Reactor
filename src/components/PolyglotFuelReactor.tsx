import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Panel, PanelBody, PanelHeader, PanelTag, PanelTitle } from './Panel';
import { JavaEnterpriseFissionRod } from './rods/JavaEnterpriseFissionRod';
import { PythonSynthesisFissionRod } from './rods/PythonSynthesisFissionRod';
import { DotNetIntegrationFissionRod } from './rods/DotNetIntegrationFissionRod';
import { fetchLanguages } from '../data/mockApi';
import type { LanguageEnrichment } from '../types';

const RodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  align-items: stretch;
`;

const Footer = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ProjectionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: rgba(180, 80, 255, 0.7);
  text-transform: uppercase;
`;

const Icon = styled.div`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(180, 80, 255, 0.45);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 9px;
  color: rgb(220, 170, 255);
  background: rgba(20, 0, 40, 0.7);
  text-shadow: 0 0 6px rgba(180, 80, 255, 0.6);
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
`;

export function PolyglotFuelReactor() {
  const [langs, setLangs] = useState<LanguageEnrichment[]>([]);

  useEffect(() => {
    fetchLanguages().then(setLangs);
  }, []);

  const java = langs.find((l) => l.name === 'Java')?.enrichment ?? 0;
  const python = langs.find((l) => l.name === 'Python')?.enrichment ?? 0;
  const csharp = langs.find((l) => l.name === 'C#')?.enrichment ?? 0;

  return (
    <Panel $cut="hex" aria-label="primary enrichment multi-fuel assembly">
      <PanelHeader>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PanelTag>MOD-01</PanelTag>
          <PanelTitle>PRIMARY ENRICHMENT // MULTI-FUEL ASSEMBLY</PanelTitle>
        </div>
        <PanelTag>POLIGLOT</PanelTag>
      </PanelHeader>
      <PanelBody>
        <RodGrid>
          <JavaEnterpriseFissionRod enrichment={java} />
          <PythonSynthesisFissionRod enrichment={python} />
          <DotNetIntegrationFissionRod enrichment={csharp} />
        </RodGrid>
        <Footer>
          <ProjectionRow>
            <Icon>HTML</Icon>
            <Icon>CSS</Icon>
            <span>PROJECTION DISPLAY LAYER // UI/UX CONDUCTORS</span>
          </ProjectionRow>
          <ProjectionRow>
            <span>AVG ENRICH&nbsp;</span>
            <strong style={{ color: 'rgb(180, 80, 255)' }}>
              {langs.length ? Math.round((java + python + csharp) / langs.length) : 0}%
            </strong>
          </ProjectionRow>
        </Footer>
      </PanelBody>
    </Panel>
  );
}
