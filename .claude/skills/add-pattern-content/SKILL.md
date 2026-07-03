---
name: add-pattern-content
description: >-
  Add or edit educational content in the "Patterns Explained" Angular app in THIS
  repository — a new topic/pattern, a whole new category, a new interactive demo, or
  a topic's explanation/code. Use this whenever someone wants to grow or change the
  app's teaching catalog: e.g. "add the Observer pattern", "create a SOLID principles
  section", "add a page for the Adapter pattern", "make an interactive demo for
  Strategy", "add prompting techniques as a category", or "rewrite the Builder
  explanation and add a code sample". Trigger even if the user never says "skill" or
  "content" — any request to add/extend a pattern, category, or demo here counts. It
  encodes this app's content-registry architecture (topics and categories driven from
  a typed registry) and the Siemens iX v5 gotchas that otherwise cause build failures,
  so following it is far more reliable than editing by hand. Do NOT use it for
  abstract design-pattern questions ("explain Factory vs Abstract Factory"), writing
  about patterns outside this app, fixing app bugs, general Angular component
  scaffolding or UI features, tests, docs, or deployment — those are not catalog
  changes.
---

# Add Pattern Content

This app teaches software concepts through interactive demos. Content is **fully
data-driven from a typed registry** — navigation, routes, and pages are all derived
from it, so you add material by adding data + a demo component, never by editing the
shell, router, or page components. This skill exists because getting the wiring and
the Siemens iX quirks right by trial-and-error is slow; following the steps below
gets it right the first time.

## The mental model

- A **Category** (e.g. "Creational Patterns") holds **Topics** (e.g. "Singleton").
- A **Topic** has: metadata, explanation `sections`, `code` samples, and a `demo`
  (a standalone Angular component with the live, interactive visualization).
- The registry (`src/app/core/content/content.registry.ts`) lists categories. The
  `ContentService` resolves everything; pages read from it via route params.

Types live in `src/app/core/content/content.model.ts` — read it once; it's short and
is the contract everything else follows.

## Two workflows

Pick based on the request:

- **Adding a topic to an existing category** → follow "Add a topic".
- **Adding a whole new subject area** → follow "Add a category" (which then adds
  topics into it).

Before writing anything, look at an existing example end-to-end so your new files
match the house style: `src/app/patterns/creational/singleton/` (a simple demo) and
`src/app/patterns/creational/builder/` (a demo with staged animation). Mirror their
structure, naming, comment density, and the section/prose voice.

---

## Add a topic

1. **Create the folder** `src/app/patterns/<category>/<topic>/` (kebab-case topic id,
   e.g. `factory-method`).

2. **Write the demo component** `<topic>-demo.ts`. Start from
   [assets/templates/pattern-demo.ts.template](assets/templates/pattern-demo.ts.template).
   Key conventions:
   - Standalone component, class named `<Topic>Demo` (e.g. `StrategyDemo`), selector
     `app-<topic>-demo`. Inline `template` and `styles` (that's the established style
     for demos — keeps each demo self-contained in one file).
   - Use Angular **signals** (`signal`, `computed`) for state.
   - The demo should make the pattern *visible and interactive* — a control the user
     clicks/toggles/selects that produces a visible, animated result. Aim for an
     "aha", not a wall of text (the explanation tab already carries the prose).
   - Style with **iX theme tokens** (`var(--theme-color-1)`, `--theme-color-soft-text`,
     `--theme-color-primary`, …) so it looks right in both light and dark themes.
     See [references/ix-cheatsheet.md](references/ix-cheatsheet.md) for the token list
     and the iX component/API gotchas — read it before using any `ix-*` element.

3. **Write the content** `<topic>.content.ts`. Start from
   [assets/templates/topic.content.ts.template](assets/templates/topic.content.ts.template).
   Export `const <topic>Topic: Topic`. Fill:
   - `id` (matches the folder), `title`, `tagline` (one-line hook), `icon` (see step 5).
   - `sections`: use the house set — **Intent**, **Problem it solves**, **How it works**
     (reference what the demo shows), **When to use it**, **Real-world analogy**.
   - `code`: one concise, self-contained `CodeSample` (usually `language: 'typescript'`)
     that a reader can grasp in isolation.
   - `demo`: import and reference the demo class.

4. **Register the topic** — add `<topic>Topic` to the `topics` array in
   `src/app/patterns/<category>/<category>.category.ts`.

5. **Register the icon** — the `icon` string is an iX icon name. It only renders if
   registered in `src/app/core/icons.ts`. Add the `iconXxx` import and include it in
   the `addIcons({ … })` call. The name is the kebab-case of the symbol
   (`iconBuildingBlock` → `"building-block"`). **Verify the icon exists first** (icons
   that don't exist fail silently as blank space):
   ```bash
   grep -ixE 'iconYourGuess' <(grep -oE 'icon[A-Za-z0-9]+' node_modules/@siemens/ix-icons/icons/index.d.ts | sort -u)
   ```
   If unsure of the name, browse candidates:
   `grep -oE 'icon[A-Za-z0-9]+' node_modules/@siemens/ix-icons/icons/index.d.ts | sort -u | grep -i <keyword>`

6. **Verify** (see the checklist at the bottom).

---

## Add a category

1. **Create** `src/app/patterns/<category>/` and add topics inside it (each via the
   "Add a topic" flow above).

2. **Write the category file** `src/app/patterns/<category>/<category>.category.ts`
   from [assets/templates/category.ts.template](assets/templates/category.ts.template).
   Export `const <category>Category: Category` with `id`, `title`, `description`,
   `icon` (register it, step 5 above), `accent` (a CSS colour — drives the card/badge
   accents; pick something distinct from existing categories), and the `topics` array.

3. **Register the category** — in `src/app/core/content/content.registry.ts`, import it
   and append to `CATEGORIES`. Nothing else changes: the nav menu, the
   `/patterns/:categoryId` overview, and topic routing all pick it up automatically.

4. **Verify.**

---

## Verification checklist

Run from the repo root (`D:\Source\first-claude-app`). On Windows, Node/npm live on
the machine PATH — if `npm`/`ng` aren't found in the shell, prefix commands by
refreshing PATH, or run via the configured preview server.

1. `npx ng build` — must complete with no errors. iX quirks (button `variant` values,
   `[value]`/`(valueChange)` on selects, unregistered icons) surface here first.
2. `npx ng test --watch=false` — the `ContentService` spec asserts every topic has a
   demo, sections, and code, so a half-wired topic fails fast.
3. Run the app (preview server `angular-dev-server`, or `npm start`) and:
   - open `/patterns/<category>` — the new card appears with its icon;
   - open the topic — the **Live demo** tab actually responds to interaction, the
     **Explanation** tab shows the sections, and **Code** is syntax-highlighted;
   - toggle light/dark (header sun/moon) and confirm the demo reads well in both;
   - check the browser console is clean (no errors).

Don't consider the work done until the demo has been clicked in the browser — a demo
that compiles but doesn't react is the most common failure mode.

## Common pitfalls (all covered in the cheatsheet)

- Using `ghost`/`outline` on `ix-button` — those attributes don't exist in iX v5; use
  `variant="secondary"` / `"tertiary"`.
- Using an icon name that isn't registered (or doesn't exist) → blank space, no error.
- Hard-coding colours instead of theme tokens → looks broken in one of the themes.
- Forgetting to add the topic to its category's `topics` array, or the category to
  `CATEGORIES` → content silently absent.
