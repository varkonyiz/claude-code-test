import { Component, signal } from '@angular/core';
import { IxButton, IxToggle } from '@siemens/ix-angular/standalone';

interface Observer {
  name: string;
  glyph: string;
  subscribed: boolean;
  value: number | null;
  flash: boolean;
}

/**
 * Observer demo: a weather-station "subject" broadcasts a new reading; every
 * *subscribed* observer updates and flashes, while unsubscribed ones stay frozen
 * at their last value — showing that observers are decoupled and only react while
 * they're listening.
 */
@Component({
  selector: 'app-observer-demo',
  imports: [IxButton, IxToggle],
  template: `
    <div class="demo">
      <div class="subject">
        <span class="subject__label">Weather station (subject)</span>
        <span class="subject__value">{{ reading() }}°C</span>
        <ix-button variant="primary" icon="rocket" (click)="broadcast()">
          Broadcast new reading
        </ix-button>
      </div>

      <p class="demo__hint">
        Toggle who's subscribed, then broadcast. Only subscribers receive the update.
      </p>

      <div class="observers">
        @for (observer of observers(); track observer.name; let i = $index) {
          <div
            class="observer"
            [class.observer--muted]="!observer.subscribed"
            [class.observer--flash]="observer.flash"
          >
            <span class="observer__glyph">{{ observer.glyph }}</span>
            <span class="observer__name">{{ observer.name }}</span>
            <span class="observer__value">
              {{ observer.value === null ? '—' : observer.value + '°C' }}
            </span>
            <ix-toggle
              [checked]="observer.subscribed"
              textOn="Subscribed"
              textOff="Unsubscribed"
              (checkedChange)="setSubscribed(i, $event.detail)"
            ></ix-toggle>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .subject {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        flex-wrap: wrap;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .subject__label {
        font-weight: 600;
      }
      .subject__value {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--theme-color-primary);
        min-width: 4.5rem;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .observers {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
      }
      .observer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.55rem;
        padding: 1.1rem;
        border-radius: 12px;
        border: 1px solid var(--theme-color-soft-bdr);
        transition: box-shadow 0.3s ease, opacity 0.3s ease, border-color 0.3s ease;
      }
      .observer--muted {
        opacity: 0.55;
      }
      .observer--flash {
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 20px color-mix(in srgb, var(--theme-color-primary) 60%, transparent);
        animation: pulse 0.45s ease;
      }
      .observer__glyph {
        font-size: 1.9rem;
        line-height: 1;
      }
      .observer__name {
        font-weight: 600;
      }
      .observer__value {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--theme-color-std-text);
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        45% {
          transform: scale(1.08);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
  ],
})
export class ObserverDemo {
  readonly reading = signal(21);
  readonly observers = signal<Observer[]>([
    { name: 'Phone', glyph: '📱', subscribed: true, value: null, flash: false },
    { name: 'Dashboard', glyph: '🖥️', subscribed: true, value: null, flash: false },
    { name: 'Logger', glyph: '📈', subscribed: false, value: null, flash: false },
  ]);

  broadcast(): void {
    // New reading somewhere in a plausible range.
    const next = Math.round(15 + Math.random() * 15);
    this.reading.set(next);
    // Push to every subscriber; leave the rest untouched.
    this.observers.update((list) =>
      list.map((observer) =>
        observer.subscribed ? { ...observer, value: next, flash: true } : observer,
      ),
    );
    setTimeout(() => {
      this.observers.update((list) => list.map((observer) => ({ ...observer, flash: false })));
    }, 460);
  }

  setSubscribed(index: number, subscribed: boolean): void {
    this.observers.update((list) =>
      list.map((observer, i) => (i === index ? { ...observer, subscribed } : observer)),
    );
  }
}
