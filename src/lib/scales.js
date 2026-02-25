export const SCALES = {
  pentatonic: { name: 'Pentatonic', degrees: [0, 2, 4, 7, 9] },
  major: { name: 'Major', degrees: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: 'Minor', degrees: [0, 2, 3, 5, 7, 8, 10] },
  blues: { name: 'Blues', degrees: [0, 3, 5, 6, 7, 10] },
  wholetone: { name: 'Whole Tone', degrees: [0, 2, 4, 6, 8, 10] },
};

const BASE_FREQ = 130.81; // C3

export function getFrequency(semitones) {
  return BASE_FREQ * Math.pow(2, semitones / 12);
}

/**
 * Map a normalized position (0-1 for x, 0-1 for y) to a frequency.
 * X maps to scale degree, Y maps to octave (0=top=high, 1=bottom=low).
 */
export function positionToFrequency(nx, ny, scaleName) {
  const scale = SCALES[scaleName] || SCALES.pentatonic;
  const degrees = scale.degrees;

  // 3 octaves range (C3 to C6)
  const totalOctaves = 3;

  // Y: top is high pitch, bottom is low — invert
  const octaveFloat = (1 - ny) * totalOctaves;
  const octave = Math.floor(octaveFloat);

  // X: left to right maps across scale degrees
  const degreeIndex = Math.floor(nx * degrees.length) % degrees.length;
  const semitone = degrees[degreeIndex];

  const totalSemitones = octave * 12 + semitone;
  return getFrequency(totalSemitones);
}

/**
 * Get the note color based on the scale degree (chromatic position).
 */
const NOTE_COLORS = [
  '#E84855', // C - red
  '#EC6547', // C#
  '#F18F01', // D - orange
  '#F5A623', // D#
  '#F9C22E', // E - yellow
  '#73D2A0', // F - green
  '#4FC4A0', // F#
  '#3AAFB9', // G - teal
  '#4A97D8', // G#
  '#5B7FFF', // A - blue
  '#7B6FE8', // A#
  '#9B5DE5', // B - purple
];

export function positionToColor(nx, ny, scaleName) {
  const scale = SCALES[scaleName] || SCALES.pentatonic;
  const degrees = scale.degrees;
  const degreeIndex = Math.floor(nx * degrees.length) % degrees.length;
  const semitone = degrees[degreeIndex];
  return NOTE_COLORS[semitone % 12];
}
