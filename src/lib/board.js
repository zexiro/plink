import { createPeg } from './physics.js';

/**
 * Generate the "Classic" preset — staggered triangle rows.
 */
function classicBoard(cols, rows) {
  const pegs = [];
  const spacingX = 1 / (cols + 1);
  const spacingY = 1 / (rows + 2);

  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : spacingX * 0.5;
    const count = row % 2 === 0 ? cols : cols - 1;
    for (let col = 0; col < count; col++) {
      const nx = spacingX * (col + 1) + offset;
      const ny = spacingY * (row + 1.5);
      pegs.push({ nx, ny, type: 'tone' });
    }
  }
  return pegs;
}

/**
 * Generate the "Cascade" preset — dense at top, sparse at bottom.
 */
function cascadeBoard() {
  const pegs = [];
  const rows = [10, 9, 8, 7, 6, 5, 4, 3, 3];
  for (let row = 0; row < rows.length; row++) {
    const count = rows[row];
    const ny = (row + 1) / (rows.length + 2);
    for (let col = 0; col < count; col++) {
      const nx = (col + 1) / (count + 1);
      pegs.push({ nx, ny, type: 'tone' });
    }
  }
  return pegs;
}

/**
 * Generate the "Funnel" preset — V shape that converges.
 */
function funnelBoard() {
  const pegs = [];
  const rows = 9;
  for (let row = 0; row < rows; row++) {
    const spread = 0.48 - row * 0.04;
    const count = 2 + row;
    const ny = (row + 1.5) / (rows + 2);
    for (let col = 0; col < count; col++) {
      const t = count === 1 ? 0.5 : col / (count - 1);
      const nx = 0.5 - spread + t * spread * 2;
      pegs.push({ nx, ny, type: 'tone' });
    }
  }
  return pegs;
}

/**
 * Generate the "Rain" preset — sparse, random-ish.
 */
function rainBoard() {
  const pegs = [];
  // Seeded random for consistency
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 28; i++) {
    const nx = 0.1 + rand() * 0.8;
    const ny = 0.08 + rand() * 0.8;
    pegs.push({ nx, ny, type: 'tone' });
  }
  return pegs;
}

/**
 * Generate a random board.
 */
function randomBoard() {
  const pegs = [];
  const count = 25 + Math.floor(Math.random() * 15);
  for (let i = 0; i < count; i++) {
    const nx = 0.08 + Math.random() * 0.84;
    const ny = 0.08 + Math.random() * 0.82;
    const types = ['tone', 'tone', 'tone', 'tone', 'bounce', 'split'];
    const type = types[Math.floor(Math.random() * types.length)];
    pegs.push({ nx, ny, type });
  }
  return pegs;
}

export const PRESETS = {
  classic: { name: 'Classic', generate: () => classicBoard(9, 9) },
  cascade: { name: 'Cascade', generate: cascadeBoard },
  funnel: { name: 'Funnel', generate: funnelBoard },
  rain: { name: 'Rain', generate: rainBoard },
};

export function generateRandom() {
  return randomBoard();
}

/**
 * Convert normalized peg data to actual pegs for a given canvas size.
 */
export function materializeBoard(normalizedPegs, width, height) {
  return normalizedPegs.map((p) => {
    const peg = createPeg(p.nx * width, p.ny * height, p.type);
    peg.nx = p.nx;
    peg.ny = p.ny;
    return peg;
  });
}

/**
 * Encode board state to a compact URL-safe string.
 */
export function encodeBoard(normalizedPegs, scale) {
  const data = {
    p: normalizedPegs.map((p) => [
      Math.round(p.nx * 1000),
      Math.round(p.ny * 1000),
      p.type === 'tone' ? 0 : p.type === 'bounce' ? 1 : 2,
    ]),
    s: scale,
  };
  return btoa(JSON.stringify(data));
}

/**
 * Decode board state from URL string.
 */
export function decodeBoard(str) {
  try {
    const data = JSON.parse(atob(str));
    const types = ['tone', 'bounce', 'split'];
    const pegs = data.p.map(([x, y, t]) => ({
      nx: x / 1000,
      ny: y / 1000,
      type: types[t] || 'tone',
    }));
    return { pegs, scale: data.s || 'pentatonic' };
  } catch {
    return null;
  }
}
