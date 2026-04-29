import styled from 'styled-components';

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  /* Was rgba(0.95) + backdrop-filter blur(8px). Since the background is
     already nearly opaque, the blur was wasted GPU work \u2014 dropped. */
  background: linear-gradient(180deg, rgb(20, 0, 40), rgb(8, 0, 20));
  border-bottom: 1px solid rgba(180, 80, 255, 0.35);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(220, 200, 255, 0.85);

  @media (max-width: 720px) {
    height: 28px;
    gap: 8px;
    padding: 0 10px;
    font-size: 10px;
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
  & > span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid rgba(180, 80, 255, 0.7);
    box-shadow: 0 0 6px rgba(180, 80, 255, 0.4);
  }
  & > span:nth-child(2) { background: rgba(180, 80, 255, 0.15); }
  & > span:nth-child(3) { background: rgba(180, 80, 255, 0.35); }
`;

const Url = styled.div`
  flex: 1;
  text-align: center;
  border: 1px solid rgba(180, 80, 255, 0.25);
  border-radius: 2px;
  padding: 4px 10px;
  background: rgba(0, 0, 3, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgb(180, 80, 255);
  text-shadow: 0 0 6px rgba(180, 80, 255, 0.5);
  max-width: 580px;
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 720px) {
    padding: 3px 8px;
    letter-spacing: 0.12em;
  }
`;

const Side = styled.div`
  display: flex;
  gap: 12px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(180, 80, 255, 0.7);

  @media (max-width: 720px) {
    display: none; /* save space, info already shown in HeaderBar */
  }
`;

export function BrowserChrome() {
  return (
    <Bar role="banner" aria-label="browser chrome">
      <Dots>
        <span />
        <span />
        <span />
      </Dots>
      <Url title="Whandthow.com // Fission Synthesizer">whandthow.com // fission synthesizer</Url>
      <Side>
        <span>SECURE</span>
        <span>::</span>
        <span>v0.1.21</span>
      </Side>
    </Bar>
  );
}
