import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type StrategyKey = 'bubble' | 'quick' | 'shuffle';

interface StrategyOption {
  key: StrategyKey;
  label: string;
}

interface Step {
  bars: number[];
  active: number[];
}

const STRATEGIES: StrategyOption[] = [
  { key: 'bubble', label: 'Bubble Sort' },
  { key: 'quick', label: 'Quick Sort' },
  { key: 'shuffle', label: 'Shuffle' },
];

function bubbleSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [{ bars: [...arr], active: [] }];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({ bars: [...arr], active: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ bars: [...arr], active: [j, j + 1] });
      }
    }
  }
  steps.push({ bars: [...arr], active: [] });
  return steps;
}

function quickSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [{ bars: [...arr], active: [] }];

  function partition(lo: number, hi: number): number {
    const pivot = arr[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ bars: [...arr], active: [j, hi] });
      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ bars: [...arr], active: [i, j] });
        i++;
      }
    }
    [arr[i], arr[hi]] = [arr[hi], arr[i]];
    steps.push({ bars: [...arr], active: [i, hi] });
    return i;
  }

  function sort(lo: number, hi: number): void {
    if (lo >= hi) {
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  sort(0, arr.length - 1);
  steps.push({ bars: [...arr], active: [] });
  return steps;
}

function shuffleSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [{ bars: [...arr], active: [] }];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
    steps.push({ bars: [...arr], active: [i, j] });
  }
  return steps;
}

/**
 * Strategy demo: the same "Run" button and the same bar display work with any
 * sorting/shuffling algorithm plugged in behind them. Swapping the selected
 * strategy changes only how the bars get rearranged, not the surrounding code.
 */
@Component({
  selector: 'app-strategy-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Pick a strategy, then press Run. The bars and the Run button never change —
        only the algorithm behind them does.
      </p>

      <div class="demo__controls">
        @for (option of strategies; track option.key) {
          <ix-button
            [variant]="selected() === option.key ? 'primary' : 'secondary'"
            [disabled]="running()"
            (click)="select(option.key)"
          >
            {{ option.label }}
          </ix-button>
        }
        <ix-button variant="tertiary" [disabled]="running()" (click)="run()">Run</ix-button>
      </div>

      <div class="chart">
        @for (value of bars(); track $index) {
          <div
            class="bar"
            [class.bar--active]="activeIndices().includes($index)"
            [style.height.%]="(value / maxValue) * 100"
          >
            <span class="bar__value">{{ value }}</span>
          </div>
        }
      </div>

      <p class="demo__log">{{ log() }}</p>
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
      .chart {
        display: flex;
        align-items: flex-end;
        gap: 0.6rem;
        height: 180px;
        padding: 1rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .bar {
        flex: 1;
        min-width: 2rem;
        background: var(--theme-color-soft-text);
        border-radius: 6px 6px 0 0;
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        transition: height 0.3s ease, background-color 0.25s ease;
      }
      .bar--active {
        background: var(--theme-color-primary);
      }
      .bar__value {
        position: relative;
        top: -1.4rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--theme-color-std-text);
      }
      .demo__log {
        margin: 0;
        color: var(--theme-color-soft-text);
        font-size: 0.9rem;
        min-height: 1.2rem;
      }
    `,
  ],
})
export class StrategyDemo {
  readonly strategies = STRATEGIES;
  readonly maxValue = 100;

  private readonly initial = [62, 30, 85, 15, 47, 70, 24, 55];

  readonly bars = signal<number[]>([...this.initial]);
  readonly activeIndices = signal<number[]>([]);
  readonly selected = signal<StrategyKey>('bubble');
  readonly running = signal(false);
  readonly log = signal('Choose a strategy and press Run.');

  select(key: StrategyKey): void {
    if (this.running()) {
      return;
    }
    this.selected.set(key);
  }

  run(): void {
    if (this.running()) {
      return;
    }
    const key = this.selected();
    const steps =
      key === 'bubble'
        ? bubbleSortSteps(this.bars())
        : key === 'quick'
          ? quickSortSteps(this.bars())
          : shuffleSteps(this.bars());

    this.running.set(true);
    this.log.set(`Running ${this.strategies.find((s) => s.key === key)!.label}…`);

    const delay = key === 'bubble' ? 90 : key === 'quick' ? 220 : 160;
    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        this.activeIndices.set([]);
        this.running.set(false);
        this.log.set(`${this.strategies.find((s) => s.key === key)!.label} finished.`);
        return;
      }
      const step = steps[i];
      this.bars.set(step.bars);
      this.activeIndices.set(step.active);
      i++;
      setTimeout(tick, delay);
    };
    tick();
  }
}
