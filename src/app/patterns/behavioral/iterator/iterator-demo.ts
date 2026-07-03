import { Component, computed, signal } from '@angular/core';
import { IxButton, IxToggle } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconArrowRight, iconRandom } from '@siemens/ix-icons/icons';

interface Song {
  title: string;
  artist: string;
}

const PLAYLIST: Song[] = [
  { title: 'Sunset Drive', artist: 'Nova Kite' },
  { title: 'Glass Horizon', artist: 'Marlow' },
  { title: 'Paper Static', artist: 'Aiko Reyes' },
  { title: 'Low Tide', artist: 'Coast & Ember' },
  { title: 'Neon Orchard', artist: 'Vessel Choir' },
];

/**
 * Iterator demo: the client only ever presses "Next" — it never sees the
 * playlist array or an index. Underneath, two different iterators walk the
 * same collection: a sequential one and a shuffled one (computed once, when
 * you flip the toggle). Swapping the traversal algorithm never changes how
 * the client asks for the next element.
 */
@Component({
  selector: 'app-iterator-demo',
  imports: [IxButton, IxToggle],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Press <strong>Next</strong> to advance the cursor. The client code never changes —
        only the order the iterator hands back changes with the toggle.
      </p>

      <div class="demo__controls">
        <ix-button variant="primary" icon="arrow-right" (click)="next()">Next</ix-button>
        <ix-toggle
          [checked]="shuffled()"
          textOn="Shuffled"
          textOff="Sequential"
          (checkedChange)="setShuffled($event.detail)"
        ></ix-toggle>
      </div>

      <ol class="playlist">
        @for (song of order(); track song.title; let i = $index) {
          <li
            class="track"
            [class.track--current]="i === cursor()"
            [class.track--played]="playedOrder().includes(i) && i !== cursor()"
          >
            <span class="track__num">{{ i + 1 }}</span>
            <span class="track__info">
              <span class="track__title">{{ song.title }}</span>
              <span class="track__artist">{{ song.artist }}</span>
            </span>
            @if (i === cursor()) {
              <span class="track__playing">&#9654; playing</span>
            }
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
      .demo__controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .playlist {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .track {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.7rem 1rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        opacity: 0.6;
        transition: opacity 0.3s ease, border-color 0.3s ease, transform 0.3s ease,
          box-shadow 0.3s ease;
      }
      .track--played {
        opacity: 0.85;
      }
      .track--current {
        opacity: 1;
        border-color: var(--theme-color-primary);
        transform: translateX(4px);
        box-shadow: 0 0 16px color-mix(in srgb, var(--theme-color-primary) 35%, transparent);
      }
      .track__num {
        width: 1.6rem;
        text-align: center;
        color: var(--theme-color-soft-text);
        font-variant-numeric: tabular-nums;
      }
      .track__info {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .track__title {
        font-weight: 600;
      }
      .track__artist {
        font-size: 0.8rem;
        color: var(--theme-color-soft-text);
      }
      .track__playing {
        font-size: 0.8rem;
        color: var(--theme-color-primary);
        font-weight: 600;
      }
    `,
  ],
})
export class IteratorDemo {
  private readonly songs = PLAYLIST;

  /** The traversal order the current iterator walks — indices into `songs`. */
  readonly sequentialOrder = PLAYLIST.map((_, i) => i);
  readonly shuffledOrder = signal<number[]>(this.shuffle(this.sequentialOrder));

  readonly shuffled = signal(false);
  /** Position of the iterator's cursor within the *current* order, not the array. */
  readonly cursorPos = signal(0);
  readonly playedPositions = signal<number[]>([0]);

  /** The collection, presented in whatever order the active iterator uses. */
  readonly order = computed<Song[]>(() => {
    const indices = this.shuffled() ? this.shuffledOrder() : this.sequentialOrder;
    return indices.map((i) => this.songs[i]);
  });

  readonly cursor = computed(() => this.cursorPos());
  readonly playedOrder = computed(() => this.playedPositions());

  next(): void {
    const length = this.order().length;
    this.cursorPos.update((pos) => (pos + 1) % length);
    this.playedPositions.update((played) =>
      played.includes(this.cursorPos()) ? played : [...played, this.cursorPos()],
    );
  }

  setShuffled(on: boolean): void {
    this.shuffled.set(on);
    if (on) {
      // Recompute the shuffled traversal once, at the moment of switching.
      this.shuffledOrder.set(this.shuffle(this.sequentialOrder));
    }
    this.cursorPos.set(0);
    this.playedPositions.set([0]);
  }

  private shuffle(indices: number[]): number[] {
    const copy = [...indices];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  constructor() {
    addIcons({ iconArrowRight, iconRandom });
  }
}
