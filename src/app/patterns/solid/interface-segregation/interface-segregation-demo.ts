import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

interface MethodCall {
  key: 'work' | 'eat' | 'sleep';
  label: string;
  glyph: string;
  /** Whether Robot can genuinely support this in the segregated design. */
  supportedByRobot: boolean;
}

const METHODS: MethodCall[] = [
  { key: 'work', label: 'work()', glyph: '🔧', supportedByRobot: true },
  { key: 'eat', label: 'eat()', glyph: '🍽️', supportedByRobot: false },
  { key: 'sleep', label: 'sleep()', glyph: '😴', supportedByRobot: false },
];

/**
 * ISP demo: a "fat" Worker interface forces Robot to implement eat() and
 * sleep(), which it cannot honestly support — calling them blows up. Once the
 * interface is segregated into Workable/Eatable/Sleepable, Robot only
 * implements Workable, so there is nothing broken left to call.
 */
@Component({
  selector: 'app-interface-segregation-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <div class="demo__controls">
        <ix-button [variant]="segregated() ? 'secondary' : 'primary'" (click)="setSegregated(false)">
          Fat interface
        </ix-button>
        <ix-button [variant]="segregated() ? 'primary' : 'secondary'" (click)="setSegregated(true)">
          Segregated
        </ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <p class="demo__hint">
        Robot implements
        {{ segregated() ? 'only the Workable interface.' : 'the full Worker interface (work + eat + sleep).' }}
        Click a method to call it on Robot.
      </p>

      <div class="methods">
        @for (m of methods; track m.key) {
          @if (segregated() ? m.supportedByRobot : true) {
            <ix-button variant="secondary" (click)="call(m)">{{ m.glyph }} {{ m.label }}</ix-button>
          }
        }
      </div>

      @if (log().length > 0) {
        <ul class="log">
          @for (entry of log(); track $index) {
            <li [class.log__err]="entry.startsWith('Error')">{{ entry }}</li>
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
      .methods {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .log {
        margin: 0;
        padding: 0.9rem 1.1rem 0.9rem 1.5rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        font-family: var(--theme-font-family-monospace, monospace);
        font-size: 0.9rem;
      }
      .log li {
        padding: 0.15rem 0;
      }
      .log__err {
        color: var(--theme-color-warning);
      }
    `,
  ],
})
export class InterfaceSegregationDemo {
  readonly methods = METHODS;
  readonly segregated = signal(false);
  readonly log = signal<string[]>([]);

  setSegregated(on: boolean): void {
    this.segregated.set(on);
    this.log.set([]);
  }

  call(method: MethodCall): void {
    const line =
      this.segregated() || method.supportedByRobot
        ? `Robot.${method.label} → ${method.glyph} done`
        : `Error: Robot.${method.label} not supported (NotImplementedException)`;
    this.log.update((lines) => [...lines, line]);
  }

  reset(): void {
    this.log.set([]);
  }
}
