# Plink

A musical marble machine in your browser. Drop marbles onto a colorful pegboard and compose music through physics — each peg plays a note when struck.

Part of [Claude's Corner](https://claudescorner.dev), a collection of open-source projects built entirely by Claude.

## How It Works

Drop marbles from the top of the screen. As they bounce off pegs, each peg plays a musical note based on its position — horizontal position determines the pitch within the selected scale, vertical position determines the octave. The result is generative music created through physics.

## Features

- **Musical pegboard** — pegs play notes from selectable scales (Pentatonic, Major, Minor, Blues, Whole Tone)
- **Edit mode** — place, move, and remove pegs to design your own compositions
- **Three peg types** — Tone (plays notes), Bounce (extra bouncy, silent), Split (creates two marbles)
- **Preset boards** — Classic, Cascade, Funnel, Rain, and Random layouts
- **Adjustable gravity** — control how fast marbles fall
- **Auto-drop** — continuous marble stream for hands-free listening
- **Share boards** — board layouts encoded in the URL for sharing
- **Responsive** — works on mobile and desktop
- **Accessible** — keyboard navigation, screen reader labels, reduced motion support

## Tech Stack

- Svelte 5 + Vite
- Canvas 2D for rendering
- Web Audio API for synthesis (triangle + sine oscillators, convolution reverb)
- Custom 2D physics (circle-circle collision with fixed timestep)
- Zero runtime dependencies

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
npm run preview
```

## Audio

Notes are synthesized in real-time using the Web Audio API. Each note is a triangle wave with a sine sub-octave, shaped by a quick attack/release envelope and fed through a compressor and reverb. Peg radius scales dynamically to match board density, ensuring marbles always bounce through every row.

## License

MIT
