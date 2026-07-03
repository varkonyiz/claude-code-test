import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type Beverage = 'tea' | 'coffee';

interface ChecklistStep {
  title: string;
  detail: string;
  overridable: boolean;
}

const STEPS: Record<Beverage, ChecklistStep[]> = {
  tea: [
    { title: 'Boil water', detail: 'Bring water to a rolling boil', overridable: false },
    { title: 'Brew', detail: 'Steep the tea bag for 3 minutes', overridable: true },
    { title: 'Pour into cup', detail: 'Pour the hot beverage into a cup', overridable: false },
    { title: 'Add condiments', detail: 'Add a slice of lemon', overridable: true },
  ],
  coffee: [
    { title: 'Boil water', detail: 'Bring water to a rolling boil', overridable: false },
    { title: 'Brew', detail: 'Pour water through coffee grounds', overridable: true },
    { title: 'Pour into cup', detail: 'Pour the hot beverage into a cup', overridable: false },
    { title: 'Add condiments', detail: 'Add milk & sugar', overridable: true },
  ],
};

/**
 * Template Method demo: the 4-step brewing skeleton (boil, brew, pour, add
 * condiments) is fixed and always runs in the same order. Only two of the four
 * steps ("Brew" and "Add condiments", highlighted) are overridden per beverage —
 * the overall algorithm shape never changes.
 */
@Component({
  selector: 'app-template-method-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Pick a beverage, then press Brew. The 4-step skeleton always runs in the same
        order — only the highlighted steps change per beverage.
      </p>

      <div class="demo__controls">
        <ix-button
          [variant]="beverage() === 'tea' ? 'primary' : 'secondary'"
          [disabled]="brewing()"
          (click)="select('tea')"
        >
          Tea
        </ix-button>
        <ix-button
          [variant]="beverage() === 'coffee' ? 'primary' : 'secondary'"
          [disabled]="brewing()"
          (click)="select('coffee')"
        >
          Coffee
        </ix-button>
        <ix-button variant="tertiary" [disabled]="brewing()" (click)="brew()">Brew</ix-button>
      </div>

      <ol class="checklist">
        @for (step of currentSteps(); track step.title; let i = $index) {
          <li
            class="checklist__item"
            [class.checklist__item--overridable]="step.overridable"
            [class.checklist__item--done]="doneCount() > i"
            [class.checklist__item--active]="doneCount() === i && brewing()"
          >
            <span class="checklist__mark">{{ doneCount() > i ? '✓' : i + 1 }}</span>
            <span class="checklist__text">
              <span class="checklist__title">{{ step.title }}</span>
              <span class="checklist__detail">{{ step.detail }}</span>
            </span>
            @if (step.overridable) {
              <span class="checklist__badge">overridden</span>
            }
          </li>
        }
      </ol>
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
      .checklist {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .checklist__item {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.85rem 1rem;
        border-radius: 10px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
        opacity: 0.55;
        transition: opacity 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
      }
      .checklist__item--overridable {
        border-color: color-mix(in srgb, var(--theme-color-primary) 50%, var(--theme-color-soft-bdr));
      }
      .checklist__item--active {
        opacity: 1;
        transform: scale(1.02);
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 16px color-mix(in srgb, var(--theme-color-primary) 35%, transparent);
      }
      .checklist__item--done {
        opacity: 1;
      }
      .checklist__mark {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 1.8rem;
        min-height: 1.8rem;
        border-radius: 50%;
        background: var(--theme-color-1);
        border: 1px solid var(--theme-color-soft-bdr);
        font-weight: 700;
        font-size: 0.85rem;
      }
      .checklist__item--done .checklist__mark {
        background: var(--theme-color-success);
        color: var(--theme-color-1);
        border-color: var(--theme-color-success);
      }
      .checklist__text {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        flex: 1;
      }
      .checklist__title {
        font-weight: 600;
      }
      .checklist__detail {
        color: var(--theme-color-soft-text);
        font-size: 0.85rem;
      }
      .checklist__badge {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 0.2rem 0.5rem;
        border-radius: 999px;
        color: var(--theme-color-primary);
        background: color-mix(in srgb, var(--theme-color-primary) 16%, transparent);
        white-space: nowrap;
      }
    `,
  ],
})
export class TemplateMethodDemo {
  readonly beverage = signal<Beverage>('tea');
  readonly doneCount = signal(0);
  readonly brewing = signal(false);

  currentSteps(): ChecklistStep[] {
    return STEPS[this.beverage()];
  }

  select(beverage: Beverage): void {
    if (this.brewing()) {
      return;
    }
    this.beverage.set(beverage);
    this.doneCount.set(0);
  }

  brew(): void {
    if (this.brewing()) {
      return;
    }
    this.brewing.set(true);
    this.doneCount.set(0);

    const total = this.currentSteps().length;
    let step = 0;
    const tick = () => {
      step++;
      this.doneCount.set(step);
      if (step >= total) {
        this.brewing.set(false);
        return;
      }
      setTimeout(tick, 700);
    };
    setTimeout(tick, 700);
  }
}
