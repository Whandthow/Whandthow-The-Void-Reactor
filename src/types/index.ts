export type LangKey = 'Java' | 'Python' | 'C#';

export interface UserStats {
  login: string;
  total_commits: number;
  stars: number;
  followers: number;
  active_repos: number;
}

export interface LanguageEnrichment {
  name: LangKey;
  enrichment: number; 
}

export interface Repository {
  name: string;
  commits: number;
  lang: LangKey;
  type: string; 
}

export interface DailyCommit {
  date: string; 
  count: number;
}

export interface GitGraphNode {
  id: string;
  parent: string | null;
  branch: 'main' | 'feature' | 'release';
  message: string;
  x: number;
  y: number;
}
