import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

type PlayerState = 'stopped' | 'playing' | 'paused';

interface StateVisual {
  label: string;
  glyph: string;
  playPauseLabel: string;
}

const VISUALS: Record<PlayerState, StateVisual> = {
  stopped: { label: 'Stopped', glyph: '⏹️', playPauseLabel: 'Play' },
  playing: { label: 'Playing', glyph: '▶️', playPauseLabel: 'Pause' },
  paused: { label: 'Paused', glyph: '⏸️', playPauseLabel: 'Resume' },
};

/**
 * State demo: a media player whose Play/Pause button does something different
 * depending on its CURRENT state alone — Stopped -> Playing, Playing -> Paused,
 * Paused -> Playing — while Stop always returns to Stopped. The button never
 * needs an if/else on the caller's side; the player itself decides.
 */
@Component({
  selector: 'app-state-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Press "Play/Pause" repeatedly and watch it do something different each time,
        purely based on the player's current state.
      </p>

      <div class="player" [attr.data-state]="state()">
        <span class="player__glyph" [class.player__glyph--spin]="state() === 'playing'">
          {{ visual().glyph }}
        </span>
        <span class="player__label">{{ visual().label }}</span>
      </div>

      <div class="demo__controls">
        <ix-button variant="primary" (click)="playPause()">
          {{ visual().playPauseLabel }}/Pause
        </ix-button>
        <ix-button variant="secondary" (click)="stop()">Stop</ix-button>
      </div>

      <p class="demo__log">Last transition: {{ log() }}</p>
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
      .player {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
        min-height: 140px;
        justify-content: center;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 2px solid var(--theme-color-soft-bdr);
        transition: border-color 0.35s ease, box-shadow 0.35s ease;
      }
      .player[data-state='stopped'] {
        border-color: var(--theme-color-soft-bdr);
      }
      .player[data-state='playing'] {
        border-color: var(--theme-color-success);
        box-shadow: 0 0 22px color-mix(in srgb, var(--theme-color-success) 45%, transparent);
      }
      .player[data-state='paused'] {
        border-color: var(--theme-color-warning);
        box-shadow: 0 0 22px color-mix(in srgb, var(--theme-color-warning) 35%, transparent);
      }
      .player__glyph {
        font-size: 3rem;
        line-height: 1;
      }
      .player__glyph--spin {
        animation: pulse 1.1s ease-in-out infinite;
      }
      .player__label {
        font-weight: 700;
        font-size: 1.1rem;
      }
      .player[data-state='stopped'] .player__label {
        color: var(--theme-color-soft-text);
      }
      .player[data-state='playing'] .player__label {
        color: var(--theme-color-success);
      }
      .player[data-state='paused'] .player__label {
        color: var(--theme-color-warning);
      }
      .demo__log {
        margin: 0;
        color: var(--theme-color-soft-text);
        font-size: 0.9rem;
      }
      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.15);
        }
      }
    `,
  ],
})
export class StateDemo {
  readonly state = signal<PlayerState>('stopped');
  readonly log = signal('—');

  visual(): StateVisual {
    return VISUALS[this.state()];
  }

  playPause(): void {
    const current = this.state();
    // The same button press means something different depending on current state.
    if (current === 'stopped') {
      this.state.set('playing');
      this.log.set('Stopped --(Play/Pause)--> Playing');
    } else if (current === 'playing') {
      this.state.set('paused');
      this.log.set('Playing --(Play/Pause)--> Paused');
    } else {
      this.state.set('playing');
      this.log.set('Paused --(Play/Pause)--> Playing');
    }
  }

  stop(): void {
    const current = this.state();
    if (current === 'stopped') {
      return;
    }
    this.log.set(`${VISUALS[current].label} --(Stop)--> Stopped`);
    this.state.set('stopped');
  }
}
