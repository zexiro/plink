let ctx = null;
let masterGain = null;
let compressor = null;
let reverbGain = null;
let dryGain = null;
let convolver = null;
let initialized = false;

// Rate-limit: track last trigger time per peg
const lastTrigger = new Map();
const MIN_RETRIGGER_MS = 50;

function createReverb(audioCtx) {
  const length = audioCtx.sampleRate * 0.8;
  const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  const conv = audioCtx.createConvolver();
  conv.buffer = impulse;
  return conv;
}

export function initAudio() {
  if (initialized) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.1;

  masterGain = ctx.createGain();
  masterGain.gain.value = 0.5;

  // Reverb send
  convolver = createReverb(ctx);
  reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.3;
  dryGain = ctx.createGain();
  dryGain.gain.value = 0.7;

  masterGain.connect(dryGain);
  masterGain.connect(convolver);
  convolver.connect(reverbGain);
  dryGain.connect(compressor);
  reverbGain.connect(compressor);
  compressor.connect(ctx.destination);

  initialized = true;
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

export function setMasterVolume(v) {
  if (masterGain) masterGain.gain.value = v;
}

/**
 * Play a note.
 * @param {number} frequency - Hz
 * @param {number} velocity - 0 to 1, affects volume
 * @param {string} pegId - unique peg identifier for rate limiting
 */
export function playNote(frequency, velocity, pegId) {
  if (!ctx || !initialized) return;

  // Rate limit per peg
  const now = performance.now();
  const last = lastTrigger.get(pegId) || 0;
  if (now - last < MIN_RETRIGGER_MS) return;
  lastTrigger.set(pegId, now);

  const t = ctx.currentTime;
  const vol = 0.15 + velocity * 0.35;

  // Triangle oscillator (main tone)
  const tri = ctx.createOscillator();
  tri.type = 'triangle';
  tri.frequency.value = frequency;

  // Sine sub-octave
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = frequency * 0.5;

  // Envelopes
  const triGain = ctx.createGain();
  triGain.gain.setValueAtTime(0, t);
  triGain.gain.linearRampToValueAtTime(vol, t + 0.005);
  triGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0, t);
  subGain.gain.linearRampToValueAtTime(vol * 0.4, t + 0.005);
  subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

  tri.connect(triGain);
  sub.connect(subGain);
  triGain.connect(masterGain);
  subGain.connect(masterGain);

  tri.start(t);
  sub.start(t);
  tri.stop(t + 0.5);
  sub.stop(t + 0.4);

  // Cleanup
  const cleanup = () => {
    try {
      triGain.disconnect();
      subGain.disconnect();
    } catch {}
  };
  tri.onended = cleanup;
}

export function isInitialized() {
  return initialized;
}
