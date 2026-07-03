import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

interface Species {
  key: string;
  label: string;
  glyph: string;
  color: string;
}

interface PlantedTree {
  id: number;
  speciesKey: string;
  glyph: string;
  color: string;
  x: number;
  y: number;
}

/**
 * Flyweight demo: planting trees grows the "instances placed" counter freely,
 * but the "species objects created" counter — the shared, heavy intrinsic
 * data — only grows the first time each species is used and caps at 3, since
 * every tree of a species reuses the same shared species object.
 */
@Component({
  selector: 'app-flyweight-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Pick a species, then plant trees. Watch how instances grow without limit while
        shared species objects stay capped.
      </p>

      <div class="demo__controls">
        @for (species of allSpecies; track species.key) {
          <ix-button
            [variant]="selected() === species.key ? 'primary' : 'secondary'"
            (click)="select(species.key)"
          >
            {{ species.glyph }} {{ species.label }}
          </ix-button>
        }
        <ix-button variant="primary" icon="database" (click)="plant()">Plant tree</ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <div class="counters">
        <div class="counter">
          <span class="counter__value">{{ trees().length }}</span>
          <span class="counter__label">Tree instances placed</span>
        </div>
        <div class="counter counter--shared">
          <span class="counter__value">{{ speciesCreated().length }}</span>
          <span class="counter__label">Species objects created (shared, max 3)</span>
        </div>
      </div>

      <div class="forest">
        @if (trees().length === 0) {
          <span class="forest__empty">Empty plot — plant your first tree</span>
        }
        @for (tree of trees(); track tree.id) {
          <span
            class="tree"
            [style.left.%]="tree.x"
            [style.top.%]="tree.y"
            [style.color]="tree.color"
          >
            {{ tree.glyph }}
          </span>
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
        gap: 0.6rem;
        flex-wrap: wrap;
        align-items: center;
      }
      .counters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .counter {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.9rem 1.25rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        min-width: 220px;
      }
      .counter__value {
        font-size: 1.9rem;
        font-weight: 700;
        color: var(--theme-color-std-text);
      }
      .counter--shared .counter__value {
        color: var(--theme-color-primary);
      }
      .counter__label {
        font-size: 0.85rem;
        color: var(--theme-color-soft-text);
      }
      .forest {
        position: relative;
        min-height: 260px;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
        overflow: hidden;
      }
      .forest__empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--theme-color-soft-text);
      }
      .tree {
        position: absolute;
        font-size: 1.8rem;
        transform: translate(-50%, -50%);
        animation: sprout 0.35s cubic-bezier(0.2, 1.5, 0.4, 1) both;
        filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
      }
      @keyframes sprout {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.2);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    `,
  ],
})
export class FlyweightDemo {
  readonly allSpecies: Species[] = [
    { key: 'oak', label: 'Oak', glyph: '🌳', color: '#6fae4e' },
    { key: 'pine', label: 'Pine', glyph: '🌲', color: '#3f8f5b' },
    { key: 'birch', label: 'Birch', glyph: '🌴', color: '#8bc34a' },
  ];

  readonly selected = signal(this.allSpecies[0].key);
  readonly trees = signal<PlantedTree[]>([]);
  /** Simulates the flyweight factory's cache: species objects created so far. */
  readonly speciesCreated = signal<string[]>([]);

  private nextId = 0;

  select(key: string): void {
    this.selected.set(key);
  }

  plant(): void {
    const species = this.allSpecies.find((s) => s.key === this.selected())!;

    // The "factory": only create (cache) a species object the first time it's used.
    if (!this.speciesCreated().includes(species.key)) {
      this.speciesCreated.update((created) => [...created, species.key]);
    }

    const tree: PlantedTree = {
      id: this.nextId++,
      speciesKey: species.key,
      glyph: species.glyph,
      color: species.color,
      x: 5 + Math.random() * 90,
      y: 10 + Math.random() * 80,
    };
    this.trees.update((current) => [...current, tree]);
  }

  reset(): void {
    this.trees.set([]);
    this.speciesCreated.set([]);
  }
}
