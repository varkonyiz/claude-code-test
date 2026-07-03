import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

interface BirdResult {
  name: string;
  glyph: string;
  canFly: boolean;
  status: 'idle' | 'ok' | 'broken';
  message: string;
}

/**
 * LSP demo: a client loops over birds and asks each one to fly(). If every
 * bird is forced to extend a "flying" Bird base type (violating LSP), the
 * flightless Ostrich breaks the client at runtime. The fixed design only asks
 * FlyingBirds to fly — the client never has to special-case a subtype.
 */
@Component({
  selector: 'app-liskov-substitution-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <div class="demo__controls">
        <ix-button [variant]="safe() ? 'secondary' : 'primary'" (click)="setSafe(false)">
          Violating LSP
        </ix-button>
        <ix-button [variant]="safe() ? 'primary' : 'secondary'" (click)="setSafe(true)">
          LSP-safe
        </ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <p class="demo__hint">
        {{
          safe()
            ? 'The client only calls fly() on birds that actually implement FlyingBird.'
            : 'Every Bird — including Ostrich — is forced to expose fly(), inherited from one base class.'
        }}
      </p>

      <ix-button variant="primary" (click)="runAll()">Make every bird fly()</ix-button>

      <div class="birds">
        @for (bird of birds; track bird.name) {
          <div
            class="bird"
            [class.bird--ok]="resultFor(bird.name)?.status === 'ok'"
            [class.bird--broken]="resultFor(bird.name)?.status === 'broken'"
          >
            <span class="bird__glyph">{{ bird.glyph }}</span>
            <span class="bird__name">{{ bird.name }}</span>
            <span class="bird__msg">{{ resultFor(bird.name)?.message ?? 'waiting…' }}</span>
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
        gap: 1rem;
      }
      .demo__controls {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .birds {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }
      .bird {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        padding: 1.1rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        text-align: center;
        transition: border-color 0.3s ease, background 0.3s ease;
      }
      .bird--ok {
        border-color: var(--theme-color-success);
        background: color-mix(in srgb, var(--theme-color-success) 14%, transparent);
      }
      .bird--broken {
        border-color: var(--theme-color-warning);
        background: color-mix(in srgb, var(--theme-color-warning) 16%, transparent);
        animation: shake 0.4s ease;
      }
      .bird__glyph {
        font-size: 2rem;
      }
      .bird__name {
        font-weight: 600;
      }
      .bird__msg {
        font-size: 0.8rem;
        color: var(--theme-color-soft-text);
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
export class LiskovSubstitutionDemo {
  readonly birds = [
    { name: 'Sparrow', glyph: '🐦', flies: true },
    { name: 'Duck', glyph: '🦆', flies: true },
    { name: 'Ostrich', glyph: '🦤', flies: false },
  ];

  readonly safe = signal(false);
  readonly results = signal<BirdResult[]>([]);

  setSafe(on: boolean): void {
    this.safe.set(on);
    this.results.set([]);
  }

  runAll(): void {
    const out: BirdResult[] = this.birds.map((bird) => {
      if (this.safe()) {
        // Client only invokes fly() on birds typed as FlyingBird.
        return bird.flies
          ? { name: bird.name, glyph: bird.glyph, canFly: true, status: 'ok', message: 'flies away 🎉' }
          : { name: bird.name, glyph: bird.glyph, canFly: false, status: 'ok', message: 'runs instead 🏃' };
      }
      // Client blindly calls fly() on every Bird — Ostrich breaks the contract.
      return bird.flies
        ? { name: bird.name, glyph: bird.glyph, canFly: true, status: 'ok', message: 'flies away 🎉' }
        : { name: bird.name, glyph: bird.glyph, canFly: false, status: 'broken', message: 'Error: cannot fly!' };
    });
    this.results.set(out);
  }

  resultFor(name: string): BirdResult | undefined {
    return this.results().find((r) => r.name === name);
  }

  reset(): void {
    this.results.set([]);
  }
}
