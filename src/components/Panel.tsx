import styled from 'styled-components';

/**
 * Reusable hexagonal/cut-corner panel used by every quadrant module.
 * Provides framed look + corner ticks + scanning line.
 */
export const Panel = styled.section<{ $cut?: 'hex' | 'soft' | 'flag' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(180deg, rgba(20, 0, 40, 0.55), rgba(8, 0, 20, 0.78));
  border: 1px solid rgba(100, 30, 200, 0.6);
  box-shadow:
    0 0 0 1px rgba(180, 80, 255, 0.05) inset,
    0 0 24px rgba(180, 80, 255, 0.08);
  backdrop-filter: blur(2px);
  overflow: hidden;
  ${(p) =>
    p.$cut === 'hex'
      ? `clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);`
      : p.$cut === 'flag'
      ? `clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));`
      : `clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);`}

  &::before, &::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid rgba(180, 80, 255, 0.7);
    pointer-events: none;
  }
  &::before {
    top: 6px; left: 6px;
    border-right: none; border-bottom: none;
  }
  &::after {
    bottom: 6px; right: 6px;
    border-left: none; border-top: none;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px 8px;
  border-bottom: 1px dashed rgba(180, 80, 255, 0.3);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180, 80, 255, 0.9);
`;

export const PanelTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.32em;
  color: rgb(220, 200, 255);
  text-shadow: 0 0 8px rgba(180, 80, 255, 0.5);
`;

export const PanelTag = styled.div`
  font-size: 9px;
  letter-spacing: 0.22em;
  color: rgba(180, 80, 255, 0.65);
  border: 1px solid rgba(180, 80, 255, 0.3);
  padding: 2px 7px;
`;

export const PanelBody = styled.div`
  position: relative;
  flex: 1;
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
`;
