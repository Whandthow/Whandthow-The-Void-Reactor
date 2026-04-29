import { useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Panel, PanelBody, PanelHeader, PanelTag, PanelTitle } from './Panel';
import { fetchRepositories } from '../data/mockApi';
import { useResonance } from '../context/ResonanceContext';
import { theme } from '../styles/theme';
import type { LangKey, Repository } from '../types';

const flowFast = keyframes`
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -80; }
`;
const flowSlow = keyframes`
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -40; }
`;
const flowMid = keyframes`
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -70; }
`;

const Stage = styled.div`
  position: relative;
  flex: 1;
  min-height: 320px;
  border: 1px dashed rgba(180, 80, 255, 0.2);
  background:
    radial-gradient(circle at 50% 50%, rgba(180, 80, 255, 0.06), transparent 70%),
    repeating-linear-gradient(0deg, rgba(180, 80, 255, 0.05) 0 1px, transparent 1px 22px),
    repeating-linear-gradient(90deg, rgba(180, 80, 255, 0.05) 0 1px, transparent 1px 22px);

  @media (max-width: 720px) {
    min-height: 260px;
  }
`;

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const linkBase = css`
  fill: none;
  stroke-linecap: round;
`;

const Link = styled.path<{ $lang: LangKey; $dim: boolean }>`
  ${linkBase};
  stroke: ${(p) => theme.langColors[p.$lang]};
  opacity: ${(p) => (p.$dim ? 0.18 : 0.85)};
  /* drop-shadow on every animated edge was being repainted on every frame.
     Replaced with a slightly thicker stroke + higher opacity — same vibe, free. */
  transition: opacity 0.2s, stroke-width 0.2s;
  ${(p) =>
    p.$lang === 'Java' &&
    css`
      stroke-width: 2.8;
      stroke-dasharray: 12 6;
      animation: ${flowSlow} 4.2s linear infinite;
    `}
  ${(p) =>
    p.$lang === 'Python' &&
    css`
      stroke-width: 1.8;
      stroke-dasharray: 4 4;
      animation: ${flowFast} 2.4s linear infinite;
    `}
  ${(p) =>
    p.$lang === 'C#' &&
    css`
      stroke-width: 2.2;
      stroke-dasharray: 1 6;
      animation: ${flowMid} 3s linear infinite;
    `}
`;

const NodeGroup = styled.g<{ $dim: boolean; $selected: boolean }>`
  cursor: pointer;
  transition: transform .2s, opacity .2s;
  opacity: ${(p) => (p.$dim ? 0.25 : 1)};
  & .diamond {
    fill: rgba(20, 0, 40, 0.85);
    stroke: rgb(180, 80, 255);
    stroke-width: ${(p) => (p.$selected ? 2.4 : 1.4)};
    /* glow only when actually selected/hovered — still paid for transitions */
    filter: ${(p) => (p.$selected ? 'drop-shadow(0 0 8px rgba(180, 80, 255, 0.85))' : 'none')};
  }
  & .lang-mark {
    fill: rgb(220, 170, 255);
  }
  &:hover .diamond {
    stroke-width: 2.4;
    filter: drop-shadow(0 0 8px rgba(180, 80, 255, 0.85));
  }
`;

const NodeText = styled.text`
  font-family: var(--font-mono);
  font-size: 8.5px;
  fill: rgb(220, 200, 255);
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const NodeSub = styled.text`
  font-family: var(--font-mono);
  font-size: 7.5px;
  fill: rgba(180, 80, 255, 0.85);
  letter-spacing: 0.18em;
`;

const InlineIcon = styled.g`
  & .ic-shape {
    fill: rgba(20, 0, 40, 0.95);
    stroke: rgba(180, 80, 255, 0.7);
    stroke-width: 1;
  }
  & text {
    font-family: var(--font-display);
    font-weight: 700;
    fill: rgb(220, 170, 255);
    font-size: 6.5px;
    letter-spacing: 0.18em;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 8px;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(220, 200, 255, 0.65);
  flex-wrap: wrap;

  @media (max-width: 720px) {
    gap: 10px 12px;
    font-size: 8.5px;
    letter-spacing: 0.16em;

    & > span:last-child {
      margin-left: 0 !important; /* drop the auto-margin so it wraps cleanly */
      flex-basis: 100%;
      color: rgba(180, 80, 255, 0.7);
    }
  }
`;

const LegendDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: ${(p) => p.$color};
  margin-right: 6px;
  box-shadow: 0 0 6px ${(p) => p.$color};
`;

interface NodePos {
  repo: Repository;
  x: number;
  y: number;
}

interface ConnectorPos {
  label: string;
  x: number;
  y: number;
}

interface Props {
  onSelect: (r: Repository) => void;
}

export function ProjectReactionGraph({ onSelect }: Props) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const { activeLang, selectedRepo } = useResonance();

  useEffect(() => {
    fetchRepositories().then(setRepos);
  }, []);

  const W = 580;
  const H = 360;

  // place nodes deterministically
  const nodes: NodePos[] = useMemo(() => {
    if (!repos.length) return [];
    const positions: { x: number; y: number }[] = [
      { x: 100, y: 70 },
      { x: 300, y: 50 },
      { x: 480, y: 90 },
      { x: 80,  y: 200 },
      { x: 250, y: 180 },
      { x: 460, y: 220 },
      { x: 160, y: 310 },
      { x: 380, y: 310 },
    ];
    return repos.slice(0, positions.length).map((r, i) => ({
      repo: r,
      x: positions[i].x,
      y: positions[i].y,
    }));
  }, [repos]);

  // connectors ride along certain edges
  const connectors: ConnectorPos[] = useMemo(() => {
    if (nodes.length < 6) return [];
    return [
      { label: 'REST API',         x: (nodes[0].x + nodes[1].x) / 2, y: (nodes[0].y + nodes[1].y) / 2 },
      { label: 'GRAPHQL GW',       x: (nodes[1].x + nodes[2].x) / 2, y: (nodes[1].y + nodes[2].y) / 2 },
      { label: 'WS SERVER',        x: (nodes[3].x + nodes[4].x) / 2, y: (nodes[3].y + nodes[4].y) / 2 },
    ];
  }, [nodes]);

  // edges: language-grouped chains plus a few cross links
  const edges = useMemo(() => {
    const out: { from: NodePos; to: NodePos; lang: LangKey }[] = [];
    const byLang: Record<LangKey, NodePos[]> = { Java: [], Python: [], 'C#': [] };
    nodes.forEach((n) => byLang[n.repo.lang].push(n));
    (['Java', 'Python', 'C#'] as LangKey[]).forEach((L) => {
      const arr = byLang[L];
      for (let i = 0; i < arr.length - 1; i++) out.push({ from: arr[i], to: arr[i + 1], lang: L });
    });
    // a couple of cross connections
    if (byLang.Java[0] && byLang.Python[0]) out.push({ from: byLang.Java[0], to: byLang.Python[0], lang: 'Python' });
    if (byLang.Python[0] && byLang['C#'][0]) out.push({ from: byLang.Python[0], to: byLang['C#'][0], lang: 'C#' });
    return out;
  }, [nodes]);

  const isDim = (lang: LangKey) => activeLang !== null && activeLang !== lang;

  return (
    <Panel $cut="hex" aria-label="chain reactions project logs">
      <PanelHeader>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PanelTag>MOD-02</PanelTag>
          <PanelTitle>CHAIN REACTIONS // PROJECT LOGS</PanelTitle>
        </div>
        <PanelTag>NODES: {nodes.length}</PanelTag>
      </PanelHeader>
      <PanelBody>
        <Stage>
          <Svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(220, 170, 255, 0.6)" />
                <stop offset="100%" stopColor="rgba(20, 0, 40, 0.95)" />
              </radialGradient>
            </defs>

            {/* edges */}
            {edges.map((e, i) => {
              // gentle quadratic curve
              const mx = (e.from.x + e.to.x) / 2;
              const my = (e.from.y + e.to.y) / 2 - 24;
              const d = `M ${e.from.x} ${e.from.y} Q ${mx} ${my} ${e.to.x} ${e.to.y}`;
              return <Link key={i} d={d} $lang={e.lang} $dim={isDim(e.lang)} />;
            })}

            {/* connector chips on edges */}
            {connectors.map((c, i) => (
              <InlineIcon key={i} transform={`translate(${c.x - 30}, ${c.y - 9})`}>
                <polygon className="ic-shape" points="6,0 54,0 60,9 54,18 6,18 0,9" />
                <text x="30" y="12" textAnchor="middle">{c.label}</text>
              </InlineIcon>
            ))}

            {/* nodes */}
            {nodes.map((n) => {
              const dim = isDim(n.repo.lang);
              const selected = selectedRepo?.name === n.repo.name;
              return (
                <NodeGroup
                  key={n.repo.name}
                  $dim={dim}
                  $selected={selected}
                  transform={`translate(${n.x}, ${n.y})`}
                  onClick={() => onSelect(n.repo)}
                  role="button"
                  aria-label={`open ${n.repo.name}`}
                >
                  <polygon className="diamond" points="0,-18 22,0 0,18 -22,0" />
                  <circle className="lang-mark" cx="0" cy="0" r="3" />
                  <NodeText x="0" y="-28" textAnchor="middle">{n.repo.name}</NodeText>
                  <NodeSub x="0" y="32" textAnchor="middle">{n.repo.lang} :: COMMITS {n.repo.commits}</NodeSub>
                </NodeGroup>
              );
            })}
          </Svg>
        </Stage>
        <Legend>
          <span><LegendDot $color={theme.langColors.Java} />Java // thick · slow</span>
          <span><LegendDot $color={theme.langColors.Python} />Python // fast · dotted</span>
          <span><LegendDot $color={theme.langColors['C#']} />C# // dashed bursts</span>
          <span style={{ marginLeft: 'auto' }}>CLICK NODE → OPEN GIT GRAPH</span>
        </Legend>
      </PanelBody>
    </Panel>
  );
}
