# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a sandbox repo (`claude-code-test`) for testing Claude Code's capabilities. It currently contains a freshly scaffolded Angular 22 app with no custom functionality yet — expect the app shell (routing, single root component) to be the starting point for whatever gets built next.

## Commands

- `npm start` / `ng serve` — run the dev server at `http://localhost:4200/` with live reload.
- `ng build` — production build, output to `dist/first-claude-app`.
- `npm run watch` — development-configuration build in watch mode.
- `ng test` — run unit tests via Vitest. To run a single test file: `ng test -- <path-or-pattern>` (Vitest CLI args pass through after `--`).
- `ng generate component <name>` (or `directive`/`pipe`/etc.) — scaffold new pieces via Angular schematics.
- `ng e2e` — no e2e framework is configured yet; this will fail until one is added.

## Architecture

- **Standalone components, no NgModules.** The app bootstraps directly via `bootstrapApplication(App, appConfig)` in [src/main.ts](src/main.ts) — there is no `AppModule`. New components should follow the same standalone pattern (`imports: [...]` directly on the `@Component` decorator) rather than being declared in a module.
- **App-wide providers** (router, global error listeners) are registered in [src/app/app.config.ts](src/app/app.config.ts) via the `ApplicationConfig`/`provideX` pattern. Add new app-wide providers (HTTP client, etc.) here.
- **Routes** live in [src/app/app.routes.ts](src/app/app.routes.ts) and are wired in via `provideRouter(routes)`.
- **Root component** is `App` in [src/app/app.ts](src/app/app.ts) (selector `app-root`), using Angular signals (`signal(...)`) for state rather than plain class fields — follow this convention for component state in new code.
- **Testing** uses Vitest (not Karma/Jasmine, which is the older Angular default) — spec files sit next to the source they test, e.g. [src/app/app.spec.ts](src/app/app.spec.ts).
- Formatting is enforced via Prettier (`.prettierrc`).
