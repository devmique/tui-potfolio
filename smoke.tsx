// npx vite build --ssr smoke.tsx --outDir .smoke && node .smoke/smoke.js
import { renderToString } from 'react-dom/server'
import App from './src/App'
import { About, Certifications, Contact, Experience, Projects, Skills, Tips } from './src/sections'
import { WORDMARK } from './src/data'
import portrait from './src/portrait.txt?raw'

const must = (html: string, needle: string, what: string) => {
  if (!html.includes(needle)) throw new Error(`${what}: missing ${JSON.stringify(needle)}`)
}

// first paint is the empty PowerShell screen (typewriter starts at 0 chars) — the
// interactive UI must not render yet, but SEO/crawler content must, since a bot
// never types "devmique" to get past the boot gate.
const boot = renderToString(<App />)
if (boot.includes('Welcome back')) throw new Error('app: portfolio must not render before boot')
must(boot, 'Johnlord Mique', 'seo: name present before boot')
must(boot, 'TranSync PH', 'seo: projects present before boot')

must(renderToString(<About />), 'Johnlord Mique', 'about')
must(renderToString(<Experience />), 'Endsofttech Web Solutions', 'experience')
must(renderToString(<Skills />), 'PostgreSQL', 'skills')
must(renderToString(<Projects />), 'TranSync PH', 'projects')
const certs = renderToString(<Certifications />)
must(certs, 'certificates across', 'certs')
// the terminal scroll stays text-only: no inline images may creep back in
if (certs.includes('<img')) throw new Error('certs: rendered an inline image')
must(renderToString(<Contact />), 'miquejt13@gmail.com', 'contact')
must(renderToString(<Tips onPick={() => {}} commands={[{ cmd: '/about', help: 'x' }]} />), '/about', 'tips')

const widest = (s: string) => Math.max(...s.split('\n').map((l) => l.length))
if (widest(WORDMARK) > 70) throw new Error('wordmark too wide: ' + widest(WORDMARK))
if (widest(portrait) > 70) throw new Error('portrait too wide: ' + widest(portrait))

console.log(`smoke: ok (wordmark ${widest(WORDMARK)} cols, portrait ${widest(portrait)} cols)`)
