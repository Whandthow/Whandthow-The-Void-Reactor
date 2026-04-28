# Whandthow // The Void Reactor

Backend-poliglot portfolio rendered as a multilingual fission synthesizer.
Single Page Application — React + TypeScript + Styled Components.

## Stack

- React 18 + TypeScript (strict)
- Vite 5
- Styled Components 6 (chosen over Tailwind for the heavy clip-path / SVG geometry)
- Mock GitHub REST API stubs in `src/data/mockApi.ts` (drop-in replaceable)

## Architecture

- `src/App.tsx` — composes the geometric grid (TL · TR · CENTER · BL · BR).
- `src/components/BackgroundShader.tsx` — spacetime-distortion field (SVG turbulence + drifting grid + concentric pulse rings).
- `src/components/MultilingualCore.tsx` — central pulsing sphere with three nested geometric layers + dynamic `CORE_STABILITY`.
- `src/components/PolyglotFuelReactor.tsx` — top-left module, three rod components:
  - `rods/JavaEnterpriseFissionRod.tsx` — segmented HA column.
  - `rods/PythonSynthesisFissionRod.tsx` — sinusoidal AsyncIO snake.
  - `rods/DotNetIntegrationFissionRod.tsx` — burst-pulsing crystal.
- `src/components/ProjectReactionGraph.tsx` — top-right module, hexagonal/diamond node graph with language-aware lines (Java thick & slow, Python thin & fast, C# bursty), inline `REST API / GRAPHQL GW / WS SERVER` chips.
- `src/components/ActivityMonitorTerminal.tsx` — bottom-left, contribution waveform (smoothed SVG path with peak markers), oscilloscope (RAF-driven), and continuously generating `VOID_LOGS` terminal that pulses the oscilloscope amplitude.
- `src/components/ContactEmergencyPanel.tsx` — bottom-right, AZ-5 hexagonal emergency button + LinkedIn / GitHub / Email / Telegram links.
- `src/components/CursorDistortion.tsx` — custom reticle + 50px purple distortion field (radial gradient + backdrop blur) + decay trail.
- `src/components/ProjectGitGraphModal.tsx` — opens on node click; renders branching commit graph as geometric particle trajectories.
- `src/context/ResonanceContext.tsx` — cross-component state for **Polyglot Resonance** (rod hover lights up matching graph nodes/edges) and **Oscilloscope Resonance** (each new log bumps the wave amplitude).

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173/.

## Replacing mocks with real GitHub REST API

`src/data/mockApi.ts` exports the same async signatures you'd expect from a real backend:

```ts
fetchUserStats(): Promise<UserStats>
fetchLanguages(): Promise<LanguageEnrichment[]>
fetchRepositories(): Promise<Repository[]>
fetchContributionWaveform(days?): Promise<DailyCommit[]>
fetchGitGraph(repo): Promise<GitGraphNode[]>
```

Swap each implementation with a `fetch('https://api.github.com/...')` call mapped to the same shape — no component changes required.

## Color tokens

| Token | Value |
|---|---|
| `--color-bg-void` | `rgb(0, 0, 3)` |
| `--color-border-structural` | `rgba(100, 30, 200, 0.6)` |
| `--color-acc-electric-purple` | `rgb(180, 80, 255)` |
| `--color-glow-void` | `rgba(180, 80, 255, 0.4)` |
| `--color-emergency-orange` | `rgb(255, 100, 0)` |
