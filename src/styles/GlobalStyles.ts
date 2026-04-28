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
    min-height: 100%;
    width: 100%;
    background: var(--color-bg-void);
    color: rgb(220, 200, 255);
    font-family: var(--font-mono);
    font-size: 14px;
  }

  html, body {
    overflow-x: hidden;
    overflow-y: auto;
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

`;
