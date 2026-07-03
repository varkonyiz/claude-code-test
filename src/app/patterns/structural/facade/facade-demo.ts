import { Component, computed, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type StepKey = 'screen' | 'projector' | 'amp';

interface SubsystemStep {
  key: StepKey;
  label: string;
  glyph: string;
  action: string;
}

/**
 * Facade demo: three subsystems (Screen, Projector, Amplifier) can each be
 * flipped manually in any order, or the single "Watch Movie" facade button
 * runs all three steps for you, animated in the one correct sequence — the
 * caller no longer needs to know the ordering rule.
 */
@Component({
  selector: 'app-facade-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Flip the subsystems manually in any order, or let the facade run the correct
        sequence for you with one click.
      </p>

      <div class="demo__actions">
        <ix-button variant="primary" icon="play" [disabled]="running()" (click)="watchMovie()">
          Watch Movie (facade)
        </ix-button>
        <ix-button variant="tertiary" [disabled]="running()" (click)="reset()">Reset</ix-button>
      </div>

      <div class="subsystems">
        @for (step of steps; track step.key) {
          <div class="subsystem" [class.subsystem--on]="isOn(step.key)">
            <span class="subsystem__glyph">{{ step.glyph }}</span>
            <span class="subsystem__label">{{ step.label }}</span>
            <span class="subsystem__state">{{ isOn(step.key) ? 'ON' : 'off' }}</span>
            <ix-button
              variant="secondary"
              [disabled]="running()"
              (click)="toggleManual(step.key)"
            >
              Toggle manually
            </ix-button>
          </div>
        }
      </div>

      <ol class="checklist">
        <li class="checklist__title">Facade sequence</li>
        @for (step of steps; track step.key; let i = $index) {
          <li [class.checklist__item--done]="activeStep() > i">
            <span class="checklist__mark">{{ activeStep() > i ? '✔' : i + 1 }}</span>
            {{ step.action }}
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
      .demo__actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .subsystems {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
      }
      .subsystem {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.1rem;
        border-radius: 12px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        transition: box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .subsystem--on {
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 16px color-mix(in srgb, var(--theme-color-primary) 45%, transparent);
      }
      .subsystem__glyph {
        font-size: 1.9rem;
        line-height: 1;
      }
      .subsystem__label {
        font-weight: 600;
      }
      .subsystem__state {
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: var(--theme-color-soft-text);
      }
      .subsystem--on .subsystem__state {
        color: var(--theme-color-success);
      }
      .checklist {
        margin: 0;
        padding: 1rem 1rem 1rem 1.25rem;
        list-style: none;
        border: 1px solid var(--theme-color-soft-bdr);
        border-radius: 10px;
        font-size: 0.9rem;
      }
      .checklist li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0;
        color: var(--theme-color-soft-text);
        transition: color 0.3s ease;
      }
      .checklist__title {
        font-weight: 700;
        color: var(--theme-color-std-text) !important;
        margin-bottom: 0.4rem;
      }
      .checklist__mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 50%;
        border: 1px solid var(--theme-color-soft-bdr);
        font-size: 0.75rem;
        flex-shrink: 0;
      }
      .checklist__item--done {
        color: var(--theme-color-std-text);
      }
      .checklist__item--done .checklist__mark {
        background: var(--theme-color-success);
        border-color: var(--theme-color-success);
        color: #fff;
      }
    `,
  ],
})
export class FacadeDemo {
  readonly steps: SubsystemStep[] = [
    { key: 'screen', label: 'Screen', glyph: '🖼️', action: 'Lower the screen' },
    { key: 'projector', label: 'Projector', glyph: '📽️', action: 'Power on the projector' },
    { key: 'amp', label: 'Amplifier', glyph: '🔊', action: 'Power on the amplifier' },
  ];

  private readonly state = signal<Record<StepKey, boolean>>({
    screen: false,
    projector: false,
    amp: false,
  });

  readonly running = signal(false);
  readonly activeStep = signal(0);
  readonly allOn = computed(() => Object.values(this.state()).every(Boolean));

  isOn(key: StepKey): boolean {
    return this.state()[key];
  }

  toggleManual(key: StepKey): void {
    this.state.update((current) => ({ ...current, [key]: !current[key] }));
  }

  watchMovie(): void {
    this.reset();
    this.running.set(true);
    this.steps.forEach((step, index) => {
      setTimeout(() => {
        this.state.update((current) => ({ ...current, [step.key]: true }));
        this.activeStep.set(index + 1);
        if (index === this.steps.length - 1) {
          this.running.set(false);
        }
      }, (index + 1) * 500);
    });
  }

  reset(): void {
    this.state.set({ screen: false, projector: false, amp: false });
    this.activeStep.set(0);
    this.running.set(false);
  }
}
