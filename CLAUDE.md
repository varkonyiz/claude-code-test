# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

**Patterns Explained** — an interactive learning app that teaches software design
concepts. Each topic has an explanation, real code, and a live interactive demo.
It currently covers the full Gang of Four catalog (5 Creational, 7 Structural, 11
Behavioral) plus the 5 SOLID principles — 28 topics across 4 categories — and is
designed to be extended with more (architectural patterns, prompting techniques).
See the `add-pattern-content` skill under `.claude/skills/` for the step-by-step
workflow and Siemens iX gotchas when adding new content.

Built with Angular 22 (standalone components) and the Siemens iX design system.

## Commands

- `npm start` / `ng serve` — dev server at `http://localhost:4200/` with live reload.
- `ng build` — production build, output to `dist/first-claude-app`.
- `ng test --watch=false` — run unit tests once via Vitest. Single file: append `-- <pattern>`.
- `ng generate component <name>` — scaffold via Angular schematics.
- `ng e2e` — no e2e framework configured; will fail until one is added.

## The content architecture (most important thing to understand)

Everything the app teaches is **data-driven** from a typed registry. Navigation,
routes, and pages are all derived from it, so **adding content never means editing
the shell, router, or page components**:

- **Model** — `src/app/core/content/content.model.ts` defines `Category` → `Topic`
  → `Section`/`CodeSample`. A `Topic.demo` is a `Type<unknown>` (a standalone
  component) rendered via `NgComponentOutlet` on the topic page.
- **Registry** — `src/app/core/content/content.registry.ts` exports `CATEGORIES`.
  This is the single place that lists categories.
- **Service** — `ContentService` (`content.service.ts`) exposes `categories()`,
  `getCategory(id)`, `getTopic(categoryId, topicId)` as the lookup surface used by
  the nav menu and all pages.

**To add a topic:** create `src/app/patterns/<category>/<topic>/<topic>.content.ts`
(a `Topic` object) + a `<topic>-demo.ts` standalone component, then add the topic
to its category's `topics` array (e.g. `patterns/creational/creational.category.ts`).

**To add a category:** create `patterns/<area>/<area>.category.ts` exporting a
`Category`, then append it to `CATEGORIES` in the registry. Nothing else changes.

### Routing & pages
- `app.routes.ts`: `''` (landing), `patterns/:categoryId` (overview),
  `patterns/:categoryId/:topicId` (detail), `**` → `''`. Pages resolve content from
  route params via `ContentService`, so there are **no per-topic routes**.
- Shell (`core/layout/shell/`) renders the iX application frame; its nav menu is
  generated from `ContentService.categories()`.
- Feature pages: `features/{landing,category,topic}/`. Topic detail uses `ix-tabs`
  for Live demo / Explanation / Code, and projects the demo with `NgComponentOutlet`.

## Siemens iX conventions (v5)

- **Import components from `@siemens/ix-angular/standalone`** (e.g. `IxButton`,
  `IxCard`) and add them to a component's `imports: []`. Do NOT expect NgModules.
- **Button variants**: `ix-button`/`ix-icon-button` use the `variant` prop only —
  `'primary' | 'secondary' | 'tertiary'` (plus `subtle-*` / `danger-*`). There is
  **no `ghost` or `outline` attribute** (they were removed; binding them fails the build).
- **Icons must be registered.** `<ix-icon name="x">` only renders icons registered
  via `addIcons`. All app icons are registered once in `src/app/core/icons.ts`
  (`registerAppIcons()`, called from `main.ts`). Add new icon names there; the
  name is the kebab-case of the imported symbol (`iconCircleDot` → `"circle-dot"`).
- **Theming / light-dark**: iX palettes are keyed by `[data-ix-theme][data-ix-color-schema]`
  attributes (NOT a body class), so `styles.css` imports the base CSS **plus**
  `theme/classic-dark.css` and `theme/classic-light.css`. `ThemeService`
  (`core/theme/theme.service.ts`) wraps iX's `themeSwitcher` (imported from
  `@siemens/ix`) to apply/persist the mode; the header toggle in `Shell` calls it.
  Use iX color tokens (`--theme-color-1`, `--theme-color-soft-text`, etc.) in custom
  CSS so it works in both modes.
- **Tabs**: `ix-tabs [activeTabKey]` + `(tabChange)="...($event.detail)"`, with
  `ix-tab-item tabKey="...">`.

## Other conventions

- **Standalone components, signals for state.** Bootstrap is
  `bootstrapApplication(App, appConfig)` in `main.ts`; no `AppModule`. Use
  `signal()`/`computed()` for component state (see the pattern demos).
- **Testing** uses Vitest; specs sit next to source (e.g.
  `core/content/content.service.spec.ts`). Avoid rendering iX web components in
  unit tests (jsdom) — prefer testing plain services/logic.
- **Budgets**: the iX theme is large, so `angular.json` production budgets are
  raised (initial 2–4 MB, component style 12–24 kB). Keep that in mind if adding
  heavy assets.
- Formatting is enforced via Prettier (`.prettierrc`).
