import { createContext, useContext, useMemo, useState } from 'react';
import type { LangKey, Repository } from '../types';

interface ResonanceState {
  activeLang: LangKey | null;
  setActiveLang: (l: LangKey | null) => void;
  selectedRepo: Repository | null;
  setSelectedRepo: (r: Repository | null) => void;
}

const ResonanceContext = createContext<ResonanceState | null>(null);

export function ResonanceProvider({ children }: { children: React.ReactNode }) {
  const [activeLang, setActiveLang] = useState<LangKey | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const value = useMemo<ResonanceState>(
    () => ({ activeLang, setActiveLang, selectedRepo, setSelectedRepo }),
    [activeLang, selectedRepo]
  );

  return <ResonanceContext.Provider value={value}>{children}</ResonanceContext.Provider>;
}

export function useResonance(): ResonanceState {
  const ctx = useContext(ResonanceContext);
  if (!ctx) throw new Error('useResonance must be used inside ResonanceProvider');
  return ctx;
}
