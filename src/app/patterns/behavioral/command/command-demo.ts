import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type DeviceKey = 'light' | 'fan';

interface HistoryEntry {
  id: number;
  label: string;
  device: DeviceKey;
  previous: boolean;
}

/**
 * Command demo: each remote button encapsulates a request as a command that
 * is pushed onto a visible history stack. The invoker (the remote) never
 * knows how to reverse anything — Undo simply pops the last command and
 * replays its stored "previous state", reverting only that one change.
 */
@Component({
  selector: 'app-command-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Press remote buttons to run commands; Undo reverts only the most recent one.
      </p>

      <div class="panel">
        <div class="devices">
          <div class="device" [class.device--on]="light()">
            <span class="device__glyph">💡</span>
            <span class="device__label">Light</span>
            <span class="device__state">{{ light() ? 'ON' : 'off' }}</span>
          </div>
          <div class="device" [class.device--on]="fan()">
            <span class="device__glyph">🌀</span>
            <span class="device__label">Fan</span>
            <span class="device__state">{{ fan() ? 'ON' : 'off' }}</span>
          </div>
        </div>

        <div class="remote">
          <ix-button variant="secondary" (click)="run('light', true)">Light On</ix-button>
          <ix-button variant="secondary" (click)="run('light', false)">Light Off</ix-button>
          <ix-button variant="secondary" (click)="run('fan', true)">Fan On</ix-button>
          <ix-button variant="secondary" (click)="run('fan', false)">Fan Off</ix-button>
          <ix-button
            variant="primary"
            icon="play"
            [disabled]="history().length === 0"
            (click)="undo()"
          >
            Undo
          </ix-button>
        </div>
      </div>

      <div class="history">
        <span class="history__title">Command history (most recent first)</span>
        <ol class="history__list">
          @for (entry of reversedHistory(); track entry.id) {
            <li>{{ entry.label }}</li>
          }
          @empty {
            <li class="history__empty">no commands yet</li>
          }
        </ol>
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
      .panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.25rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .devices {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
      .device {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        min-width: 100px;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        transition: border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
        opacity: 0.6;
      }
      .device--on {
        opacity: 1;
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 16px color-mix(in srgb, var(--theme-color-primary) 45%, transparent);
      }
      .device__glyph {
        font-size: 2rem;
      }
      .device__label {
        font-weight: 600;
      }
      .device__state {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        color: var(--theme-color-soft-text);
      }
      .device--on .device__state {
        color: var(--theme-color-success);
      }
      .remote {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .history {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .history__title {
        font-weight: 700;
      }
      .history__list {
        margin: 0;
        padding: 1rem 1rem 1rem 1.25rem;
        border: 1px solid var(--theme-color-soft-bdr);
        border-radius: 10px;
        font-size: 0.9rem;
        min-height: 2.5rem;
      }
      .history__list li {
        padding: 0.15rem 0;
      }
      .history__empty {
        list-style: none;
        margin-left: -1.25rem;
        color: var(--theme-color-soft-text);
      }
    `,
  ],
})
export class CommandDemo {
  readonly light = signal(false);
  readonly fan = signal(false);
  readonly history = signal<HistoryEntry[]>([]);

  private nextId = 0;

  reversedHistory() {
    return [...this.history()].reverse();
  }

  /** Invoker: runs a command and records it — it has no idea how to reverse it. */
  run(device: DeviceKey, turnOn: boolean): void {
    const state = device === 'light' ? this.light : this.fan;
    const previous = state();
    state.set(turnOn);
    this.history.update((list) => [
      ...list,
      {
        id: this.nextId++,
        label: `${device === 'light' ? 'Light' : 'Fan'} ${turnOn ? 'On' : 'Off'}`,
        device,
        previous,
      },
    ]);
  }

  /** Pops the last command and replays its stored inverse — the invoker stays generic. */
  undo(): void {
    const list = this.history();
    if (list.length === 0) return;
    const last = list[list.length - 1];
    const state = last.device === 'light' ? this.light : this.fan;
    state.set(last.previous);
    this.history.set(list.slice(0, -1));
  }
}
