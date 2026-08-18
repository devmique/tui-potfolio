export function toAscii(lum, COLS, ROWS, { ramp, radius = 6, detail = 2.0, mix = 0.6, gamma = 1.0 }) {
  const inv = new Float64Array(COLS * ROWS);
  let lo = 1, hi = 0;
  for (let i = 0; i < inv.length; i++) { const k = 1 - lum[i]; inv[i] = k; if (k < lo) lo = k; if (k > hi) hi = k; }
  const span = hi - lo || 1; // flat image: keep it finite instead of NaN
  for (let i = 0; i < inv.length; i++) inv[i] = (inv[i] - lo) / span;

  // box blur in cell space (rows count double vertically since cells are ~2x tall)
  const blur = new Float64Array(COLS * ROWS);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    let s = 0, n = 0;
    for (let dr = -Math.round(radius / 2); dr <= Math.round(radius / 2); dr++)
      for (let dc = -radius; dc <= radius; dc++) {
        const rr = r + dr, cc = c + dc;
        if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
        s += inv[rr * COLS + cc]; n++;
      }
    blur[r * COLS + c] = s / n;
  }

  let art = '';
  for (let r = 0; r < ROWS; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const local = 0.5 + (inv[i] - blur[i]) * detail;
      let k = mix * local + (1 - mix) * inv[i];
      k = Math.pow(Math.max(0, Math.min(1, k)), gamma);
      line += ramp[Math.min(ramp.length - 1, Math.round(k * (ramp.length - 1)))];
    }
    art += line.replace(/\s+$/, '') + '\n';
  }
  return art;
}
