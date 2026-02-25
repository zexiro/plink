# Plink — Musical Marble Machine

## Overview

Plink is a browser-based musical marble machine. Users drop marbles from the top of a pegboard, and as they bounce off pegs, each peg plays a musical note. Users can place, move, and remove pegs to design their own compositions — music created through physics.

**Who it's for:** Anyone who wants to play. Kids, musicians, people killing time, anyone who enjoys satisfying physics and sound.

**Why it's worth building:** It fills a massive gap in Claude's Corner. Every existing project (Breathing Room, Drift, Glyph) is contemplative, dark-themed, and cerebral. Plink is bright, colorful, tactile, and instantly fun. It's also technically interesting — real-time physics simulation combined with musical audio synthesis.

## Features & Interactions

### Core Mechanics
- **Marble Dropper**: Click/tap anywhere along the top edge to drop a marble. Marbles fall under gravity.
- **Peg Board**: A grid of circular pegs. Marbles bounce off pegs with realistic 2D physics (circle-circle collision).
- **Musical Pegs**: Each peg plays a note when struck. Notes are assigned based on peg position — X position maps to pitch within the selected scale, Y position maps to octave/register.
- **Peg Editor**: Toggle between Play mode and Edit mode. In Edit mode, click to place/remove pegs. Drag to move pegs.

### Peg Types
1. **Tone Peg** (default) — Plays a note on collision. Color reflects pitch.
2. **Bounce Peg** — Extra bouncy, no sound. White/silver appearance.
3. **Split Peg** — Splits one marble into two on contact. Glowing appearance.

### Controls
- **Scale Selector**: Choose musical scale (Pentatonic, Major, Minor, Blues, Chromatic, Whole Tone)
- **Tempo/Speed**: Control simulation speed (0.5x to 2x)
- **Gravity**: Adjustable gravity strength
- **Auto-Drop**: Toggle automatic marble dropping at regular intervals
- **Clear Marbles**: Remove all active marbles
- **Reset Board**: Return to default peg layout

### Preset Boards
- 3-4 built-in presets that demonstrate different musical patterns
- "Random" button that generates a random but musically interesting layout

### Sharing
- Board layout encoded in URL hash (peg positions + scale + peg types)
- "Share" button copies URL to clipboard
- Loading a shared URL reconstructs the board exactly

### States
1. **Initial Load**: Default peg layout with a brief hint ("Drop marbles from the top!"). Auto-drops a few marbles to demonstrate.
2. **Play Mode**: Click top area to drop marbles. Watch and listen.
3. **Edit Mode**: Grid overlay appears. Click to toggle pegs. Drag to reposition. Peg type selector visible.
4. **Empty Board**: "Place some pegs to get started!" message in edit mode.

## Information Architecture

### Single Page App (no routing needed)
```
┌─────────────────────────────────────────────┐
│  ☰ Plink                    [Edit] [Share]  │  ← Header
├─────────────────────────────────────────────┤
│  ┌─ Drop Zone ─────────────────────────┐    │
│  │  · · · · · · · · · · · · · · · · · │    │  ← Click to drop
│  └─────────────────────────────────────┘    │
│                                             │
│           ●       ●       ●                 │
│       ●       ●       ●       ●             │
│           ●       ●       ●                 │  ← Pegboard
│       ●       ●       ●       ●             │
│           ●       ●       ●                 │
│       ●       ●       ●       ●             │
│                                             │
│  ════════════════════════════════════════    │  ← Floor (marbles vanish)
├─────────────────────────────────────────────┤
│  Scale: [Pentatonic ▾]  Speed: [━●━━]      │
│  Gravity: [━━●━]  [Auto ○]  [Clear]        │  ← Controls
│  Preset: [Classic] [Cascade] [Rain] [Rand]  │
└─────────────────────────────────────────────┘
```

### Components
- `App.svelte` — Root layout, mode state, keyboard shortcuts
- `Canvas.svelte` — Main canvas element, render loop
- `Header.svelte` — Title, mode toggle, share button
- `Controls.svelte` — Scale, speed, gravity, presets panel
- `EditPanel.svelte` — Peg type selector, visible in edit mode

### Data Flow
- Physics state: marble positions/velocities, peg positions, collision detection — all in a simulation module
- Audio state: Web Audio nodes, note triggering — audio engine module
- UI state: Svelte 5 $state runes for mode, scale, speed, gravity
- Board state: Array of peg objects {x, y, type} — serializable for sharing

## Visual Design

### Color Palette
- **Background**: Warm off-white (#F5F0E8) — a departure from every other project's dark theme
- **Pegs**: Rainbow gradient based on pitch — low notes are warm (red/orange), high notes are cool (blue/violet)
  - C: #E84855 (red)
  - D: #F18F01 (orange)
  - E: #F9C22E (yellow)
  - F: #73D2A0 (green)
  - G: #3AAFB9 (teal)
  - A: #5B7FFF (blue)
  - B: #9B5DE5 (purple)
- **Marbles**: Dark charcoal (#333) with subtle gradient/shadow for 3D feel
- **Drop Zone**: Dotted line, subtle pulsing animation
- **Floor**: Gradient fade to nothing (marbles fade out as they exit)
- **Edit Grid**: Light gray dots (#DDD)
- **UI Controls**: Rounded, pill-shaped, warm grays with colored accents

### Typography
- **Title**: Bold, rounded sans-serif (system font stack with -apple-system, "Nunito" if available)
- **UI Labels**: Small, understated, uppercase tracking
- **Scale**: 16px base, generous whitespace

### Animations
- **Peg hit**: Brief scale-up pulse + glow in peg color (CSS keyframe on canvas overlay or canvas-drawn)
- **Marble trail**: Faint motion blur / trail effect
- **Drop zone**: Gentle bobbing dots suggesting "drop here"
- **Mode transition**: Controls panel slides up/down smoothly
- **Peg placement**: Pop-in animation with slight overshoot

### Overall Aesthetic
BRIGHT. COLORFUL. PLAYFUL. This should feel like a toy — rounded corners, soft shadows, bouncy animations. Think of it as the anti-Drift: where Drift is dark and meditative, Plink is light and joyful.

## Technical Architecture

### File Structure
```
plink/
├── index.html
├── package.json
├── vite.config.js
├── svelte.config.js
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js
│   ├── App.svelte
│   ├── components/
│   │   ├── Canvas.svelte
│   │   ├── Header.svelte
│   │   ├── Controls.svelte
│   │   └── EditPanel.svelte
│   ├── lib/
│   │   ├── physics.js        — Marble simulation, collision detection
│   │   ├── audio.js          — Web Audio synthesis, note mapping
│   │   ├── board.js          — Board state, presets, serialization
│   │   ├── scales.js         — Musical scale definitions
│   │   ├── renderer.js       — Canvas 2D rendering
│   │   └── sharing.js        — URL encoding/decoding
│   ├── stores/
│   │   └── state.svelte.js   — Global reactive state ($state runes)
│   └── styles/
│       └── global.css
├── PLAN.md
└── README.md
```

### Physics Engine (`physics.js`)
- **Simulation loop**: Fixed timestep (1/120s) with accumulator pattern for frame-rate independence
- **Gravity**: Configurable vector, default (0, 980) px/s²
- **Marble**: Circle with position, velocity, radius (8px)
- **Peg**: Static circle with radius (12px)
- **Collision**: Circle-circle intersection test. On collision:
  1. Reflect marble velocity off the collision normal
  2. Apply restitution coefficient (0.6 for tone pegs, 0.9 for bounce pegs)
  3. Add slight random perturbation to prevent perfectly symmetric paths
  4. Trigger audio callback with peg info
- **Walls**: Left/right boundaries reflect marbles
- **Floor**: Marbles below canvas bottom are removed
- **Max marbles**: Cap at 50 simultaneous marbles for performance

### Audio Engine (`audio.js`)
- **Synthesis**: Simple but warm — triangle wave + sine sub-octave, quick attack (5ms), medium release (300ms)
- **Note mapping**: Peg X position → scale degree, Peg Y position → octave (higher pegs = higher octave)
- **Velocity sensitivity**: Marble speed at collision affects note volume
- **Polyphony**: Object pool of oscillator nodes, reuse to prevent garbage
- **Master output**: Gentle compression + reverb (convolution with short IR or simple delay feedback)
- **Rate limiting**: Same peg won't retrigger within 50ms to prevent buzzing

### Rendering (`renderer.js`)
- **Canvas 2D**: Full-viewport canvas, device pixel ratio aware
- **Peg rendering**: Filled circles with color based on pitch. Subtle shadow. Hit animation: scale pulse drawn with timestamp
- **Marble rendering**: Dark filled circle with radial gradient for 3D look. Optional motion trail (last 3 positions, decreasing alpha)
- **Drop zone**: Dashed line at top with animated dots
- **Grid (edit mode)**: Light dot grid for peg placement alignment
- **Performance**: Only redraw changed regions if needed, but full redraw at 60fps should be fine for this complexity

### Board & Sharing (`board.js`, `sharing.js`)
- Board state: `{ pegs: [{x, y, type}], scale: string, gravity: number, speed: number }`
- Serialization: Compact encoding — peg positions as grid indices (5-bit x, 5-bit y, 2-bit type), packed into base64 URL hash
- Presets: Hardcoded arrays of peg positions for built-in layouts

### State Management (`state.svelte.js`)
```js
// Svelte 5 $state runes
export const appState = $state({
  mode: 'play',        // 'play' | 'edit'
  scale: 'pentatonic',
  speed: 1,
  gravity: 1,
  autoDrop: false,
  pegType: 'tone',     // Selected type in edit mode
  board: defaultBoard,
  muted: false
});
```

## Audio System Detail

### Scale Definitions (`scales.js`)
```
Pentatonic: [0, 2, 4, 7, 9]          — C D E G A
Major:      [0, 2, 4, 5, 7, 9, 11]   — C D E F G A B
Minor:      [0, 2, 3, 5, 7, 8, 10]   — C D Eb F G Ab Bb
Blues:       [0, 3, 5, 6, 7, 10]      — C Eb F Gb G Bb
Whole Tone: [0, 2, 4, 6, 8, 10]      — C D E F# G# A#
```

### Note-to-Frequency
- Base: C3 (130.81 Hz)
- Range: C3 to C6 (3 octaves)
- Peg Y maps linearly to octave range (top = high, bottom = low)
- Peg X maps to scale degree (left = lower degree, right = higher)

### Synthesis Chain
```
TriangleOsc → GainNode (envelope) ─┐
                                    ├→ MasterGain → Compressor → Reverb → Destination
SineOsc (sub) → GainNode (envelope)─┘
```

## Accessibility Plan

- **Keyboard Navigation**: Tab through controls, Enter/Space to activate buttons
- **Screen Reader**: ARIA labels on all interactive elements, live region for marble drop count
- **Edit Mode**: Arrow keys to move selected peg, Enter to place, Delete to remove
- **Reduced Motion**: Respect `prefers-reduced-motion` — disable marble trails, reduce animations
- **Color**: Pegs have both color AND position to convey pitch (not color-dependent)
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Mute**: Clear mute/unmute toggle

## Responsive Strategy

### Mobile (< 640px)
- Canvas fills full width, ~65vh height
- Controls stack vertically below canvas
- Touch: tap top of canvas to drop marble
- Edit mode: tap to place/remove pegs, long-press to drag
- Smaller pegs and marbles (scaled proportionally)

### Tablet (640-1024px)
- Similar to mobile but with more breathing room
- Controls in a horizontal row

### Desktop (> 1024px)
- Canvas centered with max-width 800px
- Controls below canvas in a clean horizontal layout
- Hover states on pegs in edit mode

## Edge Cases

- **No audio context**: Show "Tap to enable sound" overlay (mobile browsers require user gesture)
- **Too many marbles**: Cap at 50, oldest marble removed when new one spawns
- **Empty board**: Show helpful prompt in center
- **Shared URL too long**: Graceful fallback if URL is truncated
- **Browser resize**: Canvas resizes, peg positions are stored as ratios (0-1) and scaled to canvas size
- **Performance degradation**: Monitor FPS, reduce marble trails if dropping below 30fps

## Performance Budget

- **Bundle size**: < 50KB gzipped (Svelte + custom code, no libraries)
- **Runtime**: 60fps with 50 marbles on mid-range devices
- **Audio latency**: < 20ms from collision to sound (Web Audio scheduling)
- **First paint**: < 1s (minimal assets, no fonts to load)
- **Memory**: < 30MB (mostly canvas buffer)

## Preset Boards

### "Classic" (Default)
Triangle/diamond arrangement, 5 rows, offset. The standard Plinko layout. Musical result: random but always pleasant (pentatonic scale).

### "Cascade"
Pegs arranged in a waterfall pattern — dense at top, spreading out at bottom. Creates rapid-fire notes that slow into a melody.

### "Funnel"
V-shape that channels marbles to the center. Creates a satisfying convergence of sound.

### "Rain"
Sparse, random-looking arrangement. Marbles take long, unpredictable paths. Ambient, generative music.
