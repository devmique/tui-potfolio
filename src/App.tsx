import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import portrait from './portrait.txt?raw'
import { BOOT_TEXT, ME, RESUME_FILE, WORDMARK } from './data'
import { Loading, Panel } from './ui'
import { About, Certifications, Contact, Experience, Projects, Skills, Tips } from './sections'

/* ------------------------------------------------------------------ boot */

const NOT_RECOGNIZED = ` : The term is not recognized as a name of a cmdlet, function, or script file.
Type 'devmique' to start the portfolio session.`

function PowerShell({ instant, onLaunch }: { instant: boolean; onLaunch: () => void }) {
  const [n, setN] = useState(instant ? BOOT_TEXT.length : 0)
  const [value, setValue] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [cleared, setCleared] = useState(false) // cls wipes the banner too, like the real shell
  const CMD = 'devmique'

  // header typewriter
  useEffect(() => {
    if (n >= BOOT_TEXT.length) return
    const t = setTimeout(() => setN(n + 1), 17)
    return () => clearTimeout(t)
  }, [n])

  const ready = n >= BOOT_TEXT.length

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const v = value.trim()
    setValue('')
    const cmd = v.toLowerCase()
    if (cmd === CMD) return onLaunch()
    if (cmd === 'cls' || cmd === 'clear') {
      setErrors([])
      setCleared(true)
      return
    }
    if (v) setErrors((prev) => [...prev, v])
  }

  return (
    <div
      className="h-full overflow-y-auto p-3 text-[13px] leading-relaxed sm:p-6 sm:text-sm"
      onClick={() => document.getElementById('ps-input')?.focus()}
    >
      {!cleared && (
        <pre className="whitespace-pre-wrap break-words font-mono">{BOOT_TEXT.slice(0, n)}</pre>
      )}
      {errors.map((e, i) => (
        <pre key={i} className="whitespace-pre-wrap break-words font-mono text-red-400">
          {e + NOT_RECOGNIZED}
        </pre>
      ))}
      {ready && (
        <form onSubmit={submit} className="relative flex flex-wrap items-center">
          <span className="whitespace-pre">PS C:\Users\mique&gt; </span>
          <span className="break-all">{value}</span>
          <span className="cursor">&#9611;</span>
          <input
            id="ps-input"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="absolute inset-0 w-full bg-transparent text-base text-transparent opacity-0 outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </form>
      )}
      {ready && (
        <div className="mt-4 text-xs text-dim">
          type <span className="text-accent">devmique</span> and press enter
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------- commands */

type Cmd = {
  help: string
  loading: string
  ms: number
  render: () => ReactNode
  after?: () => void
}

function downloadResume() {
  const a = document.createElement('a')
  a.href = RESUME_FILE
  a.download = 'johnlord_mique_resume.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const COMMANDS: Record<string, Cmd> = {
  about: { help: 'learn more about me', loading: 'profiling', ms: 1500, render: () => <About /> },
  experience: { help: 'where I have worked', loading: 'replaying history', ms: 1500, render: () => <Experience /> },
  projects: { help: 'view my projects', loading: 'indexing repos', ms: 1500, render: () => <Projects /> },
  skills: { help: 'tech stack', loading: 'scanning stack', ms: 1500, render: () => <Skills /> },
  certifications: { help: 'certificates', loading: 'loading credentials', ms: 1500, render: () => <Certifications /> },
  contact: {
    help: 'get in touch',
    loading: 'opening channel',
    ms: 1500,
    render: () => <Contact />,
  },
  resume: {
    help: 'download my CV',
    loading: 'packaging file',
    ms: 480,
    render: () => <div className="text-emerald-400">downloaded: johnlord_mique_resume.pdf</div>,
    after: downloadResume,
  },
  clear: { help: 'reset terminal', loading: '', ms: 0, render: () => null },
}

const TIPS = Object.entries(COMMANDS).map(([cmd, c]) => ({ cmd: '/' + cmd, help: c.help }))

/* -------------------------------------------------------------- terminal */

function Welcome({ onPick }: { onPick: (cmd: string) => void }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      <Panel title="devmique v2.0.0" className="min-w-0 flex-1">
        <div className="w-full [container-type:inline-size]">
          <pre className="wordmark overflow-hidden font-mono" aria-label="DEVMIQUE">{WORDMARK}</pre>
        </div>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-1.5">
            <div className="text-sm">
              {ME.name} <span className="text-dim">&middot;</span> {ME.role}{' '}
              <span className="text-dim">&middot;</span> {ME.location}
            </div>
            <div className="text-dim">C:\Users\mique&gt;</div>
            <div className="pt-1 text-xs text-dim">type a command below, or tap one from the tips.</div>
          </div>
          <pre
            aria-label="ASCII portrait of Johnlord Mique"
            className="shrink-0 overflow-hidden font-mono text-[5.5px] leading-[1.05] text-fg/85 sm:text-[7px] md:text-[6.5px] lg:text-[7px]"
          >{portrait}</pre>
        </div>
      </Panel>
      <div className="lg:w-72 lg:shrink-0">
        <Tips onPick={onPick} commands={TIPS} />
      </div>
    </div>
  )
}

type Entry = { id: number; node: ReactNode }

function Terminal({ onExit }: { onExit: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const [hint, setHint] = useState(false)
  const [sel, setSel] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [exiting, setExiting] = useState(false)

  const idRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const loadingRef = useRef<{ id: number; timer: number } | null>(null)
  const armRef = useRef<number | null>(null)

  const append = useCallback((node: ReactNode) => {
    setEntries((e) => [...e, { id: ++idRef.current, node }])
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries, hint])

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim()
      if (!input) return
      setHistory((h) => [...h, input])
      setHIndex(-1)
      append(
        <div className="pt-2">
          <span className="text-accent">&gt;</span> <span className="text-fg">{input}</span>
        </div>,
      )

      const key = input.toLowerCase().replace(/^\//, '')
      if (key === 'clear' || key === 'cls') {
        setEntries([])
        return
      }
      const cmd = COMMANDS[key]
      if (!cmd) {
        append(
          <div>
            <div className="text-red-400">command not found: {input}</div>
            <div className="text-dim">available: {TIPS.map((t) => t.cmd).join('  ')}</div>
          </div>,
        )
        return
      }
      const id = ++idRef.current
      setEntries((e) => [...e, { id, node: <Loading label={cmd.loading} /> }])
      const timer = window.setTimeout(() => {
        loadingRef.current = null
        setEntries((e) => e.map((x) => (x.id === id ? { ...x, node: cmd.render() } : x)))
        cmd.after?.()
      }, cmd.ms)
      loadingRef.current = { id, timer }
    },
    [append],
  )

  /** returns true if a pending loading line was interrupted */
  const cancelLoading = useCallback(() => {
    const l = loadingRef.current
    if (!l) return false
    clearTimeout(l.timer)
    loadingRef.current = null
    setEntries((e) =>
      e.map((x) => (x.id === l.id ? { ...x, node: <span className="text-dim">^C</span> } : x)),
    )
    return true
  }, [])

  const exit = useCallback(() => {
    if (exiting) return
    setExiting(true)
    cancelLoading()
    setHint(false)
    append(<div className="pt-2 text-dim">Goodbye! &middot; session ended</div>)
    setTimeout(onExit, 850)
  }, [append, cancelLoading, exiting, onExit])

  // ctrl+c: once = hint, twice within 2.5s = exit; it always interrupts a loading line first
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.ctrlKey && (e.key === 'c' || e.key === 'C'))) return
      if (window.getSelection()?.toString()) return // let the browser copy
      e.preventDefault()
      if (cancelLoading()) return
      if (armRef.current !== null) {
        clearTimeout(armRef.current)
        armRef.current = null
        exit()
        return
      }
      setHint(true)
      armRef.current = window.setTimeout(() => {
        armRef.current = null
        setHint(false)
      }, 2500)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cancelLoading, exit])

  useEffect(
    () => () => {
      if (loadingRef.current) clearTimeout(loadingRef.current.timer)
      if (armRef.current) clearTimeout(armRef.current)
    },
    [],
  )

  // slash menu: typing "/" filters the command list; arrows pick, tab completes, enter runs
  const matches = dismissed || !value.startsWith('/')
    ? []
    : TIPS.filter((t) => t.cmd.startsWith(value.toLowerCase()))
  const pick = Math.min(sel, matches.length - 1)

  function submit(cmd: string) {
    run(cmd)
    setValue('')
    setSel(0)
    setDismissed(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (matches.length) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const step = e.key === 'ArrowDown' ? 1 : -1
        setSel((pick + step + matches.length) % matches.length)
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        setValue(matches[pick].cmd)
        setSel(0)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setDismissed(true)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        submit(matches[pick].cmd)
        return
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      submit(value)
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!history.length) return
      e.preventDefault()
      const next = e.key === 'ArrowUp' ? Math.min(hIndex + 1, history.length - 1) : hIndex - 1
      setHIndex(next)
      setValue(next < 0 ? '' : history[history.length - 1 - next])
    }
  }

  function focusInput(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('a, button, input, textarea')) return
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        onClick={focusInput}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3 text-[13px] leading-relaxed sm:p-5 sm:text-sm"
      >
        <div className="mx-auto w-full max-w-5xl space-y-1">
          <Welcome onPick={run} />
          {entries.map((e) => (
            <div key={e.id} className="fadein break-words">
              {e.node}
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-bg px-3 pt-2 pb-[env(safe-area-inset-bottom)] sm:px-5">
        <div className="mx-auto w-full max-w-5xl">
          {matches.length > 0 && (
            <div className="mb-1 max-h-52 overflow-y-auto text-[13px] sm:text-sm">
              {matches.map((m, i) => (
                <button
                  key={m.cmd}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => submit(m.cmd)}
                  className={`flex w-full cursor-pointer items-baseline gap-3 rounded px-2 py-0.5 text-left ${
                    i === pick ? 'bg-line/60 text-accent' : 'text-dim'
                  }`}
                >
                  <span className={`w-36 shrink-0 ${i === pick ? 'text-accent' : 'text-fg'}`}>{m.cmd}</span>
                  <span className="truncate text-dim">{m.help}</span>
                </button>
              ))}
            </div>
          )}
          <div
            onClick={() => inputRef.current?.focus()}
            className="relative flex cursor-text items-start gap-2 rounded-lg border border-line px-3 py-2 focus-within:border-accent/60"
          >
            <span className="text-accent">&gt;</span>
            <div className="min-w-0 flex-1 break-all text-[13px] sm:text-sm">
              {value || <span className="text-dim">try /about</span>}
              <span className="cursor text-accent">&#9611;</span>
            </div>
            <input
              ref={inputRef}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={exiting}
              className="absolute inset-0 h-full w-full bg-transparent px-3 text-base text-transparent opacity-0 outline-none"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setSel(0)
                setDismissed(false)
              }}
              onKeyDown={onKeyDown}
            />
            <button
              onClick={exit}
              className="cursor-pointer self-center rounded border border-line px-2 py-0.5 text-xs text-dim active:border-accent active:text-accent sm:hidden"
              aria-label="exit session"
            >
              &#10005; exit
            </button>
          </div>
          <div className="flex items-center justify-between py-1.5 text-[11px] text-dim">
            <span>
              {hint ? (
                <span className="text-accent">Press ctrl+c again to exit</span>
              ) : (
                <span>
                  &#9205;&#9205; auto mode on <span className="hidden sm:inline">&middot; &uarr;&darr; for history</span>
                </span>
              )}
            </span>
            <span className="hidden sm:inline">ctrl+c to exit</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- app */

export default function App() {
  const [phase, setPhase] = useState<'shell' | 'app'>('shell')
  const [booted, setBooted] = useState(false) // header only types itself out on the first boot
  const [session, setSession] = useState(0)

  return (
    <div className="h-full">
      {phase === 'shell' ? (
        <PowerShell
          key={session}
          instant={booted}
          onLaunch={() => {
            setBooted(true)
            setPhase('app')
          }}
        />
      ) : (
        <Terminal
          key={session}
          onExit={() => {
            setSession((s) => s + 1)
            setPhase('shell')
          }}
        />
      )}
    </div>
  )
}
