import type { LangKey } from '../types';

export const theme = {
  colors: {
    bgVoid: 'rgb(0, 0, 3)',
    bgVoidSoft: 'rgb(6, 2, 14)',
    borderStructural: 'rgba(100, 30, 200, 0.6)',
    borderStructuralStrong: 'rgba(140, 60, 230, 0.85)',
    accElectricPurple: 'rgb(180, 80, 255)',
    accDeepPurple: 'rgb(120, 40, 200)',
    accPalePurple: 'rgb(220, 170, 255)',
    glowVoid: 'rgba(180, 80, 255, 0.4)',
    glowSoft: 'rgba(180, 80, 255, 0.18)',
    emergencyOrange: 'rgb(255, 100, 0)',
    emergencyOrangeGlow: 'rgba(255, 100, 0, 0.5)',
    text: 'rgb(220, 200, 255)',
    textDim: 'rgba(220, 200, 255, 0.55)',
  },
  fonts: {
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    display: "'Orbitron', 'JetBrains Mono', sans-serif",
  },
  langColors: {
    Java: 'rgb(180, 80, 255)',
    Python: 'rgb(140, 200, 255)',
    'C#': 'rgb(220, 130, 255)',
  } as Record<LangKey, string>,
} as const;

export type Theme = typeof theme;
