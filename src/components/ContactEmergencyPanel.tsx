import styled, { keyframes } from 'styled-components';
import { Panel, PanelBody, PanelHeader, PanelTag, PanelTitle } from './Panel';

const carrierPulse = keyframes`
  0%, 100% { opacity: 0.55; transform: scaleX(1);    }
  50%      { opacity: 1;    transform: scaleX(1.04); }
`;

const Body = styled(PanelBody)`
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 14px;
`;

const ContactGrid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  flex: 1;
  min-height: 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 8px;
  }
`;

const ContactTile = styled.li``;

const ContactLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px;
  height: 100%;
  min-height: 56px; /* touch target */
  border: 1px solid rgba(180, 80, 255, 0.4);
  background:
    linear-gradient(135deg, rgba(40, 10, 80, 0.55), rgba(20, 0, 40, 0.85));
  text-decoration: none;
  color: rgba(220, 200, 255, 0.92);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  transition: border-color .18s, box-shadow .18s, color .18s, transform .18s;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);

  @media (max-width: 720px) {
    padding: 12px 12px;
    gap: 10px;
    font-size: 10.5px;
    letter-spacing: 0.16em;
  }

  &::after {
    content: '↗';
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 11px;
    color: rgba(180, 80, 255, 0.5);
    transition: color .18s, transform .18s;
  }

  &:hover, &:focus-visible {
    color: rgb(220, 170, 255);
    border-color: rgb(180, 80, 255);
    box-shadow: 0 0 18px rgba(180, 80, 255, 0.35), inset 0 0 22px rgba(180, 80, 255, 0.08);
    outline: none;
    transform: translateY(-1px);
  }
  &:hover::after, &:focus-visible::after {
    color: rgb(180, 80, 255);
    transform: translate(2px, -2px);
  }
`;

const Glyph = styled.span`
  position: relative;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: rgb(220, 170, 255);
  background: rgba(0, 0, 3, 0.7);
  border: 1px solid rgba(180, 80, 255, 0.55);
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  text-shadow: 0 0 6px rgba(180, 80, 255, 0.7);
`;

const Label = styled.span`
  display: flex;
  flex-direction: column;
  gap: 3px;
  & strong {
    font-weight: 600;
    color: rgb(220, 200, 255);
    letter-spacing: 0.22em;
    font-size: 11px;
  }
  & em {
    font-style: normal;
    font-size: 9px;
    letter-spacing: 0.18em;
    color: rgba(180, 80, 255, 0.7);
  }
`;

const Carrier = styled.div`
  position: relative;
  height: 22px;
  border: 1px solid rgba(180, 80, 255, 0.3);
  background: rgba(0, 0, 3, 0.55);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 10px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(180, 80, 255, 0.18), transparent);
    transform-origin: left;
    animation: ${carrierPulse} 2.6s ease-in-out infinite;
  }

  & span {
    position: relative;
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(180, 80, 255, 0.8);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(220, 200, 255, 0.6);
`;

const StatusDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgb(180, 80, 255);
  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgb(180, 80, 255);
    box-shadow: 0 0 8px rgba(180, 80, 255, 0.9);
  }
`;

interface ChannelLink {
  href: string;
  glyph: string;
  label: string;
  caption: string;
  external?: boolean;
}

const CHANNELS: ChannelLink[] = [
  { href: 'https://www.linkedin.com/in/whandthow', glyph: 'IN', label: 'LinkedIn', caption: 'Professional record', external: true },
  { href: 'https://github.com/whandthow',          glyph: 'GH', label: 'GitHub',   caption: 'Source repositories', external: true },
  { href: 'mailto:contact@whandthow.com',          glyph: '@',  label: 'Email',    caption: 'Direct uplink' },
  { href: 'https://t.me/whandthow',                glyph: 'TG', label: 'Telegram', caption: 'Realtime channel', external: true },
];

export function ContactEmergencyPanel() {
  return (
    <Panel $cut="hex" aria-label="engineer uplink secure channel">
      <PanelHeader>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PanelTag>MOD-04</PanelTag>
          <PanelTitle>ENGINEER UPLINK // SECURE CHANNEL</PanelTitle>
        </div>
        <PanelTag>VOID-LINK</PanelTag>
      </PanelHeader>
      <Body>
        <ContactGrid>
          {CHANNELS.map((c) => (
            <ContactTile key={c.label}>
              <ContactLink
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <Glyph aria-hidden>{c.glyph}</Glyph>
                <Label>
                  <strong>{c.label}</strong>
                  <em>{c.caption}</em>
                </Label>
              </ContactLink>
            </ContactTile>
          ))}
        </ContactGrid>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Carrier aria-hidden>
            <span>▸ CARRIER WAVE // 432 Hz · ENCRYPTED · LATENCY 18ms</span>
          </Carrier>
          <Footer>
            <span>UPLINK READY // ROUTE: VOID</span>
            <StatusDot>SIGNAL STATUS: SECURE</StatusDot>
          </Footer>
        </div>
      </Body>
    </Panel>
  );
}
