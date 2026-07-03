import { Component, signal } from '@angular/core';
import { IxButton, IxIcon, IxToggle } from '@siemens/ix-angular/standalone';

type PlugResult = 'idle' | 'success' | 'fail';

/**
 * Adapter demo: the client expects a round "MediaPlayer" plug, but the legacy
 * device only exposes a square pin socket. With the adapter toggled off,
 * connecting them clashes. Toggle the adapter on and an adapter icon bridges
 * the mismatch, so the same legacy device now connects cleanly.
 */
@Component({
  selector: 'app-adapter-demo',
  imports: [IxButton, IxIcon, IxToggle],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Try connecting the client plug to the legacy device. Then switch the adapter on and
        connect again.
      </p>

      <div class="demo__controls">
        <ix-toggle
          [checked]="useAdapter()"
          textOn="Adapter ON"
          textOff="Adapter OFF"
          (checkedChange)="setAdapter($event.detail)"
        ></ix-toggle>
        <ix-button variant="primary" (click)="connect()">Connect</ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <div class="demo__stage">
        <div class="socket socket--client">
          <span class="socket__shape socket__shape--round"></span>
          <span class="socket__label">Client expects<br /><strong>MediaPlayer.play()</strong></span>
        </div>

        <div class="bridge" [class.bridge--clash]="result() === 'fail'">
          @if (useAdapter()) {
            <div class="adapter" [class.adapter--active]="animating()">
              <ix-icon name="connector" size="24"></ix-icon>
              <span class="adapter__label">Adapter</span>
            </div>
          } @else {
            <span class="bridge__gap" [class.bridge__gap--pulse]="animating()">
              @if (result() === 'fail') {
                &#10005;
              } @else {
                &#8213;&#8213;
              }
            </span>
          }
        </div>

        <div class="socket socket--legacy">
          <span class="socket__shape socket__shape--square"></span>
          <span class="socket__label">Legacy device<br /><strong>spinVinyl()</strong></span>
        </div>
      </div>

      <div class="demo__result" [class.demo__result--ok]="result() === 'success'"
           [class.demo__result--fail]="result() === 'fail'">
        @switch (result()) {
          @case ('success') {
            <span>Connected! The adapter translated play() into spinVinyl().</span>
          }
          @case ('fail') {
            <span>Incompatible! A round plug doesn't fit a square socket.</span>
          }
          @default {
            <span>Not connected yet.</span>
          }
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
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .demo__stage {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        padding: 1.5rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
        flex-wrap: wrap;
      }
      .socket {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
        min-width: 140px;
        text-align: center;
      }
      .socket__label {
        color: var(--theme-color-soft-text);
        font-size: 0.85rem;
        line-height: 1.3;
      }
      .socket__label strong {
        color: var(--theme-color-std-text);
      }
      .socket__shape {
        width: 64px;
        height: 64px;
        border: 2px solid var(--theme-color-primary);
        background: color-mix(in srgb, var(--theme-color-primary) 16%, transparent);
      }
      .socket__shape--round {
        border-radius: 50%;
      }
      .socket__shape--square {
        border-radius: 6px;
      }
      .bridge {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 80px;
        min-height: 64px;
        transition: filter 0.3s ease;
      }
      .bridge--clash {
        animation: shake 0.4s ease;
      }
      .bridge__gap {
        font-size: 1.5rem;
        color: var(--theme-color-soft-text);
        letter-spacing: 0.1em;
      }
      .bridge__gap--pulse {
        color: var(--theme-color-warning);
      }
      .adapter {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        padding: 0.6rem 0.9rem;
        border-radius: 10px;
        border: 1px dashed var(--theme-color-soft-bdr);
        color: var(--theme-color-primary);
        transition: box-shadow 0.3s ease, transform 0.3s ease;
      }
      .adapter--active {
        box-shadow: 0 0 18px color-mix(in srgb, var(--theme-color-success) 55%, transparent);
        border-color: var(--theme-color-success);
        transform: scale(1.08);
      }
      .adapter__label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--theme-color-soft-text);
      }
      .demo__result {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background: var(--theme-color-2);
        color: var(--theme-color-soft-text);
      }
      .demo__result--ok {
        color: var(--theme-color-success);
        font-weight: 600;
        background: color-mix(in srgb, var(--theme-color-success) 16%, transparent);
      }
      .demo__result--fail {
        color: var(--theme-color-warning);
        font-weight: 600;
        background: color-mix(in srgb, var(--theme-color-warning) 16%, transparent);
      }
      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-6px);
        }
        75% {
          transform: translateX(6px);
        }
      }
    `,
  ],
})
export class AdapterDemo {
  readonly useAdapter = signal(false);
  readonly result = signal<PlugResult>('idle');
  readonly animating = signal(false);

  setAdapter(on: boolean): void {
    this.useAdapter.set(on);
    this.result.set('idle');
  }

  connect(): void {
    this.result.set(this.useAdapter() ? 'success' : 'fail');
    this.animating.set(true);
    setTimeout(() => this.animating.set(false), 400);
  }

  reset(): void {
    this.result.set('idle');
    this.animating.set(false);
  }
}
