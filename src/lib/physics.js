let MARBLE_RADIUS = 10;
let PEG_RADIUS = 16;

/**
 * Set radii based on the average horizontal spacing between pegs.
 * This ensures pegs are large enough to create reliable Plinko bounces.
 */
export function updateRadiiForBoard(pegs, width, height) {
  if (pegs.length < 2) {
    PEG_RADIUS = 16;
    MARBLE_RADIUS = 10;
    return;
  }

  // Find the typical horizontal spacing by looking at the normalized x positions
  const sortedX = pegs.map(p => p.nx).sort((a, b) => a - b);
  let totalGap = 0;
  let gapCount = 0;
  for (let i = 1; i < sortedX.length; i++) {
    const gap = sortedX[i] - sortedX[i - 1];
    if (gap > 0.01) { // skip near-duplicates (pegs in same column)
      totalGap += gap;
      gapCount++;
    }
  }

  const avgNormSpacing = gapCount > 0 ? totalGap / gapCount : 0.1;
  const avgPixelSpacing = avgNormSpacing * width;

  // For Plinko coverage: PEG_RADIUS >= spacing / 3.2
  // Use spacing / 2.8 for solid coverage with some variety
  PEG_RADIUS = Math.max(8, Math.min(30, Math.round(avgPixelSpacing / 2.8)));
  MARBLE_RADIUS = Math.max(5, Math.round(PEG_RADIUS * 0.55));
}
const RESTITUTION_TONE = 0.55;
const RESTITUTION_BOUNCE = 0.85;
const RESTITUTION_SPLIT = 0.5;
const MAX_MARBLES = 50;
const FIXED_DT = 1 / 120;
const WALL_RESTITUTION = 0.5;
const DAMPING = 0.999;

export function createMarble(x, y) {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 40,
    vy: 0,
    radius: MARBLE_RADIUS,
    alive: true,
    trail: [],
  };
}

export function createPeg(x, y, type = 'tone') {
  return {
    x,
    y,
    radius: PEG_RADIUS,
    type,
    id: `${Math.round(x)}_${Math.round(y)}`,
    hitTime: 0,
  };
}

/**
 * Step the simulation forward.
 * @param {object} state - { marbles, pegs, width, height, gravity }
 * @param {number} frameDt - time since last frame in seconds
 * @param {function} onCollision - callback(peg, marble, speed)
 * @returns {object[]} newMarbles - any new marbles created (e.g. from splits)
 */
export function stepSimulation(state, frameDt, onCollision) {
  const { marbles, pegs, width, height, gravity } = state;
  const newMarbles = [];

  // Fixed timestep accumulator
  const dt = FIXED_DT;
  const steps = Math.min(Math.ceil(frameDt / FIXED_DT), 4);
  const grav = 980 * gravity;

  for (let s = 0; s < steps; s++) {
    for (let i = marbles.length - 1; i >= 0; i--) {
      const m = marbles[i];
      if (!m.alive) continue;

      // Gravity
      m.vy += grav * FIXED_DT;

      // Damping
      m.vx *= DAMPING;
      m.vy *= DAMPING;

      // Move
      m.x += m.vx * FIXED_DT;
      m.y += m.vy * FIXED_DT;

      // Wall collisions
      if (m.x - m.radius < 0) {
        m.x = m.radius;
        m.vx = Math.abs(m.vx) * WALL_RESTITUTION;
      } else if (m.x + m.radius > width) {
        m.x = width - m.radius;
        m.vx = -Math.abs(m.vx) * WALL_RESTITUTION;
      }

      // Floor — remove marble
      if (m.y - m.radius > height + 20) {
        m.alive = false;
        continue;
      }

      // Peg collisions
      for (const peg of pegs) {
        const dx = m.x - peg.x;
        const dy = m.y - peg.y;
        const distSq = dx * dx + dy * dy;
        const minDist = m.radius + peg.radius;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          if (dist === 0) continue;

          // Separate
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;
          m.x += nx * overlap;
          m.y += ny * overlap;

          // Reflect velocity
          const dot = m.vx * nx + m.vy * ny;
          if (dot < 0) {
            const rest =
              peg.type === 'bounce'
                ? RESTITUTION_BOUNCE
                : peg.type === 'split'
                  ? RESTITUTION_SPLIT
                  : RESTITUTION_TONE;

            m.vx -= (1 + rest) * dot * nx;
            m.vy -= (1 + rest) * dot * ny;

            // Add horizontal randomness to create varied paths
            m.vx += (Math.random() - 0.5) * 40;

            // Collision speed for audio
            const collisionSpeed = Math.abs(dot);

            // Split peg: create a new marble
            if (peg.type === 'split' && marbles.length + newMarbles.length < MAX_MARBLES) {
              const nm = createMarble(m.x, m.y);
              nm.vx = -m.vx * 0.8;
              nm.vy = m.vy * 0.8;
              newMarbles.push(nm);
            }

            onCollision(peg, m, collisionSpeed);
          }
        }
      }

      // Trail
      m.trail.push({ x: m.x, y: m.y });
      if (m.trail.length > 5) m.trail.shift();
    }
  }

  // Remove dead marbles
  for (let i = marbles.length - 1; i >= 0; i--) {
    if (!marbles[i].alive) marbles.splice(i, 1);
  }

  // Enforce max marbles
  while (marbles.length > MAX_MARBLES) {
    marbles.shift();
  }

  return newMarbles;
}

export { MARBLE_RADIUS, PEG_RADIUS, MAX_MARBLES };
