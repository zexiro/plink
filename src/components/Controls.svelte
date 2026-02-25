<script>
  import { SCALES } from '../lib/scales.js';
  import { PRESETS } from '../lib/board.js';

  let {
    mode,
    scale, onScaleChange,
    gravity, onGravityChange,
    autoDrop, onAutoDropToggle,
    onClear,
    onPreset,
    pegType, onPegTypeChange,
  } = $props();

  const scaleKeys = Object.keys(SCALES);
  const presetKeys = Object.keys(PRESETS);
</script>

<div class="controls" role="toolbar" aria-label="Controls">
  {#if mode === 'edit'}
    <div class="row">
      <span class="label" id="peg-type-label">Peg type</span>
      <div class="peg-types" role="radiogroup" aria-labelledby="peg-type-label">
        <button
          class="peg-type-btn"
          class:active={pegType === 'tone'}
          onclick={() => onPegTypeChange('tone')}
        >
          <span class="dot tone"></span> Tone
        </button>
        <button
          class="peg-type-btn"
          class:active={pegType === 'bounce'}
          onclick={() => onPegTypeChange('bounce')}
        >
          <span class="dot bounce"></span> Bounce
        </button>
        <button
          class="peg-type-btn"
          class:active={pegType === 'split'}
          onclick={() => onPegTypeChange('split')}
        >
          <span class="dot split"></span> Split
        </button>
      </div>
    </div>
  {/if}

  <div class="row">
    <label class="label" for="scale-select">Scale</label>
    <select id="scale-select" value={scale} onchange={(e) => onScaleChange(e.target.value)}>
      {#each scaleKeys as key}
        <option value={key}>{SCALES[key].name}</option>
      {/each}
    </select>
  </div>

  <div class="row">
    <label class="label" for="grav-range">Gravity</label>
    <input
      id="grav-range"
      type="range"
      min="0.2"
      max="2"
      step="0.1"
      value={gravity}
      oninput={(e) => onGravityChange(parseFloat(e.target.value))}
      aria-label="Gravity strength"
    />
    <span class="value">{gravity.toFixed(1)}x</span>
  </div>

  <div class="row buttons">
    <button
      class="pill-btn"
      class:active={autoDrop}
      onclick={onAutoDropToggle}
      aria-pressed={autoDrop}
    >
      Auto
    </button>
    <button class="pill-btn" onclick={onClear}>Clear</button>
    {#each presetKeys as key}
      <button class="pill-btn preset" onclick={() => onPreset(key)}>
        {PRESETS[key].name}
      </button>
    {/each}
    <button class="pill-btn preset" onclick={() => onPreset('random')}>
      Random
    </button>
  </div>
</div>

<style>
  .controls {
    flex-shrink: 0;
    padding: 10px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--bg-panel);
    border-top: 1px solid rgba(0,0,0,0.06);
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    min-width: 52px;
  }

  .value {
    font-size: 12px;
    color: var(--text-muted);
    min-width: 32px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  input[type="range"] {
    flex: 1;
    max-width: 160px;
    accent-color: var(--accent);
    height: 20px;
  }

  .buttons {
    gap: 6px;
  }

  .pill-btn {
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(0,0,0,0.06);
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
  }

  .pill-btn:hover {
    background: rgba(0,0,0,0.1);
    color: var(--text);
  }

  .pill-btn.active {
    background: var(--accent);
    color: white;
  }

  .pill-btn.preset {
    background: rgba(0,0,0,0.04);
  }

  .pill-btn.preset:hover {
    background: rgba(0,0,0,0.08);
  }

  .peg-types {
    display: flex;
    gap: 6px;
  }

  .peg-type-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 14px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(0,0,0,0.04);
    color: var(--text-muted);
    transition: background 0.15s;
  }

  .peg-type-btn:hover {
    background: rgba(0,0,0,0.08);
  }

  .peg-type-btn.active {
    background: rgba(0,0,0,0.12);
    color: var(--text);
  }

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot.tone { background: #E84855; }
  .dot.bounce { background: #BBBBC0; }
  .dot.split { background: #FFD700; }

  @media (max-width: 480px) {
    .controls {
      padding: 8px 12px 12px;
      gap: 6px;
    }
    input[type="range"] {
      max-width: 120px;
    }
  }
</style>
