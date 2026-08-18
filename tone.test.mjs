// node tone.test.mjs — self-check for the ASCII tone mapper used by ascii.mjs
import assert from 'assert'
import { toAscii } from './tone.mjs'

const COLS = 8, ROWS = 4
const ramp = ' .:-=+*#'

// pure horizontal gradient, dark on the right -> after inversion the right side is the "ink"
const lum = new Float64Array(COLS * ROWS)
for (let r = 0; r < ROWS; r++)
  for (let c = 0; c < COLS; c++) lum[r * COLS + c] = 1 - c / (COLS - 1)

// mix: 1 = pure global tone, no local contrast, so the ramp must climb left -> right
const lines = toAscii(lum, COLS, ROWS, { ramp, mix: 0, radius: 1, detail: 0 }).split('\n')

assert.strictEqual(lines.length, ROWS + 1, 'one line per row (+ trailing newline)')
for (const line of lines.slice(0, ROWS)) {
  const idx = [...line.padEnd(COLS)].map((ch) => ramp.indexOf(ch))
  assert.ok(idx.every((i) => i >= 0), `every char comes from the ramp: ${JSON.stringify(line)}`)
  assert.deepStrictEqual(idx, [...idx].sort((a, b) => a - b), `monotonic: ${JSON.stringify(line)}`)
  assert.strictEqual(idx[0], 0, 'brightest pixel -> blank')
  assert.strictEqual(idx[COLS - 1], ramp.length - 1, 'darkest pixel -> densest char')
}

// a flat image has no structure (and must not divide by a zero range)
const flat = new Float64Array(COLS * ROWS).fill(0.5)
const flatChars = new Set(toAscii(flat, COLS, ROWS, { ramp, mix: 1, radius: 2, detail: 3 }).replace(/\n/g, ''))
assert.strictEqual(flatChars.size, 1, `flat input renders one char, got ${[...flatChars]}`)

// local contrast must actually draw an edge the global tone would flatten away
const edge = new Float64Array(COLS * ROWS).fill(0.5)
for (let r = 0; r < ROWS; r++) for (let c = COLS / 2; c < COLS; c++) edge[r * COLS + c] = 0.45
const edgeChars = new Set(toAscii(edge, COLS, ROWS, { ramp, mix: 1, radius: 1, detail: 3 }).replace(/\n/g, ''))
assert.ok(edgeChars.size > 1, 'an edge renders more than one char')

console.log('tone: ok')
