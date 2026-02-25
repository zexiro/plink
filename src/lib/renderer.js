import { MARBLE_RADIUS, PEG_RADIUS } from './physics.js';
import { positionToColor } from './scales.js';

const TWO_PI = Math.PI * 2;
const HIT_ANIM_DURATION = 200; // ms

/**
 * Draw everything to the canvas.
 */
export function render(canvasCtx, state, now, reducedMotion) {
  const { width, height, pegs, marbles, scale, mode, dropZoneY } = state;
  const ctx = canvasCtx;

  ctx.clearRect(0, 0, width, height);

  // Drop zone
  drawDropZone(ctx, width, dropZoneY, now, mode);

  // Grid in edit mode
  if (mode === 'edit') {
    drawGrid(ctx, width, height);
  }

  // Pegs
  for (const peg of pegs) {
    drawPeg(ctx, peg, scale, now, width, height);
  }

  // Marbles
  for (const marble of marbles) {
    drawMarble(ctx, marble, reducedMotion);
  }

  // Floor fade
  drawFloor(ctx, width, height);
}

function drawDropZone(ctx, width, y, now, mode) {
  ctx.save();
  ctx.setLineDash([6, 8]);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, y);
  ctx.lineTo(width - 20, y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Animated dots
  const dotCount = 5;
  const spacing = (width - 40) / (dotCount + 1);
  for (let i = 0; i < dotCount; i++) {
    const dx = 20 + spacing * (i + 1);
    const bounce = Math.sin(now / 600 + i * 0.8) * 3;
    ctx.beginPath();
    ctx.arc(dx, y - 10 + bounce, 3, 0, TWO_PI);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
  }

  // Label
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.textAlign = 'center';
  ctx.fillText(mode === 'edit' ? 'edit mode — click to place pegs' : 'tap here to drop marbles', width / 2, y - 20);
  ctx.restore();
}

function drawGrid(ctx, width, height) {
  ctx.save();
  const step = 30;
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  for (let x = step; x < width; x += step) {
    for (let y = step; y < height; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, TWO_PI);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawPeg(ctx, peg, scale, now, canvasW, canvasH) {
  const nx = peg.nx !== undefined ? peg.nx : peg.x / canvasW;
  const ny = peg.ny !== undefined ? peg.ny : peg.y / canvasH;

  let color;
  if (peg.type === 'bounce') {
    color = '#BBBBC0';
  } else if (peg.type === 'split') {
    color = '#FFD700';
  } else {
    color = positionToColor(nx, ny, scale);
  }

  // Hit animation
  const timeSinceHit = now - (peg.hitTime || 0);
  const hitScale = timeSinceHit < HIT_ANIM_DURATION
    ? 1 + 0.4 * (1 - timeSinceHit / HIT_ANIM_DURATION)
    : 1;

  const glowAlpha = timeSinceHit < HIT_ANIM_DURATION
    ? 0.4 * (1 - timeSinceHit / HIT_ANIM_DURATION)
    : 0;

  ctx.save();

  // Glow
  if (glowAlpha > 0) {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, PEG_RADIUS * hitScale * 1.8, 0, TWO_PI);
    ctx.fillStyle = color.replace(')', `,${glowAlpha})`).replace('rgb', 'rgba').replace('#', '');
    // Convert hex to rgba for glow
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    ctx.fillStyle = `rgba(${r},${g},${b},${glowAlpha})`;
    ctx.fill();
  }

  // Shadow
  ctx.beginPath();
  ctx.arc(peg.x, peg.y + 2, PEG_RADIUS * hitScale, 0, TWO_PI);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fill();

  // Main peg
  ctx.beginPath();
  ctx.arc(peg.x, peg.y, PEG_RADIUS * hitScale, 0, TWO_PI);
  ctx.fillStyle = color;
  ctx.fill();

  // Highlight
  ctx.beginPath();
  ctx.arc(peg.x - 3, peg.y - 3, PEG_RADIUS * hitScale * 0.4, 0, TWO_PI);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fill();

  // Split peg indicator
  if (peg.type === 'split') {
    ctx.font = `bold ${Math.round(PEG_RADIUS * hitScale)}px sans-serif`;
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('×', peg.x, peg.y + 1);
  }

  // Bounce peg indicator
  if (peg.type === 'bounce') {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, PEG_RADIUS * hitScale * 0.5, 0, TWO_PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

function drawMarble(ctx, marble, reducedMotion) {
  ctx.save();

  // Trail
  if (!reducedMotion && marble.trail.length > 1) {
    ctx.beginPath();
    ctx.moveTo(marble.trail[0].x, marble.trail[0].y);
    for (let i = 1; i < marble.trail.length; i++) {
      ctx.lineTo(marble.trail[i].x, marble.trail[i].y);
    }
    ctx.lineTo(marble.x, marble.y);
    ctx.strokeStyle = 'rgba(50,50,50,0.15)';
    ctx.lineWidth = MARBLE_RADIUS * 1.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Shadow
  ctx.beginPath();
  ctx.arc(marble.x, marble.y + 2, MARBLE_RADIUS, 0, TWO_PI);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fill();

  // Main marble
  const grad = ctx.createRadialGradient(
    marble.x - 2, marble.y - 2, 1,
    marble.x, marble.y, MARBLE_RADIUS
  );
  grad.addColorStop(0, '#555');
  grad.addColorStop(1, '#222');
  ctx.beginPath();
  ctx.arc(marble.x, marble.y, MARBLE_RADIUS, 0, TWO_PI);
  ctx.fillStyle = grad;
  ctx.fill();

  // Specular highlight
  ctx.beginPath();
  ctx.arc(marble.x - 2, marble.y - 2, MARBLE_RADIUS * 0.35, 0, TWO_PI);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fill();

  ctx.restore();
}

function drawFloor(ctx, width, height) {
  const grad = ctx.createLinearGradient(0, height - 40, 0, height);
  grad.addColorStop(0, 'rgba(245,240,232,0)');
  grad.addColorStop(1, 'rgba(245,240,232,1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, height - 40, width, 40);
}
