import { Component, computed, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type RemoteKind = 'basic' | 'advanced';
type DeviceKind = 'tv' | 'radio';

interface Combo {
  message: string;
  glyph: string;
}

const COMBOS: Record<RemoteKind, Record<DeviceKind, Combo>> = {
  basic: {
    tv: { message: 'Basic Remote -> TV: power toggled on channel 1.', glyph: '📺' },
    radio: { message: 'Basic Remote -> Radio: power toggled, last station resumes.', glyph: '📻' },
  },
  advanced: {
    tv: {
      message: 'Advanced Remote -> TV: powered on, recalling your saved favourites.',
      glyph: '📺',
    },
    radio: {
      message: 'Advanced Remote -> Radio: tuned to static-free FM automatically.',
      glyph: '📻',
    },
  },
};

/**
 * Bridge demo: the Remote (abstraction) and Device (implementation) vary
 * independently. Only 2 remote kinds + 2 device kinds exist, but every one of
 * the 4 combinations is handled correctly -- no RemoteForTv / RemoteForRadio
 * subclass explosion needed.
 */
@Component({
  selector: 'app-bridge-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Pick a remote and a device independently, then press power. Every combination just works.
      </p>

      <div class="demo__pickers">
        <div class="picker">
          <span class="picker__label">Remote (abstraction)</span>
          <div class="picker__options">
            <ix-button
              [variant]="remote() === 'basic' ? 'primary' : 'secondary'"
              (click)="setRemote('basic')"
            >
              Basic
            </ix-button>
            <ix-button
              [variant]="remote() === 'advanced' ? 'primary' : 'secondary'"
              (click)="setRemote('advanced')"
            >
              Advanced
            </ix-button>
          </div>
        </div>

        <div class="picker">
          <span class="picker__label">Device (implementation)</span>
          <div class="picker__options">
            <ix-button
              [variant]="device() === 'tv' ? 'primary' : 'secondary'"
              (click)="setDevice('tv')"
            >
              TV
            </ix-button>
            <ix-button
              [variant]="device() === 'radio' ? 'primary' : 'secondary'"
              (click)="setDevice('radio')"
            >
              Radio
            </ix-button>
          </div>
        </div>
      </div>

      <div class="demo__controls">
        <ix-button variant="primary" (click)="press()">Press power</ix-button>
      </div>

      <div class="demo__stage">
        <div class="bridge-link">
          <span class="bridge-link__node">{{ remoteLabel() }}</span>
          <span class="bridge-link__wire" [class.bridge-link__wire--active]="pressed()"></span>
          <span class="bridge-link__node">{{ deviceLabel() }}</span>
        </div>

        <div class="result" [class.result--active]="pressed()">
          <span class="result__glyph">{{ combo().glyph }}</span>
          <span>{{ combo().message }}</span>
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
      .demo__pickers {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .picker {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
      }
      .picker__label {
        font-weight: 600;
        color: var(--theme-color-soft-text);
        font-size: 0.85rem;
      }
      .picker__options {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .demo__controls {
        display: flex;
      }
      .demo__stage {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.25rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .bridge-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }
      .bridge-link__node {
        padding: 0.6rem 1rem;
        border-radius: 8px;
        border: 1px solid var(--theme-color-primary);
        color: var(--theme-color-primary);
        font-weight: 600;
        background: color-mix(in srgb, var(--theme-color-primary) 12%, transparent);
      }
      .bridge-link__wire {
        flex: 1;
        max-width: 120px;
        height: 3px;
        background: var(--theme-color-soft-bdr);
        border-radius: 2px;
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }
      .bridge-link__wire--active {
        background: var(--theme-color-success);
        box-shadow: 0 0 12px color-mix(in srgb, var(--theme-color-success) 60%, transparent);
        animation: flow 0.5s ease;
      }
      .result {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background: var(--theme-color-1);
        color: var(--theme-color-soft-text);
        transition: color 0.3s ease;
      }
      .result--active {
        color: var(--theme-color-std-text);
        font-weight: 600;
      }
      .result__glyph {
        font-size: 1.4rem;
        line-height: 1;
      }
      @keyframes flow {
        0% {
          opacity: 0.3;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 1;
        }
      }
      @media (max-width: 640px) {
        .demo__pickers {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BridgeDemo {
  readonly remote = signal<RemoteKind>('basic');
  readonly device = signal<DeviceKind>('tv');
  readonly pressed = signal(false);

  readonly combo = computed(() => COMBOS[this.remote()][this.device()]);
  readonly remoteLabel = computed(() =>
    this.remote() === 'basic' ? 'Basic Remote' : 'Advanced Remote',
  );
  readonly deviceLabel = computed(() => (this.device() === 'tv' ? 'TV' : 'Radio'));

  setRemote(kind: RemoteKind): void {
    this.remote.set(kind);
  }

  setDevice(kind: DeviceKind): void {
    this.device.set(kind);
  }

  press(): void {
    this.pressed.set(false);
    // Re-trigger the animation even if the same combo is pressed again.
    requestAnimationFrame(() => this.pressed.set(true));
  }
}
