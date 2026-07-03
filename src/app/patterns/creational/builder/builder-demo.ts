import { Component, computed, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

interface Part {
  key: string;
  label: string;
  glyph: string;
  color: string;
}

/**
 * Builder demo: assemble a burger one part at a time and watch it stack up, or
 * let the "director" build a standard recipe in the correct order. The same
 * builder produces many different products from the same construction steps.
 */
@Component({
  selector: 'app-builder-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <div class="demo__palette">
        <span class="demo__label">Add parts:</span>
        @for (part of parts; track part.key) {
          <ix-button variant="secondary" (click)="addPart(part.key)">
            {{ part.glyph }} {{ part.label }}
          </ix-button>
        }
      </div>

      <div class="demo__actions">
        <ix-button variant="primary" (click)="buildPreset()">
          Director → Classic Cheeseburger
        </ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <div class="build">
        <div class="build__plate">
          @if (stack().length === 0) {
            <span class="build__empty">Empty plate — start adding parts</span>
          }
          <div class="build__stack">
            @for (layer of stack(); track layer.id) {
              <div
                class="layer"
                [style.background]="layer.part.color"
                [style.--i]="$index"
              >
                <span class="layer__glyph">{{ layer.part.glyph }}</span>
                {{ layer.part.label }}
              </div>
            }
          </div>
        </div>

        <ol class="recipe">
          <li class="recipe__title">Construction steps ({{ stack().length }})</li>
          @for (layer of stack(); track layer.id) {
            <li>{{ $index + 1 }}. add {{ layer.part.label }}</li>
          }
          @empty {
            <li class="recipe__muted">no steps yet</li>
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
        gap: 1rem;
      }
      .demo__palette,
      .demo__actions {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .demo__label {
        font-weight: 600;
      }
      .build {
        display: grid;
        grid-template-columns: 1fr 220px;
        gap: 1.5rem;
        margin-top: 0.5rem;
      }
      .build__plate {
        min-height: 240px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 1.5rem;
        border-radius: 12px;
        background: var(--theme-color-2);
      }
      .build__empty {
        color: var(--theme-color-soft-text);
        align-self: center;
      }
      .build__stack {
        display: flex;
        flex-direction: column-reverse;
        gap: 4px;
        width: 220px;
      }
      .layer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        height: 34px;
        border-radius: 18px;
        color: #1a1a1a;
        font-weight: 600;
        font-size: 0.85rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        animation: drop 0.4s cubic-bezier(0.2, 1.5, 0.4, 1) both;
      }
      .layer__glyph {
        font-size: 1.1rem;
      }
      .recipe {
        margin: 0;
        padding: 1rem 1rem 1rem 1.25rem;
        list-style: none;
        border: 1px solid var(--theme-color-soft-bdr);
        border-radius: 10px;
        font-size: 0.9rem;
      }
      .recipe li {
        padding: 0.15rem 0;
      }
      .recipe__title {
        font-weight: 700;
        margin-bottom: 0.4rem;
      }
      .recipe__muted {
        color: var(--theme-color-soft-text);
      }
      @keyframes drop {
        0% {
          opacity: 0;
          transform: translateY(-24px) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @media (max-width: 640px) {
        .build {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BuilderDemo {
  readonly parts: Part[] = [
    { key: 'bottom', label: 'Bottom bun', glyph: '🍞', color: '#e8b06b' },
    { key: 'patty', label: 'Patty', glyph: '🥩', color: '#8a5a3b' },
    { key: 'cheese', label: 'Cheese', glyph: '🧀', color: '#f6c945' },
    { key: 'lettuce', label: 'Lettuce', glyph: '🥬', color: '#7cc576' },
    { key: 'sauce', label: 'Sauce', glyph: '🥫', color: '#e06c5a' },
    { key: 'top', label: 'Top bun', glyph: '🍔', color: '#e8b06b' },
  ];

  private nextId = 0;
  readonly stack = signal<{ id: number; part: Part }[]>([]);
  readonly partCount = computed(() => this.stack().length);

  addPart(key: string): void {
    const part = this.parts.find((candidate) => candidate.key === key);
    if (part) {
      this.stack.update((current) => [...current, { id: this.nextId++, part }]);
    }
  }

  buildPreset(): void {
    this.reset();
    const recipe = ['bottom', 'patty', 'cheese', 'sauce', 'lettuce', 'top'];
    recipe.forEach((key, index) => {
      setTimeout(() => this.addPart(key), index * 180);
    });
  }

  reset(): void {
    this.stack.set([]);
  }
}
