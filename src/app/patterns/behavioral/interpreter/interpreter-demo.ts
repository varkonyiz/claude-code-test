import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconLanguage, iconRefresh } from '@siemens/ix-icons/icons';

/** One `number (op number)*` expression, e.g. "3 + 4 - 2". */
interface Expression {
  label: string;
  numbers: number[];
  ops: ('+' | '-')[];
}

/** A snapshot of the reduction, rendered as one step in the trail. */
interface Step {
  text: string;
  /** Index of the operator being applied in this step, or -1 once fully reduced. */
  activeOp: number;
}

const PRESETS: Expression[] = [
  { label: '3 + 4 - 2', numbers: [3, 4, 2], ops: ['+', '-'] },
  { label: '10 - 5 + 1', numbers: [10, 5, 1], ops: ['-', '+'] },
  { label: '8 + 2 + 5', numbers: [8, 2, 5], ops: ['+', '+'] },
];

/**
 * Interpreter demo: an expression is a little tree of "number (op number)"
 * terms, and evaluating it means walking that structure left-to-right —
 * exactly what an Interpreter's `interpret()` does recursively — rather than
 * running one monolithic parsing function. Pressing Evaluate reduces the
 * expression one operation at a time so the walk is visible.
 */
@Component({
  selector: 'app-interpreter-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Pick an expression, then <strong>Evaluate</strong> — each step interprets the
        leftmost operation and folds it into the result, just like walking an
        expression tree node by node.
      </p>

      <div class="demo__controls">
        @for (preset of presets; track preset.label; let i = $index) {
          <ix-button
            [variant]="i === selectedIndex() ? 'primary' : 'secondary'"
            [disabled]="running()"
            (click)="select(i)"
          >
            {{ preset.label }}
          </ix-button>
        }
      </div>

      <div class="demo__controls">
        <ix-button variant="primary" icon="language" [disabled]="running()" (click)="evaluate()">
          Evaluate
        </ix-button>
        <ix-button variant="tertiary" icon="refresh" [disabled]="running()" (click)="reset()">
          Reset
        </ix-button>
      </div>

      <div class="stage">
        @for (step of steps(); track $index; let isLast = $last) {
          <div class="step" [class.step--final]="isLast && done()">
            <div class="step__expr">
              @for (tok of tokenize(step); track $index) {
                <span
                  class="tok"
                  [class.tok--op]="tok.isOp"
                  [class.tok--active]="tok.isOp && tok.index === step.activeOp"
                >
                  {{ tok.text }}
                </span>
              }
            </div>
            @if (!isLast) {
              <span class="step__arrow">&#8595;</span>
            }
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
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .demo__controls {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        min-height: 160px;
        justify-content: center;
        padding: 1.5rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
      }
      .step__expr {
        display: flex;
        gap: 0.4rem;
        font-size: 1.5rem;
        font-weight: 700;
        font-family: 'Courier New', monospace;
        animation: fadeIn 0.3s ease;
      }
      .step--final .step__expr {
        color: var(--theme-color-success);
        font-size: 2rem;
      }
      .step__arrow {
        color: var(--theme-color-soft-text);
        font-size: 1.1rem;
      }
      .tok {
        color: var(--theme-color-std-text);
        transition: color 0.25s ease, transform 0.25s ease;
      }
      .tok--op {
        color: var(--theme-color-soft-text);
      }
      .tok--active {
        color: var(--theme-color-primary);
        transform: scale(1.25);
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class InterpreterDemo {
  readonly presets = PRESETS;
  readonly selectedIndex = signal(0);
  readonly steps = signal<Step[]>([this.freshStep(PRESETS[0])]);
  readonly running = signal(false);
  readonly done = signal(false);

  select(index: number): void {
    if (this.running()) return;
    this.selectedIndex.set(index);
    this.reset();
  }

  reset(): void {
    this.running.set(false);
    this.done.set(false);
    this.steps.set([this.freshStep(this.presets[this.selectedIndex()])]);
  }

  /** Reduce the expression one operation at a time, pausing between steps. */
  evaluate(): void {
    if (this.running()) return;
    const expr = this.presets[this.selectedIndex()];
    this.running.set(true);
    this.done.set(false);
    this.steps.set([this.freshStep(expr)]);

    const numbers = [...expr.numbers];
    const ops = [...expr.ops];
    let delay = 650;

    const step = () => {
      if (ops.length === 0) {
        this.done.set(true);
        this.running.set(false);
        return;
      }
      // Interpret the leftmost operation: fold numbers[0] op numbers[1] into one term.
      const op = ops.shift()!;
      const a = numbers.shift()!;
      const b = numbers.shift()!;
      const result = op === '+' ? a + b : a - b;
      numbers.unshift(result);

      this.steps.update((list) => [
        ...list,
        { text: this.render(numbers, ops), activeOp: ops.length > 0 ? 0 : -1 },
      ]);

      setTimeout(step, delay);
    };

    // Highlight the first operation about to be interpreted, then start folding.
    this.steps.update((list) =>
      list.map((s, i) => (i === 0 ? { ...s, activeOp: ops.length > 0 ? 0 : -1 } : s)),
    );
    setTimeout(step, delay);
  }

  /** Turn a step's rendered text back into tokens so operators can be highlighted. */
  tokenize(step: Step): { text: string; isOp: boolean; index: number }[] {
    const parts = step.text.split(' ');
    let opIndex = -1;
    return parts.map((text) => {
      const isOp = text === '+' || text === '-';
      if (isOp) opIndex++;
      return { text, isOp, index: isOp ? opIndex : -1 };
    });
  }

  private freshStep(expr: Expression): Step {
    return { text: this.render([...expr.numbers], [...expr.ops]), activeOp: expr.ops.length > 0 ? 0 : -1 };
  }

  private render(numbers: number[], ops: ('+' | '-')[]): string {
    const parts: string[] = [String(numbers[0])];
    for (let i = 0; i < ops.length; i++) {
      parts.push(ops[i], String(numbers[i + 1]));
    }
    return parts.join(' ');
  }

  constructor() {
    addIcons({ iconLanguage, iconRefresh });
  }
}
