import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Panel, PanelBody, PanelHeader, PanelTag, PanelTitle } from './Panel';
import { fetchContributionWaveform, fetchUserStats } from '../data/mockApi';
import { useResonance } from '../context/ResonanceContext';
import type { DailyCommit, UserStats } from '../types';

const sweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const Body = styled(PanelBody)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
`;

const Big = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 30px;
  color: rgb(180, 80, 255);
  text-shadow: 0 0 10px rgba(180, 80, 255, 0.8);
  line-height: 1;
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
`;

const WaveSweep = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(180, 80, 255, 0.18), transparent);
  width: 30%;
  animation: ${sweep} 6s linear infinite;
  pointer-events: none;
  mix-blend-mode: screen;
`;

const Osc = styled.div`
  position: relative;
  height: 80px;
  border: 1px solid rgba(180, 80, 255, 0.35);
  background: rgba(0, 0, 3, 0.55);
  overflow: hidden;
`;

const Terminal = styled.div`
  flex: 1;
  border: 1px solid rgba(180, 80, 255, 0.35);
  background: rgba(0, 0, 3, 0.78);
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
  min-height: 110px;
`;

const LogLine = styled.div<{ $age: number }>`
  opacity: ${(p) => Math.max(0.25, 1 - p.$age * 0.12)};
  & .ts { color: rgba(180, 80, 255, 0.6); margin-right: 8px; }
  & .ok { color: rgb(180, 80, 255); }
`;

interface Props {}

const LOG_TEMPLATES = [
  'JVM_HEAP_OPTIMIZED',
  'PYTHON_ASYNCIO_LOOP_STARTED',
  'DOTNET_KESTREL_SERVER_RUNNING',
  'ETL_PIPELINE_COMPLETE',
  'KAFKA_PARTITION_REBALANCED',
  'GRAPHQL_GATEWAY_RESPOND_18MS',
  'WEBSOCKET_HEARTBEAT_OK',
  'POSTGRES_VACUUM_PASS',
  'REDIS_CACHE_WARMED',
  'GRPC_STREAM_OPENED',
  'AUTH_TOKEN_ROTATED',
  'FAST_API_HEALTH_CHECK_PASS',
  'SPRING_CONTEXT_REFRESHED',
  'TYPE_CHECK_CLEAN',
  'CONTAINER_BUILD_PUSHED',
  'TLS_HANDSHAKE_COMPLETE',
];

interface LogEntry {
  id: number;
  ts: string;
  msg: string;
  age: number;
}

export function ActivityMonitorTerminal(_p: Props) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [wave, setWave] = useState<DailyCommit[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const idRef = useRef(0);
  const oscRef = useRef<SVGPathElement | null>(null);
  const ampRef = useRef(8);
  const { logPulseTick, pulseLog } = useResonance();

  useEffect(() => {
    fetchUserStats().then(setStats);
    fetchContributionWaveform(180).then(setWave);
  }, []);

  // log generator
  useEffect(() => {
    const id = setInterval(() => {
      setLogs((prev) => {
        const ts = new Date().toISOString().slice(11, 19);
        const msg = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        const entry: LogEntry = { id: ++idRef.current, ts, msg, age: 0 };
        const aged = prev.map((l) => ({ ...l, age: l.age + 1 }));
        return [entry, ...aged].slice(0, 7);
      });
      pulseLog();
    }, 1700);
    return () => clearInterval(id);
  }, [pulseLog]);

  // oscilloscope animation: draws a sine wave; amplitude bumps on pulseLog
  useEffect(() => {
    let raf = 0;
    let t = 0;
    const update = () => {
      t += 0.06;
      // amplitude relaxation
      ampRef.current = ampRef.current * 0.94 + 8 * 0.06;
      const a = ampRef.current;
      const W = 600, H = 80;
      const points: string[] = [];
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        const y = H / 2 + Math.sin(i * 0.35 + t) * a + Math.sin(i * 0.12 + t * 0.7) * (a * 0.4);
        points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      if (oscRef.current) oscRef.current.setAttribute('d', points.join(' '));
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  // bump amplitude on every new log
  useEffect(() => {
    ampRef.current = 26;
  }, [logPulseTick]);

  // build waveform path + peaks
  const wavePath = useMemo(() => {
    if (!wave.length) return { d: '', area: '', peaks: [] as { x: number; y: number; v: number }[] };
    const W = 600, H = 110, pad = 4;
    const max = Math.max(...wave.map((d) => d.count), 1);
    const stepX = (W - pad * 2) / (wave.length - 1);
    const points = wave.map((d, i) => {
      const x = pad + stepX * i;
      const y = H - pad - (d.count / max) * (H - pad * 2);
      return { x, y, v: d.count };
    });
    // smooth catmull-rom-ish path
    const d = points
      .map((p, i, arr) => {
        if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        const prev = arr[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${cx.toFixed(1)} ${((prev.y + p.y) / 2).toFixed(1)} T ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      })
      .join(' ');
    const area = `${d} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;
    // top 6 peaks
    const peaks = [...points].sort((a, b) => b.v - a.v).slice(0, 6);
    return { d, area, peaks };
  }, [wave]);

  const totalCommits = wave.reduce((s, d) => s + d.count, 0);

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
              <div>ACTIVE REPOS: <strong style={{ color: 'rgb(180, 80, 255)' }}>{stats?.active_repos ?? '—'}</strong></div>
              <div>FOLLOWERS: {stats?.followers ?? '—'}</div>
              <div>{totalCommits || stats?.total_commits || 750} COMMITS THIS YEAR</div>
            </SubBlock>
          </StatRow>
          <WaveBox>
            <WaveLabel>CONTRIBUTION WAVEFORM</WaveLabel>
            <WaveSweep />
            <svg viewBox="0 0 600 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(180, 80, 255, 0.55)" />
                  <stop offset="100%" stopColor="rgba(180, 80, 255, 0)" />
                </linearGradient>
              </defs>
              <path d={wavePath.area} fill="url(#waveFill)" />
              <path d={wavePath.d} fill="none" stroke="rgb(180, 80, 255)" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 6px rgba(180, 80, 255, 0.7))' }} />
              {wavePath.peaks.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3.2" fill="rgb(220, 170, 255)" style={{ filter: 'drop-shadow(0 0 6px rgba(220, 170, 255, 0.95))' }} />
                  <line x1={p.x} y1={p.y - 6} x2={p.x} y2="0" stroke="rgba(180, 80, 255, 0.4)" strokeDasharray="2 3" />
                </g>
              ))}
            </svg>
          </WaveBox>
        </Section>

        <Section>
          <Osc>
            <WaveLabel>OSCILLOSCOPE // VOID_LOGS</WaveLabel>
            <svg viewBox="0 0 600 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(180, 80, 255, 0.18)" strokeDasharray="2 4" />
              <path ref={oscRef} fill="none" stroke="rgb(180, 80, 255)" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 6px rgba(180, 80, 255, 0.8))' }} />
            </svg>
          </Osc>
          <Terminal>
            {logs.map((l) => (
              <LogLine key={l.id} $age={l.age}>
                <span className="ts">[{l.ts}]</span>
                <span className="ok">▸</span> {l.msg}
              </LogLine>
            ))}
          </Terminal>
        </Section>
      </Body>
    </Panel>
  );
}
