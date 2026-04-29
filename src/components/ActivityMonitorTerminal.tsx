import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Panel, PanelBody, PanelHeader, PanelTag, PanelTitle } from './Panel';
import { fetchContributionWaveform, fetchUserStats } from '../data/mockApi';
import type { DailyCommit, UserStats } from '../types';

const sweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const Body = styled(PanelBody)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 8px 12px;
  border: 1px solid rgba(180, 80, 255, 0.4);
  background: rgba(20, 0, 40, 0.5);
  clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
  gap: 12px;

  @media (max-width: 720px) {
    padding: 8px 10px;
  }
`;

const Big = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 30px;
  color: rgb(180, 80, 255);
  text-shadow: 0 0 10px rgba(180, 80, 255, 0.8);
  line-height: 1;

  @media (max-width: 720px) {
    font-size: 24px;
  }
`;

const SmallLabel = styled.div`
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(220, 200, 255, 0.7);
  margin-top: 4px;
`;

const SubBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: rgba(220, 200, 255, 0.7);
  text-transform: uppercase;

  @media (max-width: 720px) {
    font-size: 9px;
    letter-spacing: 0.12em;
    gap: 2px;
  }
`;

const WaveBox = styled.div`
  position: relative;
  flex: 1;
  border: 1px solid rgba(180, 80, 255, 0.35);
  background:
    repeating-linear-gradient(0deg, rgba(180, 80, 255, 0.06) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(90deg, rgba(180, 80, 255, 0.06) 0 1px, transparent 1px 18px),
    rgba(0, 0, 3, 0.55);
  overflow: hidden;
  min-height: 110px;
  cursor: crosshair;
  touch-action: pan-y; /* let vertical page scroll continue while we read horizontal touch for scrub */

  @media (max-width: 720px) {
    min-height: 90px;
  }
`;

const WaveLabel = styled.div`
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: rgba(180, 80, 255, 0.85);
  text-transform: uppercase;
  z-index: 2;
  pointer-events: none;
`;

const WaveStats = styled.div`
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: rgba(180, 80, 255, 0.7);
  text-transform: uppercase;
  z-index: 2;
  pointer-events: none;
  & strong { color: rgb(220, 170, 255); font-weight: 600; }
`;

const WaveSweep = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(180, 80, 255, 0.14), transparent);
  width: 30%;
  /* Slowed from 6s to 9s. mix-blend-mode removed \u2014 it forced an off-screen
     compositor layer that was repainted every frame. */
  animation: ${sweep} 9s linear infinite;
  pointer-events: none;
`;

const ScrubLine = styled.line`
  stroke: rgb(220, 170, 255);
  stroke-width: 0.6;
  stroke-dasharray: 2 2;
  filter: drop-shadow(0 0 4px rgba(220, 170, 255, 0.85));
`;

const ScrubDot = styled.circle`
  fill: rgb(255, 240, 255);
  stroke: rgb(180, 80, 255);
  stroke-width: 0.6;
  filter: drop-shadow(0 0 6px rgba(220, 170, 255, 0.95));
`;

const Tooltip = styled.div<{ $x: number; $top: boolean }>`
  position: absolute;
  left: ${(p) => p.$x}px;
  ${(p) => (p.$top ? 'top: 26px;' : 'bottom: 8px;')}
  transform: translateX(-50%);
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(220, 200, 255);
  background: rgba(20, 0, 40, 0.94);
  border: 1px solid rgba(180, 80, 255, 0.7);
  padding: 4px 8px;
  white-space: nowrap;
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
  box-shadow: 0 0 12px rgba(180, 80, 255, 0.4);
  z-index: 3;
  & .v { color: rgb(180, 80, 255); font-weight: 600; }
`;

const Osc = styled.div`
  position: relative;
  height: 80px;
  border: 1px solid rgba(180, 80, 255, 0.35);
  background: rgba(0, 0, 3, 0.55);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover { border-color: rgba(180, 80, 255, 0.6); }

  @media (max-width: 720px) {
    height: 64px;
  }
`;

const TerminalShell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(180, 80, 255, 0.35);
  background: rgba(0, 0, 3, 0.78);
  overflow: hidden;
  min-height: 110px;

  @media (max-width: 720px) {
    min-height: 150px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  border-bottom: 1px dashed rgba(180, 80, 255, 0.25);
  flex-wrap: wrap;
`;

const Pill = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 3px 8px;
  border: 1px solid
    ${(p) => (p.$active ? 'rgb(180, 80, 255)' : 'rgba(180, 80, 255, 0.35)')};
  color: ${(p) => (p.$active ? 'rgb(220, 170, 255)' : 'rgba(220, 200, 255, 0.7)')};
  background: ${(p) => (p.$active ? 'rgba(180, 80, 255, 0.18)' : 'rgba(20, 0, 40, 0.4)')};
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
  transition: color 0.15s, border-color 0.15s, background 0.15s, box-shadow 0.15s;
  box-shadow: ${(p) => (p.$active ? '0 0 10px rgba(180, 80, 255, 0.4)' : 'none')};

  &:hover, &:focus-visible {
    color: rgb(220, 170, 255);
    border-color: rgba(180, 80, 255, 0.7);
    outline: none;
  }

  & .count {
    margin-left: 6px;
    color: rgba(180, 80, 255, 0.8);
    font-weight: 600;
  }
`;

const TerminalScroll = styled.div`
  flex: 1;
  padding: 8px 10px;
  font-size: 10.5px;
  line-height: 1.55;
  color: rgba(220, 200, 255, 0.92);
  letter-spacing: 0.06em;
  font-family: var(--font-mono);
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
`;

const LogLine = styled.div<{ $age: number }>`
  opacity: ${(p) => Math.max(0, 1 - p.$age * 0.18)};
  & .ts { color: rgba(180, 80, 255, 0.55); margin-right: 8px; }
  & .ok { color: rgb(180, 80, 255); }
  & .cat {
    display: inline-block;
    min-width: 46px;
    text-align: center;
    margin-right: 8px;
    padding: 0 4px;
    font-size: 8.5px;
    letter-spacing: 0.18em;
    color: rgb(220, 170, 255);
    border: 1px solid rgba(180, 80, 255, 0.5);
  }
`;

type Cat = 'JVM' | 'PY' | 'NET' | 'INFRA';

interface LogTemplate {
  msg: string;
  cat: Cat;
}

const LOG_TEMPLATES: LogTemplate[] = [
  { msg: 'JVM_HEAP_OPTIMIZED',           cat: 'JVM' },
  { msg: 'SPRING_CONTEXT_REFRESHED',     cat: 'JVM' },
  { msg: 'KOTLIN_COROUTINE_DISPATCHED',  cat: 'JVM' },
  { msg: 'PYTHON_ASYNCIO_LOOP_STARTED',  cat: 'PY' },
  { msg: 'FAST_API_HEALTH_CHECK_PASS',   cat: 'PY' },
  { msg: 'PANDAS_DATAFRAME_PIPELINED',   cat: 'PY' },
  { msg: 'DOTNET_KESTREL_SERVER_RUNNING', cat: 'NET' },
  { msg: 'EF_CORE_MIGRATION_APPLIED',    cat: 'NET' },
  { msg: 'SIGNALR_HUB_CONNECTED',        cat: 'NET' },
  { msg: 'KAFKA_PARTITION_REBALANCED',   cat: 'INFRA' },
  { msg: 'GRAPHQL_GATEWAY_RESPOND_18MS', cat: 'INFRA' },
  { msg: 'WEBSOCKET_HEARTBEAT_OK',       cat: 'INFRA' },
  { msg: 'POSTGRES_VACUUM_PASS',         cat: 'INFRA' },
  { msg: 'REDIS_CACHE_WARMED',           cat: 'INFRA' },
  { msg: 'GRPC_STREAM_OPENED',           cat: 'INFRA' },
  { msg: 'AUTH_TOKEN_ROTATED',           cat: 'INFRA' },
  { msg: 'TLS_HANDSHAKE_COMPLETE',       cat: 'INFRA' },
  { msg: 'CONTAINER_BUILD_PUSHED',       cat: 'INFRA' },
  { msg: 'ETL_PIPELINE_COMPLETE',        cat: 'INFRA' },
];

interface LogEntry {
  id: number;
  ts: string;
  msg: string;
  cat: Cat;
  age: number;
}

type Filter = 'ALL' | Cat;
const FILTERS: Filter[] = ['ALL', 'JVM', 'PY', 'NET', 'INFRA'];
const FILTER_LABELS: Record<Filter, string> = {
  ALL: 'ALL',
  JVM: 'JVM',
  PY: 'PY',
  NET: '.NET',
  INFRA: 'INFRA',
};

const W = 600;
const H = 110;
const PAD = 4;

interface Props {}

export function ActivityMonitorTerminal(_p: Props) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [wave, setWave] = useState<DailyCommit[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const idRef = useRef(0);
  const oscRef = useRef<SVGPathElement | null>(null);
  const ampRef = useRef(8);
  const waveBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserStats().then(setStats);
    fetchContributionWaveform(180).then(setWave);
  }, []);

  // log generator
  useEffect(() => {
    const id = window.setInterval(() => {
      setLogs((prev) => {
        const ts = new Date().toISOString().slice(11, 19);
        const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        const entry: LogEntry = {
          id: ++idRef.current,
          ts,
          msg: tpl.msg,
          cat: tpl.cat,
          age: 0,
        };
        const aged = prev.map((l) => ({ ...l, age: l.age + 1 }));
        return [entry, ...aged].slice(0, 7);
      });
      // bump oscilloscope amplitude inline; previously this went through a
      // global context tick that re-rendered every other component.
      ampRef.current = 26;
    }, 2600); // was 1700ms — slower cadence, fewer React renders per minute
    return () => window.clearInterval(id);
  }, []);

  // oscilloscope animation — throttled to ~30fps, 60-point path
  useEffect(() => {
    let raf = 0;
    let t = 0;
    let lastFrame = 0;
    let paused = document.hidden;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    const FRAME_MS = 1000 / 30; // 30fps is more than enough for a wavy line
    const STEPS = 60; // was 120 — halved, visually identical at this width
    const update = (now: number) => {
      raf = requestAnimationFrame(update);
      if (paused) return;
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      t += 0.12; // double phase step to compensate for half framerate
      ampRef.current = ampRef.current * 0.94 + 8 * 0.06;
      const a = ampRef.current;
      const oW = 600;
      const oH = 80;
      const points: string[] = [];
      for (let i = 0; i <= STEPS; i++) {
        const x = (i / STEPS) * oW;
        const y = oH / 2 + Math.sin(i * 0.7 + t) * a + Math.sin(i * 0.24 + t * 0.7) * (a * 0.4);
        points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      if (oscRef.current) oscRef.current.setAttribute('d', points.join(' '));
    };
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // build waveform path + peaks + per-day x/y/v
  const wavePath = useMemo(() => {
    const empty = {
      d: '',
      area: '',
      peaks: [] as { x: number; y: number; v: number; date: string }[],
      points: [] as { x: number; y: number; v: number; date: string }[],
      max: 1,
    };
    if (!wave.length) return empty;
    const max = Math.max(...wave.map((d) => d.count), 1);
    const stepX = (W - PAD * 2) / (wave.length - 1);
    const points = wave.map((d, i) => {
      const x = PAD + stepX * i;
      const y = H - PAD - (d.count / max) * (H - PAD * 2);
      return { x, y, v: d.count, date: d.date };
    });
    const d = points
      .map((p, i, arr) => {
        if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        const prev = arr[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${cx.toFixed(1)} ${(
          (prev.y + p.y) /
          2
        ).toFixed(1)} T ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      })
      .join(' ');
    const area = `${d} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;
    const peaks = [...points].sort((a, b) => b.v - a.v).slice(0, 6);
    return { d, area, peaks, points, max };
  }, [wave]);

  // counts per category for filter pill badges
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { ALL: logs.length, JVM: 0, PY: 0, NET: 0, INFRA: 0 };
    for (const l of logs) c[l.cat]++;
    return c;
  }, [logs]);

  const visibleLogs = useMemo(
    () => (filter === 'ALL' ? logs : logs.filter((l) => l.cat === filter)),
    [logs, filter]
  );

  // unified scrub handler — pointer events cover mouse + touch + pen
  const scrubAt = (clientX: number) => {
    if (!wave.length || !waveBoxRef.current) return;
    const rect = waveBoxRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const idx = Math.max(0, Math.min(wave.length - 1, Math.round(ratio * (wave.length - 1))));
    setHoverIdx(idx);
  };
  const onWavePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // for touch: only scrub when finger is actually pressed; for mouse: hover (no buttons) is fine too
    if (e.pointerType !== 'mouse' && e.buttons === 0) return;
    scrubAt(e.clientX);
  };
  const onWavePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    scrubAt(e.clientX);
  };
  const onWaveLeave = () => setHoverIdx(null);

  // user-triggered oscilloscope spike
  const pingOsc = () => {
    ampRef.current = 38;
  };

  const totalCommits = wave.reduce((s, d) => s + d.count, 0);
  const hoverPoint = hoverIdx !== null ? wavePath.points[hoverIdx] : null;
  const hoverPxRatio = hoverPoint ? hoverPoint.x / W : 0;

  return (
    <Panel $cut="hex" aria-label="energy output activity monitor">
      <PanelHeader>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PanelTag>MOD-03</PanelTag>
          <PanelTitle>ENERGY OUTPUT // ACTIVITY MONITOR</PanelTitle>
        </div>
        <PanelTag>{stats ? `@${stats.login}` : '@…'}</PanelTag>
      </PanelHeader>
      <Body>
        <Section>
          <StatRow>
            <div>
              <Big>{stats?.stars ?? '—'}</Big>
              <SmallLabel>TOTAL STARS // COMMUNITY ENERGY</SmallLabel>
            </div>
            <SubBlock>
              <div>
                ACTIVE REPOS:&nbsp;
                <strong style={{ color: 'rgb(180, 80, 255)' }}>
                  {stats?.active_repos ?? '—'}
                </strong>
              </div>
              <div>FOLLOWERS: {stats?.followers ?? '—'}</div>
              <div>{totalCommits || stats?.total_commits || 750} COMMITS THIS YEAR</div>
            </SubBlock>
          </StatRow>

          <WaveBox
            ref={waveBoxRef}
            onPointerMove={onWavePointerMove}
            onPointerDown={onWavePointerDown}
            onPointerLeave={onWaveLeave}
            onPointerCancel={onWaveLeave}
            role="figure"
            aria-label="contribution waveform — hover or touch to inspect day"
          >
            <WaveLabel>CONTRIBUTION WAVEFORM</WaveLabel>
            <WaveStats>
              {hoverPoint ? (
                <>
                  <strong>{hoverPoint.v}</strong> commits · {hoverPoint.date}
                </>
              ) : (
                <>PEAK&nbsp;<strong>{wavePath.max}</strong></>
              )}
            </WaveStats>
            <WaveSweep />
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%' }}
            >
              <defs>
                <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(180, 80, 255, 0.55)" />
                  <stop offset="100%" stopColor="rgba(180, 80, 255, 0)" />
                </linearGradient>
              </defs>
              <path d={wavePath.area} fill="url(#waveFill)" />
              <path
                d={wavePath.d}
                fill="none"
                stroke="rgb(180, 80, 255)"
                strokeWidth="1.6"
                style={{ filter: 'drop-shadow(0 0 6px rgba(180, 80, 255, 0.7))' }}
              />
              {wavePath.peaks.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3.2"
                    fill="rgb(220, 170, 255)"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(220, 170, 255, 0.95))' }}
                  />
                  <line
                    x1={p.x}
                    y1={p.y - 6}
                    x2={p.x}
                    y2="0"
                    stroke="rgba(180, 80, 255, 0.4)"
                    strokeDasharray="2 3"
                  />
                </g>
              ))}
              {hoverPoint && (
                <>
                  <ScrubLine x1={hoverPoint.x} y1="0" x2={hoverPoint.x} y2={H} />
                  <ScrubDot cx={hoverPoint.x} cy={hoverPoint.y} r="3.6" />
                </>
              )}
            </svg>
            {hoverPoint && waveBoxRef.current && (
              <Tooltip
                $x={hoverPxRatio * waveBoxRef.current.clientWidth}
                $top={hoverPoint.y > H * 0.55}
              >
                <span className="v">{hoverPoint.v}</span> commits · {hoverPoint.date}
              </Tooltip>
            )}
          </WaveBox>
        </Section>

        <Section>
          <Osc
            onClick={pingOsc}
            role="button"
            aria-label="manual oscilloscope spike"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                pingOsc();
              }
            }}
          >
            <WaveLabel>OSCILLOSCOPE // VOID_LOGS · CLICK TO SPIKE</WaveLabel>
            <svg
              viewBox="0 0 600 80"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%' }}
            >
              <line
                x1="0"
                y1="40"
                x2="600"
                y2="40"
                stroke="rgba(180, 80, 255, 0.18)"
                strokeDasharray="2 4"
              />
              <path
                ref={oscRef}
                fill="none"
                stroke="rgb(180, 80, 255)"
                strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 0 6px rgba(180, 80, 255, 0.8))' }}
              />
            </svg>
          </Osc>

          <TerminalShell>
            <FilterBar>
              {FILTERS.map((f) => (
                <Pill
                  key={f}
                  $active={filter === f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                >
                  {FILTER_LABELS[f]}
                  <span className="count">{counts[f]}</span>
                </Pill>
              ))}
            </FilterBar>
            <TerminalScroll>
              {visibleLogs.length === 0 && (
                <LogLine $age={0} style={{ opacity: 0.5 }}>
                  <span className="ts">[ — ]</span>
                  <span className="ok">▸</span> NO ENTRIES MATCH FILTER · {FILTER_LABELS[filter]}
                </LogLine>
              )}
              {visibleLogs.map((l) => (
                <LogLine key={l.id} $age={l.age}>
                  <span className="ts">[{l.ts}]</span>
                  <span className="cat">{l.cat === 'NET' ? '.NET' : l.cat}</span>
                  <span className="ok">▸</span> {l.msg}
                </LogLine>
              ))}
            </TerminalScroll>
          </TerminalShell>
        </Section>
      </Body>
    </Panel>
  );
}
