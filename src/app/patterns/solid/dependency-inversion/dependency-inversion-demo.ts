import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type SenderKey = 'email' | 'sms' | 'push';

interface Sender {
  key: SenderKey;
  label: string;
  glyph: string;
}

const SENDERS: Sender[] = [
  { key: 'email', label: 'Email', glyph: '📧' },
  { key: 'sms', label: 'SMS', glyph: '💬' },
  { key: 'push', label: 'Push', glyph: '🔔' },
];

/**
 * DIP demo: NotificationService (high-level) either depends directly on the
 * concrete EmailSender (tightly coupled) or on a Notifier abstraction that any
 * sender can implement (inverted). Switching senders in the tightly-coupled
 * design means editing NotificationService's source; in the inverted design
 * it's just picking a different implementation to plug in.
 */
@Component({
  selector: 'app-dependency-inversion-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <div class="demo__controls">
        <ix-button [variant]="inverted() ? 'secondary' : 'primary'" (click)="setInverted(false)">
          Tightly coupled
        </ix-button>
        <ix-button [variant]="inverted() ? 'primary' : 'secondary'" (click)="setInverted(true)">
          Depends on abstraction
        </ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <p class="demo__hint">Choose a sender, then send a notification.</p>

      <div class="senders">
        @for (s of senders; track s.key) {
          <ix-button
            [variant]="active().key === s.key ? 'primary' : 'secondary'"
            (click)="selectSender(s)"
          >
            {{ s.glyph }} {{ s.label }}
          </ix-button>
        }
      </div>

      <div class="core" [class.core--modified]="coreModified()">
        <span class="core__label">NotificationService</span>
        <span class="core__status">
          {{
            coreModified()
              ? 'source edited to hard-code ' + active().label + ' — needs re-review'
              : 'unmodified'
          }}
        </span>
      </div>

      <ix-button variant="primary" icon="rocket" (click)="notify()">Send notification</ix-button>

      @if (log().length > 0) {
        <ul class="log">
          @for (entry of log(); track $index) {
            <li>{{ entry }}</li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .demo__controls,
      .senders {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .core {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9rem 1.1rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        font-family: var(--theme-font-family-monospace, monospace);
        transition: border-color 0.3s ease, background 0.3s ease;
      }
      .core--modified {
        border-color: var(--theme-color-warning);
        background: color-mix(in srgb, var(--theme-color-warning) 16%, transparent);
        color: var(--theme-color-warning);
      }
      .log {
        margin: 0;
        padding: 0.9rem 1.1rem 0.9rem 1.5rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        font-size: 0.9rem;
      }
      .log li {
        padding: 0.15rem 0;
      }
    `,
  ],
})
export class DependencyInversionDemo {
  readonly senders = SENDERS;
  readonly inverted = signal(true);
  readonly active = signal<Sender>(SENDERS[0]);
  readonly coreModified = signal(false);
  readonly log = signal<string[]>([]);

  setInverted(on: boolean): void {
    this.inverted.set(on);
    this.reset();
  }

  selectSender(sender: Sender): void {
    if (sender.key === this.active().key) {
      return;
    }
    // Tightly coupled: NotificationService is hard-wired to one concrete sender,
    // so supporting a new one means editing its source. Depending on the
    // abstraction: swapping the plugged-in implementation touches nothing else.
    this.coreModified.set(!this.inverted());
    this.active.set(sender);
  }

  notify(): void {
    this.log.update((lines) => [...lines, `NotificationService → ${this.active().label} sent ✔`]);
  }

  reset(): void {
    this.active.set(SENDERS[0]);
    this.coreModified.set(false);
    this.log.set([]);
  }
}
