import { useEffect, useState, type ReactNode } from 'react'

export function Panel({
  title, children, className = '',
}: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line bg-panel/60 ${className}`}>
      {title && (
        <div className="border-b border-line px-3 py-1.5 text-[11px] sm:text-xs text-accent">
          {title}
        </div>
      )}
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  )
}

/** simple orange-on-dark pixel robot */
export function Robot({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      <g fill="#d97757">
        <rect x="7" y="1" width="2" height="2" />
        <rect x="3" y="3" width="10" height="1" />
        <rect x="2" y="4" width="1" height="6" /><rect x="13" y="4" width="1" height="6" />
        <rect x="3" y="10" width="10" height="1" />
        <rect x="1" y="6" width="1" height="2" /><rect x="14" y="6" width="1" height="2" />
        <rect x="6" y="12" width="4" height="1" />
        <rect x="4" y="13" width="8" height="2" />
      </g>
      <g fill="#0d0d0d">
        <rect x="3" y="4" width="10" height="6" />
        <rect x="5" y="13" width="1" height="2" /><rect x="10" y="13" width="1" height="2" />
      </g>
      <g fill="#f2b8a2">
        <rect x="5" y="6" width="2" height="2" /><rect x="9" y="6" width="2" height="2" />
      </g>
    </svg>
  )
}

/** animated "…" while a command pretends to work */
export function Loading({ label }: { label: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v + 1) % 4), 220)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="text-dim">
      <span className="text-accent">*</span> {label}
      <span>{'.'.repeat(n)}</span>
    </div>
  )
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-accent underline decoration-line underline-offset-2 hover:decoration-accent break-all"
    >
      {children}
    </a>
  )
}

/** cycles strings with a typewriter effect. ms per step: */
const TYPE = 70 // per character typed
const ERASE = 40 // per character deleted
const HOLD = 1400 // full word stays on screen
const PAUSE = 300 // empty gap before the next word

export function Rotator({ items }: { items: string[] }) {
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [back, setBack] = useState(false)
  // every branch ends in a state change, so the effect always re-runs and the loop keeps going
  useEffect(() => {
    if (!back && len === items[i].length) {
      const t = setTimeout(() => setBack(true), HOLD)
      return () => clearTimeout(t)
    }
    if (back && len === 0) {
      const t = setTimeout(() => {
        setBack(false)
        setI((v) => (v + 1) % items.length)
      }, PAUSE)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLen(len + (back ? -1 : 1)), back ? ERASE : TYPE)
    return () => clearTimeout(t)
  }, [len, i, back, items])
  return (
    <span className="text-fg">
      {items[i].slice(0, len)}
      <span className="cursor text-accent">▊</span>
    </span>
  )
}
