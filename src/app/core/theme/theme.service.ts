import { Injectable, signal } from '@angular/core';
import { themeSwitcher } from '@siemens/ix';

export type ThemeMode = 'light' | 'dark';

const THEME_NAME = 'classic';
const STORAGE_KEY = 'patterns-explained.theme-mode';

/**
 * Thin wrapper over iX's `themeSwitcher`. Applies the "classic" iX theme in the
 * chosen colour scheme, persists the choice, and exposes the current mode as a
 * signal so the UI (e.g. the header toggle icon) can react.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _mode = signal<ThemeMode>(this.readInitialMode());
  readonly mode = this._mode.asReadonly();

  /** Apply the stored/initial theme. Call once at startup. */
  init(): void {
    this.apply(this._mode());
  }

  toggle(): void {
    this.apply(this._mode() === 'dark' ? 'light' : 'dark');
  }

  private apply(mode: ThemeMode): void {
    themeSwitcher.setTheme(THEME_NAME, mode);
    this._mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage may be unavailable (private mode); ignore.
    }
  }

  private readInitialMode(): ThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // ignore
    }
    // Fall back to the OS preference, defaulting to dark.
    const prefersLight =
      typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }
}
