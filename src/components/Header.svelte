<script>
  let { mode, onModeChange, onShare, shareMessage, muted, onMuteToggle } = $props();
</script>

<header>
  <div class="left">
    <h1>Plink</h1>
  </div>
  <div class="right">
    <button
      class="mute-btn"
      onclick={onMuteToggle}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {#if muted}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      {:else}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      {/if}
    </button>
    <button
      class="mode-btn"
      class:active={mode === 'edit'}
      onclick={() => onModeChange(mode === 'play' ? 'edit' : 'play')}
      aria-label={mode === 'play' ? 'Switch to edit mode' : 'Switch to play mode'}
    >
      {mode === 'play' ? 'Edit' : 'Play'}
    </button>
    <button class="share-btn" onclick={onShare} aria-label="Share board">
      {shareMessage || 'Share'}
    </button>
  </div>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    flex-shrink: 0;
    z-index: 10;
  }

  h1 {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--text);
  }

  .right {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .mute-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(0,0,0,0.06);
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
  }

  .mute-btn:hover {
    background: rgba(0,0,0,0.1);
    color: var(--text);
  }

  .mode-btn, .share-btn {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.15s, color 0.15s;
  }

  .mode-btn {
    background: rgba(0,0,0,0.06);
    color: var(--text-muted);
  }

  .mode-btn:hover {
    background: rgba(0,0,0,0.1);
  }

  .mode-btn.active {
    background: var(--accent);
    color: white;
  }

  .share-btn {
    background: rgba(0,0,0,0.06);
    color: var(--text-muted);
  }

  .share-btn:hover {
    background: rgba(0,0,0,0.1);
    color: var(--text);
  }
</style>
