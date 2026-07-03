import { Component, signal } from '@angular/core';
import { IxButton, IxIconButton } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconDuplicate, iconMinus, iconPlus } from '@siemens/ix-icons/icons';

interface Creature {
  id: number;
  label: string;
  color: string;
  energy: number;
}

/**
 * Prototype demo: clone an existing object instead of building a new one from
 * scratch. Each clone is an independent deep copy — mutate a clone and the
 * original (and its siblings) stay untouched.
 */
@Component({
  selector: 'app-prototype-demo',
  imports: [IxButton, IxIconButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Tune the prototype, then <strong>clone</strong> it. Change a clone's colour
        or energy — notice the original never changes.
      </p>

      <div class="grid">
        <div class="card card--proto" [style.--c]="prototype().color">
          <span class="card__tag">Prototype</span>
          <div class="orb" [style.background]="prototype().color"></div>
          <div class="energy">
            @for (bar of bars; track bar) {
              <span class="energy__bar" [class.energy__bar--on]="bar <= prototype().energy"></span>
            }
          </div>
          <div class="row">
            @for (color of palette; track color) {
              <button
                class="swatch"
                [style.background]="color"
                [class.swatch--active]="color === prototype().color"
                (click)="setProtoColor(color)"
              ></button>
            }
          </div>
          <div class="row">
            <ix-icon-button outline icon="minus" size="16" (click)="protoEnergy(-1)"></ix-icon-button>
            <span class="row__label">energy</span>
            <ix-icon-button outline icon="plus" size="16" (click)="protoEnergy(1)"></ix-icon-button>
          </div>
          <ix-button variant="primary" icon="duplicate" (click)="clone()">Clone</ix-button>
        </div>

        <div class="clones">
          @for (clone of clones(); track clone.id) {
            <div class="card card--clone" [style.--c]="clone.color">
              <span class="card__tag">Clone #{{ clone.label }}</span>
              <div class="orb" [style.background]="clone.color"></div>
              <div class="energy">
                @for (bar of bars; track bar) {
                  <span class="energy__bar" [class.energy__bar--on]="bar <= clone.energy"></span>
                }
              </div>
              <div class="row">
                @for (color of palette; track color) {
                  <button
                    class="swatch"
                    [style.background]="color"
                    [class.swatch--active]="color === clone.color"
                    (click)="setCloneColor(clone.id, color)"
                  ></button>
                }
              </div>
              <div class="row">
                <ix-icon-button variant="subtle-secondary" icon="minus" size="16" (click)="cloneEnergy(clone.id, -1)"></ix-icon-button>
                <span class="row__label">energy</span>
                <ix-icon-button variant="subtle-secondary" icon="plus" size="16" (click)="cloneEnergy(clone.id, 1)"></ix-icon-button>
              </div>
            </div>
          } @empty {
            <div class="clones__empty">No clones yet — press “Clone”.</div>
          }
        </div>
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
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .grid {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 1.5rem;
      }
      .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem;
        border-radius: 12px;
        border: 2px solid var(--c);
        background: color-mix(in srgb, var(--c) 10%, transparent);
      }
      .card--clone {
        animation: pop 0.4s cubic-bezier(0.2, 1.4, 0.4, 1);
      }
      .card__tag {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--theme-color-soft-text);
      }
      .orb {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        box-shadow: 0 0 18px var(--c);
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }
      .energy {
        display: flex;
        gap: 3px;
      }
      .energy__bar {
        width: 14px;
        height: 8px;
        border-radius: 2px;
        background: var(--theme-color-soft-bdr);
      }
      .energy__bar--on {
        background: var(--c);
      }
      .row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .row__label {
        font-size: 0.8rem;
        color: var(--theme-color-soft-text);
      }
      .swatch {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        padding: 0;
      }
      .swatch--active {
        border-color: var(--theme-color-std-text);
        transform: scale(1.15);
      }
      .clones {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
        align-content: start;
      }
      .clones__empty {
        color: var(--theme-color-soft-text);
        align-self: center;
      }
      @keyframes pop {
        0% {
          opacity: 0;
          transform: scale(0.6);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      @media (max-width: 640px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PrototypeDemo {
  readonly palette = ['#00a0e9', '#00cc76', '#ff9000', '#7c5cff', '#e5504d'];
  readonly bars = [1, 2, 3, 4, 5];

  readonly prototype = signal<Creature>({ id: 0, label: 'proto', color: '#00a0e9', energy: 3 });
  readonly clones = signal<Creature[]>([]);
  private nextLabel = 1;

  setProtoColor(color: string): void {
    this.prototype.update((current) => ({ ...current, color }));
  }

  protoEnergy(delta: number): void {
    this.prototype.update((current) => ({ ...current, energy: this.clamp(current.energy + delta) }));
  }

  clone(): void {
    // Deep copy the prototype — the clone is fully independent afterwards.
    const copy: Creature = {
      ...structuredClone(this.prototype()),
      id: Date.now() + Math.random(),
      label: String(this.nextLabel++),
    };
    this.clones.update((current) => [...current, copy]);
  }

  setCloneColor(id: number, color: string): void {
    this.clones.update((list) =>
      list.map((clone) => (clone.id === id ? { ...clone, color } : clone)),
    );
  }

  cloneEnergy(id: number, delta: number): void {
    this.clones.update((list) =>
      list.map((clone) =>
        clone.id === id ? { ...clone, energy: this.clamp(clone.energy + delta) } : clone,
      ),
    );
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(5, value));
  }

  constructor() {
    addIcons({ iconDuplicate, iconPlus, iconMinus });
  }
}
