<script>
  let { onClose } = $props();
</script>

<div class="about">
  <nav class="about-nav">
    <button class="back-btn" onclick={onClose}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back
    </button>
  </nav>

  <h1>About Plink</h1>
  <p class="lede">A musical marble machine in your browser</p>

  <section>
    <h2>What is Plink?</h2>
    <p>
      Plink lets you drop marbles onto a pegboard and compose music through physics.
      Each peg plays a note when struck, with its pitch determined by its position on
      the board. The result is a playful, ever-changing composition that emerges from
      simple rules and gravity.
    </p>
  </section>

  <section>
    <h2>How it works</h2>
    <p>
      The board is made up of three peg types: <strong>Tone</strong> pegs play a musical
      note on contact, <strong>Bounce</strong> pegs deflect marbles without sound, and
      <strong>Split</strong> pegs break a marble into two. Choose from a variety of
      musical scales to change the mood, adjust gravity to speed up or slow down the
      action, and enable auto-drop mode to keep the music flowing hands-free.
    </p>
  </section>

  <section>
    <h2>Features</h2>
    <ul>
      <li><strong>Musical scales</strong> — Pentatonic, Major, Minor, Blues, and Whole Tone</li>
      <li><strong>Edit mode</strong> — Design your own custom boards</li>
      <li><strong>Shareable layouts</strong> — Share your board designs via URL</li>
      <li><strong>Physics-based composition</strong> — Every drop is a unique performance</li>
    </ul>
  </section>

  <section>
    <h2>Built at Claude's Corner</h2>
    <p>
      Plink is part of <a href="https://claudescorner.dev" target="_blank" rel="noopener noreferrer">Claude's Corner</a>,
      a collection of projects built by <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>.
      The source code is available on <a href="https://github.com/zexiro/plink" target="_blank" rel="noopener noreferrer">GitHub</a>.
    </p>
  </section>

  <button class="cta-btn" onclick={onClose}>Start playing</button>
</div>

<style>
  .about {
    height: 100%;
    overflow-y: auto;
    max-width: 640px;
    margin: 0 auto;
    padding: 2rem;
    font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif);
    color: var(--text, #333);
    background: var(--bg, #F5F0E8);
  }

  .about-nav {
    margin-bottom: 1.5rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: var(--text-muted, #888);
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.25rem 0;
    font-family: inherit;
  }

  .back-btn:hover {
    color: var(--text, #333);
  }

  h1 {
    font-size: 1.8rem;
    margin: 0 0 0.5rem;
    color: var(--text, #333);
  }

  .lede {
    font-size: 1.1rem;
    color: var(--text-muted, #888);
    margin: 0 0 2rem;
  }

  h2 {
    font-size: 1.2rem;
    margin: 1.5rem 0 0.5rem;
    color: var(--text, #333);
  }

  section p {
    line-height: 1.6;
    margin: 0 0 1rem;
    color: var(--text, #333);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
  }

  ul li {
    padding: 0.4rem 0;
    line-height: 1.5;
  }

  a {
    color: var(--accent, #E84855);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .cta-btn {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.75rem 2rem;
    background: var(--accent, #E84855);
    color: white;
    border: none;
    border-radius: 999px;
    font-size: 1rem;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .cta-btn:hover {
    opacity: 0.9;
  }
</style>
