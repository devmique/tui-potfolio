// regenerates the WORDMARK constant in src/data.ts — figlet "ANSI Shadow", same
// letterforms the Claude Code banner uses. run: node wordmark.mjs
import fs from 'fs';

const G = {
  D: ['██████╗ ', '██╔══██╗', '██║  ██║', '██║  ██║', '██████╔╝', '╚═════╝ '],
  E: ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '███████╗', '╚══════╝'],
  V: ['██╗   ██╗', '██║   ██║', '██║   ██║', '╚██╗ ██╔╝', ' ╚████╔╝ ', '  ╚═══╝  '],
  M: ['███╗   ███╗', '████╗ ████║', '██╔████╔██║', '██║╚██╔╝██║', '██║ ╚═╝ ██║', '╚═╝     ╚═╝'],
  I: ['██╗', '██║', '██║', '██║', '██║', '╚═╝'],
  Q: [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║▄▄ ██║', '╚██████╔╝', ' ╚══▀▀═╝ '],
  U: ['██╗   ██╗', '██║   ██║', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
};

const word = 'DEVMIQUE';
const rows = [...Array(6)].map((_, r) => word.split('').map((ch) => G[ch][r]).join(''));

const widths = new Set(rows.map((r) => r.length));
if (widths.size !== 1) throw new Error('glyph rows disagree on width: ' + [...widths]);
const trimmed = rows.map((r) => r.replace(/\s+$/, ''));
const art = trimmed.join('\n');

const f = 'src/data.ts';
const src = fs.readFileSync(f, 'utf8');
const next = src.replace(
  /\/\/ figlet[\s\S]*$/,
  `// figlet "ANSI Shadow" block wordmark (${[...widths][0]} cols) — regenerate with wordmark.mjs\n` +
    'export const WORDMARK = [\n' +
    trimmed.map((r) => "  '" + r + "',\n").join('') +
    "].join('\\n')\n",
);
if (next === src) throw new Error('wordmark block not found in ' + f);
fs.writeFileSync(f, next);
console.log(art + `\n\n${[...widths][0]} cols x ${rows.length} rows -> ${f}`);
