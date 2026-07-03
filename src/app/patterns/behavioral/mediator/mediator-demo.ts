import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconCommentAlt, iconShare } from '@siemens/ix-icons/icons';

interface User {
  name: string;
  glyph: string;
  quickMessages: string[];
  log: string[];
}

const QUICK_MESSAGES: Record<string, string[]> = {
  Alice: ['Standup in 5!', 'Can you review my PR?'],
  Bob: ['On my way.', 'Looks good to me.'],
  Carol: ['Running 2 min late.', "Let's sync after lunch."],
};

/**
 * Mediator demo: Alice, Bob and Carol never talk to each other directly.
 * Sending a message always routes through the central mediator hub, which
 * pulses to show it handled the traffic, then forwards the message into the
 * *other two* colleagues' logs — never the sender's own.
 */
@Component({
  selector: 'app-mediator-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Send a message from any panel. It always passes through the mediator hub in the
        middle, which relays it to the other two — never straight to a peer.
      </p>

      <div class="stage">
        @for (user of users(); track user.name) {
          <div class="panel" [class.panel--sending]="sendingFrom() === user.name">
            <div class="panel__header">
              <span class="panel__glyph">{{ user.glyph }}</span>
              <span class="panel__name">{{ user.name }}</span>
            </div>
            <div class="panel__actions">
              @for (msg of user.quickMessages; track msg) {
                <ix-button
                  variant="secondary"
                  icon="comment-alt"
                  [disabled]="busy()"
                  (click)="send(user.name, msg)"
                >
                  {{ msg }}
                </ix-button>
              }
            </div>
            <div class="panel__log">
              @for (entry of user.log; track $index) {
                <div class="entry">{{ entry }}</div>
              } @empty {
                <div class="entry entry--empty">No messages yet.</div>
              }
            </div>
          </div>
        }

        <div class="hub" [class.hub--pulse]="pulsing()">
          <span class="hub__icon">
            <ix-button variant="primary" icon="share" disabled>Mediator</ix-button>
          </span>
        </div>
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
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .stage {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
        padding: 2.5rem 1rem 1rem;
      }
      .hub {
        position: absolute;
        top: -0.25rem;
        left: 50%;
        transform: translate(-50%, -50%) scale(1);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease, filter 0.3s ease;
        filter: none;
      }
      .hub--pulse {
        transform: translate(-50%, -50%) scale(1.12);
        filter: drop-shadow(0 0 14px var(--theme-color-primary));
      }
      .hub__icon ix-button {
        pointer-events: none;
      }
      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .panel--sending {
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 16px color-mix(in srgb, var(--theme-color-primary) 40%, transparent);
      }
      .panel__header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .panel__glyph {
        font-size: 1.4rem;
        line-height: 1;
      }
      .panel__name {
        font-weight: 600;
      }
      .panel__actions {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .panel__log {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        min-height: 4.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--theme-color-soft-bdr);
      }
      .entry {
        font-size: 0.8rem;
        color: var(--theme-color-std-text);
        background: var(--theme-color-1);
        border-radius: 6px;
        padding: 0.35rem 0.5rem;
        animation: slideIn 0.3s ease;
      }
      .entry--empty {
        color: var(--theme-color-soft-text);
        background: transparent;
        padding: 0.35rem 0;
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @media (max-width: 720px) {
        .stage {
          grid-template-columns: 1fr;
        }
        .hub {
          position: static;
          transform: none;
          margin-bottom: 0.5rem;
        }
        .hub--pulse {
          transform: scale(1.08);
        }
      }
    `,
  ],
})
export class MediatorDemo {
  readonly users = signal<User[]>([
    { name: 'Alice', glyph: '\u{1F469}', quickMessages: QUICK_MESSAGES['Alice'], log: [] },
    { name: 'Bob', glyph: '\u{1F468}', quickMessages: QUICK_MESSAGES['Bob'], log: [] },
    { name: 'Carol', glyph: '\u{1F9D1}', quickMessages: QUICK_MESSAGES['Carol'], log: [] },
  ]);

  readonly sendingFrom = signal<string | null>(null);
  readonly pulsing = signal(false);
  readonly busy = signal(false);

  /** All communication passes through this single point — colleagues never call each other. */
  send(from: string, message: string): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.sendingFrom.set(from);
    this.pulsing.set(true);

    setTimeout(() => {
      this.pulsing.set(false);
      // The mediator relays to everyone except the sender.
      this.users.update((list) =>
        list.map((user) =>
          user.name === from ? user : { ...user, log: [...user.log, `${from}: ${message}`] },
        ),
      );
      setTimeout(() => {
        this.sendingFrom.set(null);
        this.busy.set(false);
      }, 250);
    }, 380);
  }

  constructor() {
    addIcons({ iconShare, iconCommentAlt });
  }
}
