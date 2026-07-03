# claude-code-test — Patterns Explained

An interactive learning app for software design concepts. Every topic pairs a
plain-language explanation with real code **and a live, clickable demo**. It ships
with the complete **Gang of Four catalog** (Creational, Structural, Behavioral)
plus the **SOLID principles** — 28 topics in total — and is built to grow further
(architectural patterns, prompting techniques…).

Built with **Angular 22** (standalone components) and the **Siemens iX** design system.

## Quick start

```bash
npm install
npm start          # ng serve → http://localhost:4200/
```

## Common commands

```bash
npm start               # dev server with live reload
ng build                # production build → dist/
ng test --watch=false   # run unit tests once (Vitest)
```

## How it's organised

Content is **data-driven**: navigation, routes and pages are all generated from a
typed registry, so adding material never means touching the shell or router.

- Add a **topic**    → a `*.content.ts` data file + an interactive demo component,
  added to its category's `topics` array.
- Add a **category** → one `Category` object registered in
  `src/app/core/content/content.registry.ts`.

See [CLAUDE.md](CLAUDE.md) for the full architecture and iX integration notes, or
use the `add-pattern-content` Claude Code skill (`.claude/skills/`) to add new
topics/categories reliably.

## Personal info

The landing page's bio and LinkedIn link live in
`src/app/features/landing/author.ts` — edit the placeholders there.
