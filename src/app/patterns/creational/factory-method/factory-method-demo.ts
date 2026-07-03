import { Component, signal } from '@angular/core';
import { IxButton, IxSelect, IxSelectItem } from '@siemens/ix-angular/standalone';

interface Transport {
  key: string;
  label: string;
  glyph: string;
  delivering: string;
}

/**
 * Factory Method demo: the client always calls the same `createTransport()`
 * factory, but the concrete product it gets back depends on which creator is
 * selected. Pick a type and press Deliver to watch the matching product roll out.
 */
@Component({
  selector: 'app-factory-method-demo',
  imports: [IxButton, IxSelect, IxSelectItem],
  template: `
    <div class="demo">
      <div class="demo__controls">
        <ix-select
          class="demo__select"
          [value]="selectedKey()"
          (valueChange)="onSelect($event.detail)"
        >
          @for (option of transports; track option.key) {
            <ix-select-item [label]="option.label" [value]="option.key"></ix-select-item>
          }
        </ix-select>
        <ix-button variant="primary" (click)="deliver()">createTransport()</ix-button>
      </div>

      <div class="line">
        <div class="line__factory">
          <span class="line__factory-label">LogisticsApp</span>
          <code>createTransport()</code>
        </div>
        <div class="line__arrow" [class.line__arrow--active]="produced() !== null">→</div>
        <div class="line__product">
          @if (produced(); as product) {
            <div class="product" [attr.data-key]="product.key">
              <span class="product__glyph">{{ product.glyph }}</span>
              <span class="product__label">{{ product.label }}</span>
              <span class="product__msg">{{ product.delivering }}</span>
            </div>
          } @else {
            <span class="product__placeholder">Press the button to produce a product</span>
          }
        </div>
      </div>

      <p class="demo__hint">
        Same call, different product — the creator decides the concrete class,
        the client code never changes.
      </p>
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .demo__controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .demo__select {
        min-width: 200px;
      }
      .line {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
      .line__factory {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 1.25rem;
        border-radius: 10px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .line__factory-label {
        font-weight: 700;
      }
      .line__arrow {
        font-size: 2rem;
        color: var(--theme-color-soft-text);
        transition: color 0.3s ease, transform 0.3s ease;
      }
      .line__arrow--active {
        color: var(--theme-color-primary);
        transform: scale(1.3);
      }
      .line__product {
        min-width: 200px;
        min-height: 140px;
        display: flex;
        align-items: center;
      }
      .product {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        padding: 1.25rem 1.75rem;
        border-radius: 12px;
        border: 2px solid var(--theme-color-primary);
        background: color-mix(in srgb, var(--theme-color-primary) 12%, transparent);
        animation: pop 0.45s cubic-bezier(0.2, 1.4, 0.4, 1);
      }
      .product__glyph {
        font-size: 3rem;
        line-height: 1;
      }
      .product__label {
        font-weight: 700;
        font-size: 1.1rem;
      }
      .product__msg {
        color: var(--theme-color-soft-text);
        font-size: 0.9rem;
      }
      .product__placeholder {
        color: var(--theme-color-soft-text);
      }
      @keyframes pop {
        0% {
          opacity: 0;
          transform: translateY(12px) scale(0.8);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `,
  ],
})
export class FactoryMethodDemo {
  readonly transports: Transport[] = [
    { key: 'truck', label: 'Truck', glyph: '🚚', delivering: 'delivering by road' },
    { key: 'ship', label: 'Ship', glyph: '🚢', delivering: 'delivering by sea' },
    { key: 'plane', label: 'Plane', glyph: '✈️', delivering: 'delivering by air' },
  ];

  readonly selectedKey = signal(this.transports[0].key);
  readonly produced = signal<Transport | null>(null);

  onSelect(key: string | string[]): void {
    const value = Array.isArray(key) ? key[0] : key;
    if (value) {
      this.selectedKey.set(value);
    }
  }

  deliver(): void {
    const match = this.transports.find((option) => option.key === this.selectedKey());
    if (!match) {
      return;
    }
    // Re-trigger the entry animation by clearing first.
    this.produced.set(null);
    setTimeout(() => this.produced.set(match), 0);
  }
}
