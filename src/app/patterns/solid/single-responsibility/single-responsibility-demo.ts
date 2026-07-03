import { Component, computed, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type ChangeKind = 'formatting' | 'storage' | 'calculation';

interface Responsibility {
  key: ChangeKind;
  label: string;
  glyph: string;
}

/**
 * SRP demo: a "Report" object has three reasons to change (how it's formatted,
 * where it's saved, how totals are calculated). In the monolithic design, all
 * three live in one class, so ANY change request flags the whole thing for
 * retesting. In the refactored design, each responsibility is its own class, so
 * a change only touches the one class actually responsible for it.
 */
@Component({
  selector: 'app-single-responsibility-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <div class="demo__controls">
        <ix-button
          [variant]="refactored() ? 'secondary' : 'primary'"
          (click)="setRefactored(false)"
        >
          Monolith
        </ix-button>
        <ix-button
          [variant]="refactored() ? 'primary' : 'secondary'"
          (click)="setRefactored(true)"
        >
          Refactored
        </ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <p class="demo__hint">
        Request a change, then watch which part of the code gets flagged for
        retesting.
      </p>

      <div class="demo__requests">
        @for (r of responsibilities; track r.key) {
          <ix-button variant="secondary" (click)="requestChange(r.key)">
            {{ r.glyph }} Change {{ r.label }}
          </ix-button>
        }
      </div>

      @if (!refactored()) {
        <div class="unit unit--mono" [class.unit--flagged]="anyTouched()">
          <span class="unit__label">ReportManager</span>
          <div class="unit__parts">
            @for (r of responsibilities; track r.key) {
              <span class="part" [class.part--flagged]="anyTouched()">{{ r.glyph }} {{ r.label }}</span>
            }
          </div>
          @if (anyTouched()) {
            <p class="unit__note">
              Everything lives in one class, so the whole thing must be re-tested —
              even the parts that had nothing to do with the change.
            </p>
          }
        </div>
      } @else {
        <div class="units">
          @for (r of responsibilities; track r.key) {
            <div class="unit" [class.unit--flagged]="touched().includes(r.key)">
              <span class="unit__label">{{ classNameFor(r.key) }}</span>
              <span class="part">{{ r.glyph }} {{ r.label }}</span>
              @if (touched().includes(r.key)) {
                <p class="unit__note">Only this class needs retesting.</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
      }
      .demo__controls,
      .demo__requests {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .units {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }
      .unit {
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        transition: border-color 0.3s ease, background 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .unit--flagged {
        border-color: var(--theme-color-warning);
        background: color-mix(in srgb, var(--theme-color-warning) 14%, transparent);
      }
      .unit__label {
        font-weight: 700;
        font-family: var(--theme-font-family-monospace, monospace);
      }
      .unit__parts {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .part {
        padding: 0.3rem 0.6rem;
        border-radius: 999px;
        background: var(--theme-color-1);
        border: 1px solid var(--theme-color-soft-bdr);
        font-size: 0.85rem;
        transition: border-color 0.3s ease, color 0.3s ease;
      }
      .part--flagged {
        border-color: var(--theme-color-warning);
        color: var(--theme-color-warning);
      }
      .unit__note {
        margin: 0;
        font-size: 0.85rem;
        color: var(--theme-color-warning);
      }
    `,
  ],
})
export class SingleResponsibilityDemo {
  readonly responsibilities: Responsibility[] = [
    { key: 'calculation', label: 'Calculation', glyph: '🧮' },
    { key: 'formatting', label: 'Formatting', glyph: '📝' },
    { key: 'storage', label: 'Storage', glyph: '💾' },
  ];

  readonly refactored = signal(false);
  readonly touched = signal<ChangeKind[]>([]);
  readonly anyTouched = computed(() => this.touched().length > 0);

  setRefactored(on: boolean): void {
    this.refactored.set(on);
    this.touched.set([]);
  }

  requestChange(kind: ChangeKind): void {
    if (this.refactored()) {
      this.touched.set([kind]);
    } else {
      // Monolithic class: any change flags the entire unit.
      this.touched.set(this.responsibilities.map((r) => r.key));
    }
  }

  reset(): void {
    this.touched.set([]);
  }

  classNameFor(kind: ChangeKind): string {
    return kind === 'calculation' ? 'Calculator' : kind === 'formatting' ? 'Formatter' : 'Repository';
  }
}
