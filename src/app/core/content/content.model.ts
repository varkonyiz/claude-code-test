import { Type } from '@angular/core';

/**
 * The content model that powers the whole app. Navigation, routes and pages are
 * all derived from these types, so adding new educational material never
 * requires touching the shell, router or page components:
 *
 *  - a new **topic**    = one `*.content.ts` file + one demo component, added to
 *                         its category's `topics` array;
 *  - a new **category** = one `Category` object registered in `content.registry.ts`.
 */

/** A single explanatory block on a topic page (Intent, Problem, Solution, ...). */
export interface Section {
  heading: string;
  /** Plain prose. Rendered as a paragraph; keep it free of HTML. */
  body: string;
}

/** A labelled, syntax-highlighted code sample shown on the "Code" tab. */
export interface CodeSample {
  label: string;
  /** highlight.js language id, e.g. `typescript`. */
  language: string;
  source: string;
}

/** One concept the user can learn — e.g. the Singleton pattern. */
export interface Topic {
  id: string;
  title: string;
  /** One-line hook shown on cards and the topic header. */
  tagline: string;
  /** ix-icon name representing the topic. */
  icon: string;
  sections: Section[];
  code: CodeSample[];
  /** Standalone component rendering the live, interactive demo. */
  demo: Type<unknown>;
}

/** A group of related topics — e.g. the Creational design patterns. */
export interface Category {
  id: string;
  title: string;
  description: string;
  /** ix-icon name for the category. */
  icon: string;
  /** Accent colour (any CSS colour) used to theme the category's cards. */
  accent: string;
  topics: Topic[];
}
