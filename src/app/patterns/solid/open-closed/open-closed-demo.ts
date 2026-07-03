import { Component, computed, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

interface Discount {
  key: string;
  label: string;
  glyph: string;
  rate: number;
}

const BASE_DISCOUNTS: Discount[] = [
  { key: 'seasonal', label: 'Seasonal', glyph: '🍂', rate: 0.1 },
  { key: 'bulk', label: 'Bulk order', glyph: '📦', rate: 0.15 },
];

const NEW_DISCOUNT: Discount = { key: 'loyalty', label: 'Loyalty', glyph: '⭐', rate: 0.2 };

/**
 * Open/Closed demo: adding a new "Loyalty" discount either means editing the
 * core checkout function (legacy switch-statement) or simply plugging in a new
 * strategy alongside the existing ones (open for extension). The checkout
 * function itself never has to change either way.
 */
@Component({
  selector: 'app-open-closed-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <div class="demo__controls">
        <ix-button [variant]="extensible() ? 'secondary' : 'primary'" (click)="setExtensible(false)">
          Legacy switch
        </ix-button>
        <ix-button [variant]="extensible() ? 'primary' : 'secondary'" (click)="setExtensible(true)">
          Open for extension
        </ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <p class="demo__hint">Add a new discount type, then run checkout.</p>

      <div class="demo__actions">
        <ix-button variant="secondary" [disabled]="hasLoyalty()" (click)="addLoyalty()">
          + Add Loyalty discount
        </ix-button>
        <ix-button variant="primary" (click)="checkout()">Checkout $100 cart</ix-button>
      </div>

      <div class="core" [class.core--modified]="coreModified()">
        <span class="core__label">calculateDiscount()</span>
        <span class="core__status">{{ coreModified() ? 'modified — needs re-review' : 'untouched' }}</span>
      </div>

      <div class="discounts">
        @for (d of discounts(); track d.key) {
          <span class="discount" [class.discount--new]="d.key === 'loyalty'">
            {{ d.glyph }} {{ d.label }} (-{{ d.rate * 100 }}%)
          </span>
        }
      </div>

      @if (total() !== null) {
        <div class="result">Total after discounts: <strong>\${{ total()!.toFixed(2) }}</strong></div>
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
      .demo__actions,
      .discounts {
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
      .discount {
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        background: var(--theme-color-1);
        border: 1px solid var(--theme-color-soft-bdr);
        font-size: 0.85rem;
      }
      .discount--new {
        border-color: var(--theme-color-success);
        color: var(--theme-color-success);
        animation: pop 0.4s ease;
      }
      .result {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background: var(--theme-color-2);
      }
      @keyframes pop {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class OpenClosedDemo {
  readonly extensible = signal(true);
  readonly discounts = signal<Discount[]>([...BASE_DISCOUNTS]);
  readonly coreModified = signal(false);
  readonly total = signal<number | null>(null);

  readonly hasLoyalty = computed(() => this.discounts().some((d) => d.key === 'loyalty'));

  setExtensible(on: boolean): void {
    this.extensible.set(on);
    this.reset();
  }

  addLoyalty(): void {
    this.discounts.update((list) => [...list, NEW_DISCOUNT]);
    // In the legacy design, supporting a new discount means editing the core
    // function's switch statement; in the extensible design it's a pure addition.
    this.coreModified.set(!this.extensible());
  }

  checkout(): void {
    const rate = this.discounts().reduce((sum, d) => sum + d.rate, 0);
    this.total.set(100 * (1 - rate));
  }

  reset(): void {
    this.discounts.set([...BASE_DISCOUNTS]);
    this.coreModified.set(false);
    this.total.set(null);
  }
}
