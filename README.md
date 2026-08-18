# tui-portfolio

Terminal-styled portfolio — React + TypeScript + Tailwind v4 (Vite).

```
npm run dev      # http://localhost:5173
npm run build
npm run check    # tone-mapper unit check + SSR smoke render of every section
```

## Where the content lives

Everything text lives in `src/data.ts`:

- `ME` — bio, rotating titles, contact links
- `EXPERIENCE` — work history, shown by `/experience`
- `SKILLS` — tech stack tags, shown by `/skills`
- `PROJECTS` — shown by `/projects`
- `CERTIFICATE_ALBUMS` — one entry per issuer, each with its certificates; shown by `/certifications`
- `RESUME_FILE`, `BOOT_TEXT`, `WORDMARK` — the resume path, PowerShell boot text, and ASCII logo

Everything else:

- `public/johnlord_mique_resume.pdf` — what `/resume` downloads. Replace the file, keep the name.
- `public/certificates/` — the certificate images `CERTIFICATE_ALBUMS` points at. Each file's
  path doubles as its shareable URL, so `/certifications` links straight to it — no build step,
  no import, just drop a file in and reference its `/certificates/<name>` path from `data.ts`.
- `src/portrait.txt` — ASCII portrait, generated from the photo. Regenerate with
  `node ascii.mjs <photo.jpg> src/portrait.txt` (crop box + contrast knobs are the
  consts at the top of `ascii.mjs`; the tone mapping lives in `tone.mjs`).
- `wordmark.mjs` — regenerates the `WORDMARK` constant (figlet "ANSI Shadow"). Run
  `node wordmark.mjs` after changing the word or its letterforms.
# tui-potfolio
