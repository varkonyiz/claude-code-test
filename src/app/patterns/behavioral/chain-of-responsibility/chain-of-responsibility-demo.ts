import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type Severity = 'low' | 'medium' | 'high';
type NodeState = 'idle' | 'checking' | 'passed' | 'handled';

interface HandlerNode {
  key: string;
  label: string;
  glyph: string;
  handles: Severity;
  state: NodeState;
}

/**
 * Chain of Responsibility demo: pick a ticket severity and submit it — a token
 * animates node by node through Level 1 -> Level 2 -> Manager, "passing" each
 * handler that can't cover the severity and lighting up as "handled" at the
 * first one that can, without the sender ever choosing the handler directly.
 */
@Component({
  selector: 'app-chain-of-responsibility-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Choose a severity, then submit the ticket and watch it travel the chain.
      </p>

      <div class="demo__controls">
        @for (level of severities; track level.key) {
          <ix-button
            [variant]="severity() === level.key ? 'primary' : 'secondary'"
            [disabled]="running()"
            (click)="setSeverity(level.key)"
          >
            {{ level.label }}
          </ix-button>
        }
        <ix-button
          variant="primary"
          icon="route-target"
          [disabled]="running()"
          (click)="submit()"
        >
          Submit ticket
        </ix-button>
        <ix-button variant="tertiary" [disabled]="running()" (click)="reset()">Reset</ix-button>
      </div>

      <div class="chain">
        @for (node of nodes(); track node.key; let i = $index) {
          <div class="chain__node-wrap">
            <div
              class="node"
              [class.node--checking]="node.state === 'checking'"
              [class.node--passed]="node.state === 'passed'"
              [class.node--handled]="node.state === 'handled'"
            >
              <span class="node__glyph">{{ node.glyph }}</span>
              <span class="node__label">{{ node.label }}</span>
              <span class="node__threshold">handles: {{ node.handles }}</span>
              @if (node.state === 'checking') {
                <span class="node__status">checking…</span>
              } @else if (node.state === 'passed') {
                <span class="node__status">passed on</span>
              } @else if (node.state === 'handled') {
                <span class="node__status node__status--handled">handled ✔</span>
              }
            </div>
            @if (i < nodes().length - 1) {
              <span class="chain__arrow" [class.chain__arrow--active]="node.state !== 'idle'">
                →
              </span>
            }
          </div>
        }
      </div>

      @if (ticketToken() !== null) {
        <p class="ticket">
          Ticket ({{ severity() }}) traveling the chain…
        </p>
      }
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
      .demo__controls {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
        align-items: center;
      }
      .chain {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .chain__node-wrap {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .chain__arrow {
        font-size: 1.4rem;
        color: var(--theme-color-soft-bdr);
        transition: color 0.3s ease;
      }
      .chain__arrow--active {
        color: var(--theme-color-primary);
      }
      .node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        min-width: 150px;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        transition: border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
      }
      .node__glyph {
        font-size: 1.8rem;
      }
      .node__label {
        font-weight: 600;
      }
      .node__threshold {
        font-size: 0.75rem;
        color: var(--theme-color-soft-text);
        text-transform: capitalize;
      }
      .node__status {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--theme-color-soft-text);
      }
      .node--checking {
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 16px color-mix(in srgb, var(--theme-color-primary) 50%, transparent);
        animation: pulse 0.6s ease infinite;
      }
      .node--passed {
        opacity: 0.5;
      }
      .node--handled {
        border-color: var(--theme-color-success);
        box-shadow: 0 0 16px color-mix(in srgb, var(--theme-color-success) 50%, transparent);
      }
      .node--handled .node__status--handled {
        color: var(--theme-color-success);
      }
      .ticket {
        margin: 0;
        font-size: 0.85rem;
        color: var(--theme-color-soft-text);
        text-transform: capitalize;
      }
      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.04);
        }
      }
    `,
  ],
})
export class ChainOfResponsibilityDemo {
  readonly severities: { key: Severity; label: string }[] = [
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
  ];

  readonly severity = signal<Severity>('low');
  readonly running = signal(false);
  readonly ticketToken = signal<Severity | null>(null);

  readonly nodes = signal<HandlerNode[]>([
    { key: 'l1', label: 'Level 1 Support', glyph: '🎧', handles: 'low', state: 'idle' },
    { key: 'l2', label: 'Level 2 Support', glyph: '🛠️', handles: 'medium', state: 'idle' },
    { key: 'mgr', label: 'Manager', glyph: '🧑‍💼', handles: 'high', state: 'idle' },
  ]);

  setSeverity(key: Severity): void {
    if (this.running()) return;
    this.severity.set(key);
  }

  submit(): void {
    this.reset(false);
    this.running.set(true);
    this.ticketToken.set(this.severity());

    const nodes = this.nodes();
    const stepDelay = 550;

    const step = (index: number) => {
      if (index >= nodes.length) {
        this.running.set(false);
        return;
      }
      this.setNodeState(index, 'checking');
      setTimeout(() => {
        const canHandle = nodes[index].handles === this.severity();
        this.setNodeState(index, canHandle ? 'handled' : 'passed');
        if (canHandle) {
          this.running.set(false);
        } else {
          step(index + 1);
        }
      }, stepDelay);
    };

    step(0);
  }

  private setNodeState(index: number, state: NodeState): void {
    this.nodes.update((list) => list.map((n, i) => (i === index ? { ...n, state } : n)));
  }

  reset(clearToken = true): void {
    this.nodes.update((list) => list.map((n) => ({ ...n, state: 'idle' as NodeState })));
    this.running.set(false);
    if (clearToken) {
      this.ticketToken.set(null);
    }
  }
}
