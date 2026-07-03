import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type ShapeKind = 'circle' | 'square' | 'triangle';
type VisitorKey = 'area' | 'highlight';

interface ShapeDef {
  kind: ShapeKind;
  label: string;
  glyph: string;
  dims: string;
  area: number;
}

const SHAPES: ShapeDef[] = [
  { kind: 'circle', label: 'Circle', glyph: '⚪', dims: 'radius 4', area: Math.PI * 4 * 4 },
  { kind: 'square', label: 'Square', glyph: '⬛', dims: 'side 5', area: 5 * 5 },
  { kind: 'triangle', label: 'Triangle', glyph: '🔺', dims: 'base 6, height 4', area: (6 * 4) / 2 },
];

interface ShapeCardState {
  def: ShapeDef;
  result: string | null;
  pulsing: boolean;
}

/**
 * Visitor demo: two entirely different operations (computing area, or just
 * highlighting) get "added" to Circle/Square/Triangle without changing what
 * those shapes are — each shape just "accepts" whichever visitor is selected
 * and the visitor supplies the type-specific behavior.
 */
@Component({
  selector: 'app-visitor-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Pick a visitor, then press "Visit all shapes". The same three shapes get a new
        operation applied without any change to what a Circle, Square, or Triangle is.
      </p>

      <div class="demo__controls">
        <ix-button
          [variant]="visitor() === 'area' ? 'primary' : 'secondary'"
          [disabled]="visiting()"
          (click)="selectVisitor('area')"
        >
          Compute Area
        </ix-button>
        <ix-button
          [variant]="visitor() === 'highlight' ? 'primary' : 'secondary'"
          [disabled]="visiting()"
          (click)="selectVisitor('highlight')"
        >
          Highlight Only
        </ix-button>
        <ix-button variant="tertiary" [disabled]="visiting()" (click)="visitAll()">
          Visit all shapes
        </ix-button>
      </div>

      <div class="shapes">
        @for (card of cards(); track card.def.kind) {
          <div class="shape" [class.shape--pulsing]="card.pulsing">
            <span class="shape__glyph">{{ card.def.glyph }}</span>
            <span class="shape__label">{{ card.def.label }}</span>
            <span class="shape__dims">{{ card.def.dims }}</span>
            <span class="shape__result">{{ card.result ?? ' ' }}</span>
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
      .shapes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
      }
      .shape {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        padding: 1.25rem 1rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 2px solid var(--theme-color-soft-bdr);
        transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
      }
      .shape--pulsing {
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 22px color-mix(in srgb, var(--theme-color-primary) 55%, transparent);
        transform: scale(1.06);
      }
      .shape__glyph {
        font-size: 2.6rem;
        line-height: 1;
      }
      .shape__label {
        font-weight: 700;
      }
      .shape__dims {
        font-size: 0.8rem;
        color: var(--theme-color-soft-text);
      }
      .shape__result {
        min-height: 1.4rem;
        font-weight: 700;
        color: var(--theme-color-primary);
      }
    `,
  ],
})
export class VisitorDemo {
  readonly visitor = signal<VisitorKey>('area');
  readonly visiting = signal(false);
  readonly cards = signal<ShapeCardState[]>(
    SHAPES.map((def) => ({ def, result: null, pulsing: false })),
  );

  selectVisitor(key: VisitorKey): void {
    if (this.visiting()) {
      return;
    }
    this.visitor.set(key);
    this.cards.set(SHAPES.map((def) => ({ def, result: null, pulsing: false })));
  }

  visitAll(): void {
    if (this.visiting()) {
      return;
    }
    this.visiting.set(true);
    this.cards.update((list) => list.map((card) => ({ ...card, result: null, pulsing: false })));

    const key = this.visitor();
    let i = 0;
    const tick = () => {
      if (i >= SHAPES.length) {
        this.visiting.set(false);
        return;
      }
      const index = i;
      // The visitor supplies the operation; the shape only "accepts" it.
      this.cards.update((list) =>
        list.map((card, idx) =>
          idx === index
            ? {
                ...card,
                pulsing: true,
                result: key === 'area' ? `area ≈ ${card.def.area.toFixed(1)}` : 'visited ✓',
              }
            : card,
        ),
      );
      setTimeout(() => {
        this.cards.update((list) =>
          list.map((card, idx) => (idx === index ? { ...card, pulsing: false } : card)),
        );
      }, 380);
      i++;
      setTimeout(tick, 500);
    };
    tick();
  }
}
