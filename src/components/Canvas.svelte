<script>
  import { onMount } from 'svelte';
  import { createMarble, stepSimulation, PEG_RADIUS, updateRadiiForBoard } from '../lib/physics.js';
  import { materializeBoard } from '../lib/board.js';
  import { initAudio, resumeAudio, playNote, setMasterVolume } from '../lib/audio.js';
  import { positionToFrequency } from '../lib/scales.js';
  import { render } from '../lib/renderer.js';

  let {
    mode, scale, gravity, autoDrop, muted, pegType,
    normalizedPegs, onPegsChanged,
  } = $props();

  let canvasEl;
  let ctx;
  let width = $state(800);
  let height = $state(500);
  let marbles = [];
  let pegs = [];
  let animId;
  let lastTime = 0;
  let autoDropTimer = 0;
  let audioStarted = $state(false);
  let reducedMotion = false;
  let dpr = 1;

  const DROP_ZONE_Y = 35;

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    dpr = window.devicePixelRatio || 1;
    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  });

  function resize() {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    canvasEl.style.width = width + 'px';
    canvasEl.style.height = height + 'px';
    ctx = canvasEl.getContext('2d');
    ctx.scale(dpr, dpr);
    rebuildPegs();
  }

  function rebuildPegs() {
    updateRadiiForBoard(normalizedPegs, width, height);
    pegs = materializeBoard(normalizedPegs, width, height);
  }

  // Rebuild pegs when normalizedPegs or dimensions change
  $effect(() => {
    // Read dependencies
    normalizedPegs;
    width;
    height;
    rebuildPegs();
  });

  $effect(() => {
    setMasterVolume(muted ? 0 : 0.5);
  });

  function ensureAudio() {
    if (!audioStarted) {
      initAudio();
      audioStarted = true;
    }
    resumeAudio();
  }

  function loop(timestamp) {
    animId = requestAnimationFrame(loop);
    if (!ctx) return;

    const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = timestamp;

    // Auto-drop
    if (autoDrop && mode === 'play') {
      autoDropTimer += dt;
      const interval = 0.5;
      if (autoDropTimer >= interval) {
        autoDropTimer -= interval;
        const x = width * 0.15 + Math.random() * width * 0.7;
        marbles.push(createMarble(x, DROP_ZONE_Y));
      }
    }

    // Physics step
    const newMarbles = stepSimulation(
      { marbles, pegs, width, height, gravity },
      dt,
      (peg, marble, collisionSpeed) => {
        peg.hitTime = performance.now();
        if (!muted && peg.type === 'tone') {
          ensureAudio();
          const nx = peg.nx !== undefined ? peg.nx : peg.x / width;
          const ny = peg.ny !== undefined ? peg.ny : peg.y / height;
          const freq = positionToFrequency(nx, ny, scale);
          const vel = Math.min(collisionSpeed / 500, 1);
          playNote(freq, vel, peg.id);
        }
      }
    );

    for (const nm of newMarbles) {
      marbles.push(nm);
    }

    // Render
    render(ctx, {
      width, height, pegs, marbles, scale, mode,
      dropZoneY: DROP_ZONE_Y,
    }, performance.now(), reducedMotion);
  }

  function handlePointerDown(e) {
    ensureAudio();
    const rect = canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'edit') {
      handleEditClick(x, y);
    } else {
      // Play mode: drop marble from top
      if (y < DROP_ZONE_Y + 30) {
        marbles.push(createMarble(x, DROP_ZONE_Y));
      } else {
        // Drop from click position (more fun)
        marbles.push(createMarble(x, Math.max(y - 20, DROP_ZONE_Y)));
      }
    }
  }

  function handleEditClick(x, y) {
    // Check if clicking near an existing peg
    const hitIndex = pegs.findIndex(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) < PEG_RADIUS * 1.5;
    });

    const updated = [...normalizedPegs];

    if (hitIndex !== -1) {
      // Remove peg
      updated.splice(hitIndex, 1);
    } else {
      // Add peg
      const nx = x / width;
      const ny = y / height;
      if (ny > 0.04 && ny < 0.95) {
        updated.push({ nx, ny, type: pegType });
      }
    }

    onPegsChanged(updated);
  }

  export function clearMarbles() {
    marbles.length = 0;
  }
</script>

<div class="canvas-wrap" role="application" aria-label="Marble machine playground">
  <canvas
    bind:this={canvasEl}
    onpointerdown={handlePointerDown}
  ></canvas>
  {#if !audioStarted && mode === 'play'}
    <div class="hint" aria-hidden="true">tap to drop marbles</div>
  {/if}
</div>

<style>
  .canvas-wrap {
    flex: 1;
    position: relative;
    min-height: 0;
    overflow: hidden;
    cursor: crosshair;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .hint {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 13px;
    color: var(--text-muted);
    pointer-events: none;
    opacity: 0.6;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
</style>
