<script>
  import Header from './components/Header.svelte';
  import Canvas from './components/Canvas.svelte';
  import Controls from './components/Controls.svelte';
  import About from './components/About.svelte';
  import { PRESETS, generateRandom, encodeBoard, decodeBoard, materializeBoard } from './lib/board.js';
  import { SCALES } from './lib/scales.js';

  let view = $state('play');
  let mode = $state('play');
  let scale = $state('pentatonic');
  let gravity = $state(1);
  let autoDrop = $state(false);
  let muted = $state(false);
  let pegType = $state('tone');

  // Normalized peg data (0-1 positions)
  let normalizedPegs = $state([]);

  // Canvas ref for sharing
  let canvasComponent = $state(null);

  // Load from URL or use default
  function init() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = decodeBoard(hash);
      if (decoded) {
        normalizedPegs = decoded.pegs;
        scale = decoded.scale;
        return;
      }
    }
    normalizedPegs = PRESETS.classic.generate();
  }

  init();

  function handlePreset(presetId) {
    if (presetId === 'random') {
      normalizedPegs = generateRandom();
    } else if (PRESETS[presetId]) {
      normalizedPegs = PRESETS[presetId].generate();
    }
  }

  function handleShare() {
    const encoded = encodeBoard(normalizedPegs, scale);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      shareMessage = 'Copied!';
      setTimeout(() => shareMessage = '', 2000);
    }).catch(() => {
      shareMessage = 'Failed to copy';
      setTimeout(() => shareMessage = '', 2000);
    });
  }

  let shareMessage = $state('');

  function handlePegsChanged(pegs) {
    normalizedPegs = pegs;
  }
</script>

{#if view === 'play'}
<Header
  {mode}
  onModeChange={(m) => mode = m}
  onShare={handleShare}
  {shareMessage}
  {muted}
  onMuteToggle={() => muted = !muted}
/>

<Canvas
  bind:this={canvasComponent}
  {mode}
  {scale}
  {gravity}
  {autoDrop}
  {muted}
  {pegType}
  {normalizedPegs}
  onPegsChanged={handlePegsChanged}
/>

<footer class="codehawks-footer">
  <button class="about-link" onclick={() => view = 'about'}>About</button> · A <a href="https://www.codehawks.co.uk" target="_blank" rel="noopener noreferrer">CodeHawks</a> project
</footer>

<Controls
  {mode}
  {scale}
  onScaleChange={(s) => scale = s}
  {gravity}
  onGravityChange={(g) => gravity = g}
  {autoDrop}
  onAutoDropToggle={() => autoDrop = !autoDrop}
  onClear={() => canvasComponent?.clearMarbles()}
  onPreset={handlePreset}
  {pegType}
  onPegTypeChange={(t) => pegType = t}
/>
{:else if view === 'about'}
<About onClose={() => view = 'play'} />
{/if}

<style>
  :global(#app) {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  .codehawks-footer {
    position: fixed;
    bottom: 0.25rem;
    right: 0.5rem;
    font-size: 0.65rem;
    color: var(--text-muted);
    pointer-events: auto;
    z-index: 20;
  }
  .codehawks-footer a {
    color: var(--text-muted);
    text-decoration: none;
  }
  .codehawks-footer a:hover {
    text-decoration: underline;
  }
  .about-link {
    color: var(--text-muted);
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
  }
  .about-link:hover {
    text-decoration: underline;
  }
</style>
