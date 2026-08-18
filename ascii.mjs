import fs from 'fs';
import jpeg from 'jpeg-js';
import { toAscii } from './tone.mjs';

const [,, src, out] = process.argv;
const { width: W, height: H, data } = jpeg.decode(fs.readFileSync(src), { useTArray: true });

const cx0 = 0.19, cx1 = 0.83, cy0 = 0.04, cy1 = 0.88;
const x0 = Math.round(cx0 * W), x1 = Math.round(cx1 * W);
const y0 = Math.round(cy0 * H), y1 = Math.round(cy1 * H);
const cw = x1 - x0, ch = y1 - y0;

const COLS = 62;
const ROWS = Math.round((COLS * ch / cw) * 0.5);

const lum = new Float64Array(COLS * ROWS);
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const sx0 = x0 + Math.floor(c * cw / COLS), sx1 = x0 + Math.floor((c + 1) * cw / COLS);
  const sy0 = y0 + Math.floor(r * ch / ROWS), sy1 = y0 + Math.floor((r + 1) * ch / ROWS);
  let s = 0, n = 0;
  for (let y = sy0; y < sy1; y++) for (let x = sx0; x < sx1; x++) {
    const i = (y * W + x) * 4;
    s += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    n++;
  }
  lum[r * COLS + c] = s / n / 255;
}

// studio backdrop: grow a region inward from the top/side edges. a cell joins only if it
// steps smoothly from its neighbour (follows the vignette) AND stays inside the tone band
// the seeded border cells span — the band alone lets skin through, the step alone leaks
// through any soft spot on the hair outline. bottom edge is never seeded, shoulders reach it.
const at = (r, c) => lum[r * COLS + c];
const seedTone = [...Array(COLS)].map((_, c) => at(0, c)).sort((a, b) => a - b)[COLS >> 1];
const bg = new Uint8Array(COLS * ROWS);
const stack = [];
for (let c = 0; c < COLS; c++) stack.push([0, c]);
for (let r = 0; r < ROWS; r++) stack.push([r, 0], [r, COLS - 1]);
const seeds = stack.filter(([r, c]) => Math.abs(at(r, c) - seedTone) <= 0.12);
for (const [r, c] of stack) if (Math.abs(at(r, c) - seedTone) > 0.12) bg[r * COLS + c] = 2; // subject at the edge
const tones = seeds.map(([r, c]) => at(r, c));
const lo = Math.min(...tones) - 0.03, hi = Math.max(...tones) + 0.03;
while (stack.length) {
  const [r, c] = stack.pop();
  const i = r * COLS + c;
  if (bg[i]) continue;
  bg[i] = 1;
  for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nr = r + dr, nc = c + dc;
    if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS) continue;
    const v = at(nr, nc);
    if (!bg[nr * COLS + nc] && v >= lo && v <= hi && Math.abs(v - lum[i]) < 0.055) stack.push([nr, nc]);
  }
}

const art = toAscii(lum, COLS, ROWS, { ramp: ' .`:;+*%#@', radius: 7, detail: 2.4, mix: 0.62, gamma: 1.0 })
  .split('\n')
  .map((line, r) =>
    [...line.padEnd(COLS)].map((ch, c) => (bg[r * COLS + c] === 1 ? ' ' : ch)).join('').replace(/\s+$/, ''),
  )
  .join('\n');

// catches both failure modes of the fill: it did nothing, or it leaked into the subject
const cleared = bg.reduce((n, v) => n + (v === 1), 0) / bg.length;
if (cleared < 0.15 || cleared > 0.6) throw new Error(`backdrop fill cleared ${(cleared * 100) | 0}% of cells`);

fs.writeFileSync(out, art);
console.error(art);
