import { useState, type ReactNode } from 'react'
import { A, Rotator } from './ui'
import { CERTIFICATE_ALBUMS, EXPERIENCE, ME, PROJECTS, SKILLS } from './data'

const Key = ({ children }: { children: ReactNode }) => (
  <span className="text-dim">{children}</span>
)

export function About() {
  return (
    <div className="space-y-2">
      <div><Key>name    </Key> <span className="text-accent">{ME.name}</span></div>
      <div className="flex gap-2"><Key>title   </Key> <Rotator items={ME.titles} /></div>
      <div className="flex flex-col sm:flex-row sm:gap-2">
        <Key>tagline </Key>
        <p className="max-w-[72ch] text-balance">{ME.tagline}</p>
      </div>
      <div className="flex flex-col gap-1 pt-1 sm:flex-row sm:flex-wrap sm:gap-4">
        {ME.links.map((l) => (
          <span key={l.url}>
            <Key>{l.label}: </Key>
            <A href={l.url}>{l.url}</A>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Experience() {
  return (
    <div className="space-y-2">
      {EXPERIENCE.map((e) => (
        <div key={e.company} className="border-l border-line pl-3">
          <div className="text-accent">{e.role}</div>
          <div className="text-sm">{e.company}</div>
          <div className="text-xs text-dim">{e.period}</div>
        </div>
      ))}
    </div>
  )
}

export function Skills() {
  return (
    <div className="space-y-2">
      <div className="text-dim">{SKILLS.length} technologies</div>
      <div className="flex flex-wrap gap-1.5">
        {SKILLS.map((s) => (
          <span key={s} className="rounded border border-line px-2 py-0.5 text-xs text-fg">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Projects() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-1">
      <div className="text-dim">{PROJECTS.length} repos · click one to expand</div>
      {PROJECTS.map((p, i) => {
        const isOpen = open === i
        return (
          <div key={p.name}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full cursor-pointer text-left hover:text-accent"
            >
              <span className="text-dim">{String(i + 1).padStart(2, '0')} </span>
              <span className={isOpen ? 'text-accent' : ''}>{p.name}</span>
              <span className="text-dim"> — {p.subtitle}</span>
              <span className="text-dim"> {isOpen ? '▾' : '▸'}</span>
            </button>
            {isOpen && (
              <div className="mt-1 mb-2 ml-3 space-y-1.5 border-l border-line pl-3 text-sm fadein">
                <p className="max-w-[74ch] text-fg">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded border border-line px-1.5 text-xs text-dim">{t}</span>
                  ))}
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                  <span><Key>github: </Key><A href={p.github}>{p.github}</A></span>
                  {p.live
                    ? <span><Key>live: </Key><A href={p.live}>{p.live}</A></span>
                    : <span><Key>live: n/a</Key></span>}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function Certifications() {
  const total = CERTIFICATE_ALBUMS.reduce((n, a) => n + a.certificates.length, 0)
  return (
    <div className="space-y-3">
      <div className="text-dim">
        {total} certificates across {CERTIFICATE_ALBUMS.length} platforms · click one to open it
      </div>
      {CERTIFICATE_ALBUMS.map((album) => (
        <div key={album.issuer}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: `hsl(${album.color})` }}>●</span>
            <span className="text-accent">{album.issuer}</span>
            <span className="text-dim">({album.certificates.length})</span>
          </div>
          {album.certificates.map((c, i) => (
            <a
              key={c.image}
              href={c.image}
              target="_blank"
              rel="noreferrer noopener"
              className="flex flex-wrap gap-x-3 pl-2 hover:text-accent"
            >
              <span className="text-dim">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">{c.title}</span>
              <span className="text-dim">{c.issueDate} ↗</span>
            </a>
          ))}
        </div>
      ))}
    </div>
  )
}

export function Contact() {
  return (
    <div className="max-w-[70ch] space-y-1.5">
      <div className="text-dim">reach me directly — I answer fastest by email.</div>
      <div>
        <Key>email&gt; </Key>
        <A href={`mailto:${ME.email}`}>{ME.email}</A>
      </div>
      <div>
        <Key>phone&gt; </Key>
        <A href={`tel:+63${ME.phone.replace(/\D/g, '').slice(1)}`}>{ME.phone}</A>
      </div>
      {ME.links.slice(0, 2).map((l) => (
        <div key={l.url}>
          <Key>{l.label.toLowerCase()}&gt; </Key>
          <A href={l.url}>{l.url}</A>
        </div>
      ))}
    </div>
  )
}

export function Tips({ onPick, commands }: {
  onPick: (cmd: string) => void
  commands: { cmd: string; help: string }[]
}) {
  return (
    <div>
      <div className="mb-2 text-sm text-accent">
        Tips for getting started
      </div>
      <ul className="space-y-1 text-sm">
        {commands.map((c) => (
          <li key={c.cmd}>
            <button
              onClick={() => onPick(c.cmd)}
              className="cursor-pointer rounded px-1 -mx-1 text-accent hover:bg-line/50"
            >
              {c.cmd}
            </button>
            <span className="text-dim"> — {c.help}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
