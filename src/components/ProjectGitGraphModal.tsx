import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { fetchGitGraph } from '../data/mockApi';
import type { GitGraphNode, Repository } from '../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`;

const flow = keyframes`
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -120; }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 3, 0.78);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px 24px;
`;

const Modal = styled.div`
  width: min(880px, 100%);
  max-height: calc(100vh - 100px);
  background: linear-gradient(180deg, rgba(20, 0, 40, 0.85), rgba(8, 0, 20, 0.95));
  border: 1px solid rgba(180, 80, 255, 0.55);
  box-shadow: 0 0 50px rgba(180, 80, 255, 0.35);
  clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.18s ease-out;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px dashed rgba(180, 80, 255, 0.35);
`;

const Title = styled.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.28em;
  color: rgb(220, 200, 255);
  text-shadow: 0 0 8px rgba(180, 80, 255, 0.6);
`;

const Sub = styled.div`
  font-size: 10px;
  letter-spacing: 0.22em;
  color: rgba(180, 80, 255, 0.85);
  text-transform: uppercase;
`;

const CloseBtn = styled.button`
  all: unset;
  cursor: pointer;
  padding: 6px 14px;
  border: 1px solid rgba(180, 80, 255, 0.5);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  color: rgb(220, 200, 255);
  text-transform: uppercase;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);

  &:hover, &:focus-visible {
    color: rgb(180, 80, 255);
    border-color: rgb(180, 80, 255);
    box-shadow: 0 0 12px rgba(180, 80, 255, 0.5);
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
`;

const GraphWrap = styled.div`
  position: relative;
  border-right: 1px dashed rgba(180, 80, 255, 0.25);
  background:
    repeating-linear-gradient(0deg, rgba(180, 80, 255, 0.05) 0 1px, transparent 1px 22px),
    repeating-linear-gradient(90deg, rgba(180, 80, 255, 0.05) 0 1px, transparent 1px 22px);
  padding: 12px;
  overflow: auto;
`;

const Svg = styled.svg`
  width: 100%;
  & .edge {
    fill: none;
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-dasharray: 4 5;
    animation: ${flow} 2.4s linear infinite;
    filter: drop-shadow(0 0 4px rgba(180, 80, 255, 0.7));
  }
  & .edge.main    { stroke: rgb(180, 80, 255); }
  & .edge.feature { stroke: rgb(140, 200, 255); }
  & .edge.release { stroke: rgb(220, 130, 255); }

  & .node {
    fill: rgb(220, 170, 255);
    stroke: rgb(180, 80, 255);
    stroke-width: 1.4;
    filter: drop-shadow(0 0 6px rgba(180, 80, 255, 0.8));
  }
  & .label {
    font-family: var(--font-mono);
    font-size: 10px;
    fill: rgba(220, 200, 255, 0.9);
    letter-spacing: 0.06em;
  }
  & .lane {
    font-family: var(--font-mono);
    font-size: 9px;
    fill: rgba(180, 80, 255, 0.6);
    letter-spacing: 0.18em;
  }
`;

const Side = styled.div`
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: rgba(220, 200, 255, 0.92);
  overflow: auto;
`;

const KV = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
  font-size: 10.5px;
  & dt {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: rgba(180, 80, 255, 0.85);
  }
  & dd {
    color: rgba(220, 200, 255, 0.95);
  }
`;

const Particles = styled.div`
  position: relative;
  height: 110px;
  border: 1px solid rgba(180, 80, 255, 0.4);
  background: rgba(0, 0, 3, 0.6);
  overflow: hidden;
  & svg { width: 100%; height: 100%; }
  & .p {
    fill: rgb(220, 170, 255);
    filter: drop-shadow(0 0 4px rgba(180, 80, 255, 0.8));
  }
`;

interface Props {
  repo: Repository;
  onClose: () => void;
}

export function ProjectGitGraphModal({ repo, onClose }: Props) {
  const [graph, setGraph] = useState<GitGraphNode[]>([]);

  useEffect(() => {
    fetchGitGraph(repo.name).then(setGraph);
  }, [repo.name]);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const NODE_R = 5;
  const STEP_X = 60;
  const STEP_Y = 28;
  const PAD_X = 30;
  const PAD_Y = 26;
  const W = PAD_X * 2 + STEP_X * 2 + 80;
  const H = PAD_Y * 2 + STEP_Y * (graph.length || 1);

  const idMap = new Map(graph.map((n) => [n.id, n]));

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <Header>
          <div>
            <Title>{repo.name}</Title>
            <Sub>// GIT GRAPH // PARTICLE TRAJECTORIES</Sub>
          </div>
          <CloseBtn onClick={onClose}>CLOSE [ESC]</CloseBtn>
        </Header>

        <Body>
          <GraphWrap>
            <Svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMinYMin meet" style={{ height: H }}>
              {/* lane labels */}
              <text className="lane" x={PAD_X + 0 * STEP_X} y={14} textAnchor="middle">FEAT</text>
              <text className="lane" x={PAD_X + 1 * STEP_X} y={14} textAnchor="middle">MAIN</text>
              <text className="lane" x={PAD_X + 2 * STEP_X} y={14} textAnchor="middle">REL</text>

              {/* edges */}
              {graph.map((n) => {
                if (!n.parent) return null;
                const p = idMap.get(n.parent);
                if (!p) return null;
                const x1 = PAD_X + p.x * STEP_X;
                const y1 = PAD_Y + p.y * STEP_Y;
                const x2 = PAD_X + n.x * STEP_X;
                const y2 = PAD_Y + n.y * STEP_Y;
                const mx = (x1 + x2) / 2;
                const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
                return <path key={n.id} className={`edge ${n.branch}`} d={d} />;
              })}

              {/* nodes + labels */}
              {graph.map((n) => {
                const cx = PAD_X + n.x * STEP_X;
                const cy = PAD_Y + n.y * STEP_Y;
                return (
                  <g key={n.id}>
                    <circle className="node" cx={cx} cy={cy} r={NODE_R} />
                    <text className="label" x={PAD_X + 2 * STEP_X + 16} y={cy + 3}>
                      {n.id} · {n.message}
                    </text>
                  </g>
                );
              })}
            </Svg>
          </GraphWrap>

          <Side>
            <KV>
              <dt>NAME</dt>          <dd>{repo.name}</dd>
              <dt>LANGUAGE</dt>      <dd>{repo.lang}</dd>
              <dt>TYPE</dt>          <dd>{repo.type}</dd>
              <dt>COMMITS</dt>       <dd>{repo.commits}</dd>
              <dt>BRANCHES</dt>      <dd>main / feature / release</dd>
              <dt>STATUS</dt>        <dd style={{ color: 'rgb(180, 80, 255)' }}>SYNTHESIS // STABLE</dd>
            </KV>

            <Particles aria-hidden>
              <svg viewBox="0 0 240 110" preserveAspectRatio="none">
                {Array.from({ length: 24 }).map((_, i) => {
                  const t = i / 24;
                  const x = t * 240;
                  const y = 55 + Math.sin(i * 0.7) * 26 + (i % 5 === 0 ? -8 : 0);
                  const r = i % 4 === 0 ? 2.4 : 1.2;
                  return <circle key={i} className="p" cx={x} cy={y} r={r} />;
                })}
                <path
                  d="M 0 55 Q 60 0 120 60 T 240 55"
                  stroke="rgba(180, 80, 255, 0.55)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3 4"
                />
              </svg>
            </Particles>

            <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(180, 80, 255, 0.7)' }}>
              ▸ PARTICLE TRAJECTORIES PROJECTED FROM CHAIN-REACTION HISTORY
            </div>
          </Side>
        </Body>
      </Modal>
    </Backdrop>
  );
}
