import userStats from './user_stats.json';
import languages from './languages.json';
import repositories from './repositories.json';
import type {
  UserStats,
  LanguageEnrichment,
  Repository,
  DailyCommit,
  GitGraphNode,
  LangKey,
} from '../types';


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchUserStats(): Promise<UserStats> {
  await sleep(120);
  return userStats as UserStats;
}

export async function fetchLanguages(): Promise<LanguageEnrichment[]> {
  await sleep(140);
  return languages as LanguageEnrichment[];
}

export async function fetchRepositories(): Promise<Repository[]> {
  await sleep(160);
  return repositories as Repository[];
}

export async function fetchContributionWaveform(days = 365): Promise<DailyCommit[]> {
  await sleep(80);
  const out: DailyCommit[] = [];
  const today = new Date();
  let s = 1337;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weekday = d.getDay();
    const base = 1 + Math.floor(rand() * 3);
    const cycle = (Math.sin(i / 6) + 1) * 2; 
    const weekendDip = weekday === 0 || weekday === 6 ? 0.4 : 1;
    const spike = rand() > 0.94 ? Math.floor(rand() * 12) + 6 : 0;
    const count = Math.max(0, Math.round((base + cycle) * weekendDip + spike));
    out.push({ date: d.toISOString().slice(0, 10), count });
  }
  return out;
}


export async function fetchGitGraph(repo: string): Promise<GitGraphNode[]> {
  await sleep(90);
  let s = repo.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 7;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const nodes: GitGraphNode[] = [];
  const branches: ('main' | 'feature' | 'release')[] = ['main', 'feature', 'release'];
  const messages = [
    'feat: enrich core',
    'fix: stabilize flux',
    'refactor: cooling loop',
    'chore: rotor sync',
    'perf: chain reaction',
    'feat: telemetry probe',
    'test: containment',
    'docs: schema map',
  ];
  let prev: string | null = null;
  const COUNT = 14;
  for (let i = 0; i < COUNT; i++) {
    const id = `c${i.toString(16).padStart(4, '0')}`;
    const branch = i === 0 ? 'main' : branches[Math.floor(rand() * 3)];
    const lane = branch === 'main' ? 1 : branch === 'feature' ? 0 : 2;
    nodes.push({
      id,
      parent: prev,
      branch,
      message: messages[Math.floor(rand() * messages.length)],
      x: lane,
      y: i,
    });
    prev = id;
  }
  return nodes;
}


export const LANG_KEYS: LangKey[] = ['Java', 'Python', 'C#'];
