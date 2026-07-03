import { Component, signal } from '@angular/core';
import { IxButton, IxToggle } from '@siemens/ix-angular/standalone';

type LoadState = 'idle' | 'loading' | 'loaded';

interface Thumbnail {
  key: string;
  label: string;
  glyph: string;
  restricted: boolean;
  state: LoadState;
  denied: boolean;
}

/**
 * Proxy demo: a protection proxy blocks the restricted thumbnail unless the
 * user is authorized; a virtual proxy lazily "loads" each image once (a brief
 * Loading state) and caches it — clicking the same thumbnail again is instant
 * and the real-loads counter does not increase.
 */
@Component({
  selector: 'app-proxy-demo',
  imports: [IxButton, IxToggle],
  template: `
    <div class="demo">
      <div class="demo__toolbar">
        <ix-toggle
          [checked]="authorized()"
          textOn="Authorized user"
          textOff="Guest (not authorized)"
          (checkedChange)="setAuthorized($event.detail)"
        ></ix-toggle>
        <span class="counter">Real loads: <strong>{{ realLoads() }}</strong></span>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <p class="demo__hint">
        Click a thumbnail to view it. The restricted one needs authorization; every
        image loads for real only once, then is served from cache.
      </p>

      <div class="gallery">
        @for (thumb of thumbnails(); track thumb.key) {
          <button
            type="button"
            class="thumb"
            [class.thumb--restricted]="thumb.restricted"
            [class.thumb--denied]="thumb.denied"
            (click)="open(thumb.key)"
          >
            @if (thumb.restricted) {
              <span class="thumb__badge">restricted</span>
            }
            <span class="thumb__body">
              @if (thumb.state === 'loading') {
                <span class="thumb__status">Loading…</span>
              } @else if (thumb.state === 'loaded') {
                <span class="thumb__glyph">{{ thumb.glyph }}</span>
              } @else if (thumb.denied) {
                <span class="thumb__status thumb__status--denied">Access denied</span>
              } @else {
                <span class="thumb__glyph thumb__glyph--muted">{{ thumb.glyph }}</span>
              }
            </span>
            <span class="thumb__label">{{ thumb.label }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
      }
      .demo__toolbar {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        flex-wrap: wrap;
      }
      .counter {
        color: var(--theme-color-soft-text);
      }
      .counter strong {
        color: var(--theme-color-primary);
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }
      .thumb {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.25rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        cursor: pointer;
        font: inherit;
        color: var(--theme-color-std-text);
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
      }
      .thumb:hover {
        border-color: var(--theme-color-primary);
      }
      .thumb--denied {
        animation: shake 0.35s ease;
        border-color: var(--theme-color-warning);
      }
      .thumb__badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: var(--theme-color-warning);
        border: 1px solid var(--theme-color-warning);
        border-radius: 999px;
        padding: 0.1rem 0.5rem;
      }
      .thumb__body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 56px;
      }
      .thumb__glyph {
        font-size: 2.2rem;
      }
      .thumb__glyph--muted {
        opacity: 0.35;
      }
      .thumb__status {
        font-size: 0.85rem;
        color: var(--theme-color-soft-text);
      }
      .thumb__status--denied {
        color: var(--theme-color-warning);
        font-weight: 600;
      }
      .thumb__label {
        font-weight: 600;
      }
      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-4px);
        }
        75% {
          transform: translateX(4px);
        }
      }
    `,
  ],
})
export class ProxyDemo {
  readonly authorized = signal(false);
  readonly realLoads = signal(0);

  readonly thumbnails = signal<Thumbnail[]>([
    { key: 'mountain', label: 'Mountain', glyph: '🏔️', restricted: false, state: 'idle', denied: false },
    { key: 'vault', label: 'Vault', glyph: '🗄️', restricted: true, state: 'idle', denied: false },
    { key: 'city', label: 'City', glyph: '🏙️', restricted: false, state: 'idle', denied: false },
  ]);

  setAuthorized(value: boolean): void {
    this.authorized.set(value);
  }

  open(key: string): void {
    const thumb = this.thumbnails().find((t) => t.key === key);
    if (!thumb) return;

    // Protection proxy: block restricted content unless authorized.
    if (thumb.restricted && !this.authorized()) {
      this.updateThumb(key, { denied: true });
      setTimeout(() => this.updateThumb(key, { denied: false }), 500);
      return;
    }

    // Virtual proxy: already cached — instant, no reload, no counter bump.
    if (thumb.state === 'loaded') {
      return;
    }

    this.updateThumb(key, { state: 'loading', denied: false });
    setTimeout(() => {
      this.updateThumb(key, { state: 'loaded' });
      this.realLoads.update((n) => n + 1);
    }, 700);
  }

  private updateThumb(key: string, patch: Partial<Thumbnail>): void {
    this.thumbnails.update((list) =>
      list.map((t) => (t.key === key ? { ...t, ...patch } : t)),
    );
  }

  reset(): void {
    this.authorized.set(false);
    this.realLoads.set(0);
    this.thumbnails.update((list) =>
      list.map((t) => ({ ...t, state: 'idle' as LoadState, denied: false })),
    );
  }
}
