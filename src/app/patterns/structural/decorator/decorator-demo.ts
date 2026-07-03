import { Component, computed, signal } from '@angular/core';

interface AddOn {
  id: 'milk' | 'sugar' | 'whip';
  label: string;
  price: number;
  color: string;
}

const ADD_ONS: AddOn[] = [
  { id: 'milk', label: 'Milk', price: 0.5, color: 'var(--theme-color-primary)' },
  { id: 'sugar', label: 'Sugar', price: 0.3, color: 'var(--theme-color-success)' },
  { id: 'whip', label: 'Whip', price: 0.8, color: 'var(--theme-color-warning)' },
];

const BASE_PRICE = 2;

/**
 * Decorator demo: a base Coffee gets wrapped in independent decorator layers.
 * Each toggled add-on adds a visible ring around the cup and folds its price
 * and description into the running total -- decorators compose in any order
 * or combination, without a subclass for each possibility.
 */
@Component({
  selector: 'app-decorator-demo',
  imports: [],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Toggle add-ons to wrap the base coffee in decorator layers. Each layer stacks visually and
        folds into the price and description.
      </p>

      <div class="demo__chips">
        @for (addOn of addOns; track addOn.id) {
          <button
            type="button"
            class="chip"
            [class.chip--active]="isActive(addOn.id)"
            [style.--c]="addOn.color"
            (click)="toggle(addOn.id)"
          >
            {{ addOn.label }} (+\${{ addOn.price.toFixed(2) }})
          </button>
        }
      </div>

      <div class="demo__stage">
        <div class="stack">
          @for (addOn of activeAddOns(); track addOn.id; let i = $index) {
            <div class="ring" [style.--c]="addOn.color" [style.--i]="i"></div>
          }
          <div class="cup">
            <span class="cup__glyph">&#9749;</span>
          </div>
        </div>

        <div class="summary">
          <span class="summary__price">\${{ totalPrice().toFixed(2) }}</span>
          <span class="summary__desc">{{ description() }}</span>
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
      .demo__chips {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .chip {
        --c: var(--theme-color-primary);
        cursor: pointer;
        font: inherit;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        color: var(--theme-color-soft-text);
        transition: all 0.25s ease;
      }
      .chip--active {
        border-color: var(--c);
        color: var(--theme-color-std-text);
        background: color-mix(in srgb, var(--c) 18%, transparent);
        box-shadow: 0 0 12px color-mix(in srgb, var(--c) 45%, transparent);
      }
      .demo__stage {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 1.5rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
        flex-wrap: wrap;
      }
      .stack {
        position: relative;
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .ring {
        --c: var(--theme-color-primary);
        --i: 0;
        position: absolute;
        inset: calc(var(--i) * 14px);
        border-radius: 50%;
        border: 2px solid var(--c);
        opacity: 0.75;
        animation: grow 0.35s ease;
      }
      .cup {
        position: relative;
        z-index: 1;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--theme-color-1);
        border: 2px solid var(--theme-color-soft-bdr);
        color: var(--theme-color-primary);
      }
      .cup__glyph {
        font-size: 1.8rem;
        line-height: 1;
      }
      .summary {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .summary__price {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--theme-color-primary);
      }
      .summary__desc {
        color: var(--theme-color-soft-text);
      }
      @keyframes grow {
        from {
          transform: scale(0.6);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 0.75;
        }
      }
    `,
  ],
})
export class DecoratorDemo {
  readonly addOns = ADD_ONS;
  private readonly active = signal<Set<AddOn['id']>>(new Set());

  readonly activeAddOns = computed(() => this.addOns.filter((a) => this.active().has(a.id)));

  readonly totalPrice = computed(() =>
    this.activeAddOns().reduce((sum, a) => sum + a.price, BASE_PRICE),
  );

  readonly description = computed(() => {
    const extras = this.activeAddOns().map((a) => a.label);
    return extras.length === 0 ? 'Coffee' : `Coffee + ${extras.join(' + ')}`;
  });

  isActive(id: AddOn['id']): boolean {
    return this.active().has(id);
  }

  toggle(id: AddOn['id']): void {
    this.active.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }
}
