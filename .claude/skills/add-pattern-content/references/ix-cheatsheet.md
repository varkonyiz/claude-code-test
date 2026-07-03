# Siemens iX cheatsheet (v5) for this app

Read this before using any `ix-*` element in a demo. These are the things that cost
build failures or silent breakage when discovered by trial and error.

## Contents
- [Importing components](#importing-components)
- [Buttons — no ghost/outline](#buttons)
- [Icons — must be registered](#icons)
- [Form-ish controls (event payloads)](#controls)
- [Theme tokens (light + dark safe)](#theme-tokens)
- [Content model quick reference](#content-model)

<a id="importing-components"></a>
## Importing components

Import iX components from the **standalone** entry and add them to the component's
`imports`. There are no NgModules.

```ts
import { IxButton, IxCard, IxIcon } from '@siemens/ix-angular/standalone';

@Component({ imports: [IxButton, IxCard, IxIcon], /* … */ })
```

To discover the exact symbol for a component:
```bash
grep -oE 'Ix[A-Za-z]+' node_modules/@siemens/ix-angular/standalone/index.d.ts | sort -u | grep -i <name>
```

Commonly useful in demos: `IxButton`, `IxIconButton`, `IxIcon`, `IxCard`,
`IxCardContent`, `IxToggle`, `IxSelect`, `IxSelectItem`, `IxChip`, `IxSlider`.

<a id="buttons"></a>
## Buttons — no `ghost` / `outline`

In iX v5, `ix-button` and `ix-icon-button` are styled **only** via the `variant`
prop. The `ghost` and `outline` attributes from older iX **do not exist** and will
fail the build (`NG8002: Can't bind to 'outline'…`).

Valid `variant` values: `primary`, `secondary`, `tertiary`, and the style-prefixed
forms `subtle-primary`, `subtle-secondary`, `subtle-tertiary`, `danger-primary`, etc.

| Old habit            | Use instead                       |
| -------------------- | --------------------------------- |
| `<ix-button ghost>`  | `<ix-button variant="tertiary">`  |
| `<ix-button outline>`| `<ix-button variant="secondary">` |
| `<ix-icon-button ghost>` | `<ix-icon-button variant="subtle-secondary">` |

Other useful props: `icon="<name>"`, `iconRight`, `loading`, `disabled`. Icon-button
sizes: `size="24" | "16" | "12"`.

<a id="icons"></a>
## Icons — must be registered

`<ix-icon name="x">` (and any `icon="x"` on a button) renders **only** if the icon has
been registered via `addIcons`. The app registers its whole icon set once in
`src/app/core/icons.ts` (`registerAppIcons()`, called from `main.ts`). Add new icons
there, not per-component — that keeps names usable anywhere, including in content data.

```ts
// src/app/core/icons.ts
import { iconRocket } from '@siemens/ix-icons/icons';
addIcons({ /* … */, iconRocket });
```

Rules:
- The registered **name** is the kebab-case of the symbol: `iconCircleDot` →
  `"circle-dot"`, `iconBuildingBlock` → `"building-block"`.
- An unregistered or misspelled name renders as **blank space with no error** — always
  verify the symbol exists in the package:
  ```bash
  grep -oE 'icon[A-Za-z0-9]+' node_modules/@siemens/ix-icons/icons/index.d.ts | sort -u | grep -i <keyword>
  ```

If a demo itself needs an icon that the central registry doesn't have yet, you can also
`addIcons({ iconX })` in that demo's constructor — but prefer the central file for
anything referenced from content data (topic/category `icon` fields).

<a id="controls"></a>
## Form-ish controls — read the event `.detail`

These iX controls emit **CustomEvents**; bind the handler and read `$event.detail`.
Prefer these over native inputs so styling matches the theme.

**Toggle** (`IxToggle`) — boolean:
```html
<ix-toggle [checked]="on()" textOn="On" textOff="Off"
           (checkedChange)="setOn($event.detail)"></ix-toggle>
```

**Select** (`IxSelect` + `IxSelectItem`) — string value:
```html
<ix-select [value]="selected()" (valueChange)="onSelect($event.detail)">
  @for (opt of options; track opt.key) {
    <ix-select-item [label]="opt.label" [value]="opt.key"></ix-select-item>
  }
</ix-select>
```
```ts
onSelect(value: string | string[]) {
  this.selected.set(Array.isArray(value) ? value[0] : value);
}
```

**Tabs** are already handled by the topic-detail page (Live demo / Explanation /
Code) — a demo component does **not** render its own tabs. If you ever need tabs
inside a demo: `<ix-tabs [activeTabKey]="key()" (tabChange)="set($event.detail)">`
with `<ix-tab-item tabKey="…">`.

For simple choices, plain `ix-button`s with `(click)` and an `active` computed are
often clearer than a select — see `abstract-factory-demo.ts`.

<a id="theme-tokens"></a>
## Theme tokens (work in light AND dark)

The app supports a light/dark switch (iX `classic` theme, driven by `ThemeService`).
Style demos with iX CSS variables so both modes look right. Hard-coded greys/blacks
will look broken in one theme.

| Token                       | Use for                                  |
| --------------------------- | ---------------------------------------- |
| `--theme-color-1`           | base surface / page background           |
| `--theme-color-2`           | raised surface (panels, chips)           |
| `--theme-color-std-text`    | primary text                             |
| `--theme-color-soft-text`   | secondary / muted text                   |
| `--theme-color-soft-bdr`    | subtle borders/dividers                  |
| `--theme-color-primary`     | primary accent                           |
| `--theme-color-success`     | success/positive state                   |
| `--theme-color-warning`     | warning/negative state                   |

Fixed brand colours for a specific visual (e.g. a demo's category accent, a fixed
palette of chips) are fine — just make sure text stays legible on both themes. A handy
trick for tinted backgrounds that adapt: `color-mix(in srgb, var(--accent) 16%, transparent)`.

<a id="content-model"></a>
## Content model quick reference

From `src/app/core/content/content.model.ts` (source of truth — check it if unsure):

```ts
interface Section   { heading: string; body: string; }                 // one prose block
interface CodeSample{ label: string; language: string; source: string; } // highlight.js lang id
interface Topic     { id; title; tagline; icon; sections: Section[]; code: CodeSample[]; demo: Type<unknown>; }
interface Category  { id; title; description; icon; accent; topics: Topic[]; }
```

`demo` is the standalone component class itself (rendered on the topic page via
`NgComponentOutlet`). `language` is a highlight.js id, usually `'typescript'`.
