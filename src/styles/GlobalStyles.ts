import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-bg-void: rgb(0, 0, 3);
    --color-border-structural: rgba(100, 30, 200, 0.6);
    --color-acc-electric-purple: rgb(180, 80, 255);
    --color-glow-void: rgba(180, 80, 255, 0.4);
    --color-emergency-orange: rgb(255, 100, 0);
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    --font-display: 'Orbitron', 'JetBrains Mono', sans-serif;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    background: var(--color-bg-void);
    color: rgb(220, 200, 255);
    font-family: var(--font-mono);
    font-size: 14px;
    overflow-x: hidden;
  }

  body {
    cursor: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  a {
    color: var(--color-acc-electric-purple);
    text-decoration: none;
  }

  ::selection {
    background: var(--color-acc-electric-purple);
    color: var(--color-bg-void);
  }

  /* Hide scrollbar but allow scroll */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: rgba(20, 0, 40, 0.4); }
  ::-webkit-scrollbar-thumb {
    background: rgba(180, 80, 255, 0.4);
    border-radius: 3px;
  }

  @keyframes pulseCore {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50%      { transform: scale(1.04); filter: brightness(1.25); }
  }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.5; }
    50%      { opacity: 1; }
  }

  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes spinReverse {
    from { transform: rotate(360deg); }
    to   { transform: rotate(0deg); }
  }

  @keyframes scanLine {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  @keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
    20%, 24%, 55% { opacity: 0.4; }
  }

  @keyframes spacetimeWarp {
    0%, 100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(2%, -1%) scale(1.02); }
    66%      { transform: translate(-1%, 2%) scale(0.99); }
  }
`;
