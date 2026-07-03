import { Component, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconHistory, iconSaveAll } from '@siemens/ix-icons/icons';

/** A memento: an opaque snapshot of the editor's state at a point in time. */
interface Checkpoint {
  id: number;
  label: string;
  text: string;
}

/**
 * Memento demo: the editor's current text is the "originator" state. Saving a
 * checkpoint captures that state into an opaque, labelled snapshot pushed onto
 * a visible history — without the history needing to know anything about how
 * the text is structured. Restoring any past checkpoint rolls the editor back
 * to exactly that snapshot, not just one step back.
 */
@Component({
  selector: 'app-memento-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Edit the text, save checkpoints as you go, then restore any earlier one — not just
        the last one.
      </p>

      <div class="editor">
        <textarea
          class="editor__input"
          rows="3"
          [value]="text()"
          (input)="onInput($event)"
          [class.editor__input--flash]="flash()"
        ></textarea>
        <ix-button variant="primary" icon="save-all" (click)="save()">Save checkpoint</ix-button>
      </div>

      <div class="history">
        <span class="history__title">History</span>
        @for (checkpoint of checkpoints(); track checkpoint.id) {
          <div class="checkpoint" [class.checkpoint--current]="checkpoint.id === lastRestoredId()">
            <span class="checkpoint__num">#{{ checkpoint.id }}</span>
            <span class="checkpoint__text">{{ checkpoint.text || '(empty)' }}</span>
            <ix-button variant="secondary" icon="history" (click)="restore(checkpoint)">
              Restore
            </ix-button>
          </div>
        } @empty {
          <div class="history__empty">No checkpoints yet — save one to start a history.</div>
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
      .editor {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .editor__input {
        resize: vertical;
        font-family: inherit;
        font-size: 0.95rem;
        padding: 0.6rem 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-1);
        color: var(--theme-color-std-text);
        transition: box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .editor__input--flash {
        border-color: var(--theme-color-success);
        box-shadow: 0 0 14px color-mix(in srgb, var(--theme-color-success) 45%, transparent);
      }
      .history {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .history__title {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--theme-color-soft-text);
      }
      .history__empty {
        color: var(--theme-color-soft-text);
      }
      .checkpoint {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 0.85rem;
        border-radius: 10px;
        border: 1px solid var(--theme-color-soft-bdr);
        background: var(--theme-color-2);
        animation: slideIn 0.3s ease;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .checkpoint--current {
        border-color: var(--theme-color-primary);
        box-shadow: 0 0 12px color-mix(in srgb, var(--theme-color-primary) 35%, transparent);
      }
      .checkpoint__num {
        font-weight: 700;
        color: var(--theme-color-soft-text);
        min-width: 2.2rem;
      }
      .checkpoint__text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--theme-color-std-text);
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class MementoDemo {
  readonly text = signal('Once upon a time...');
  readonly checkpoints = signal<Checkpoint[]>([]);
  readonly flash = signal(false);
  readonly lastRestoredId = signal<number | null>(null);
  private nextId = 1;

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.text.set(value);
    this.lastRestoredId.set(null);
  }

  /** Capture the current state as an opaque memento, pushed onto the history. */
  save(): void {
    const checkpoint: Checkpoint = {
      id: this.nextId++,
      label: `Checkpoint ${this.nextId - 1}`,
      text: this.text(),
    };
    this.checkpoints.update((list) => [...list, checkpoint]);
    this.pulseFlash();
  }

  /** Roll the editor back to any past snapshot — not just the most recent one. */
  restore(checkpoint: Checkpoint): void {
    this.text.set(checkpoint.text);
    this.lastRestoredId.set(checkpoint.id);
    this.pulseFlash();
  }

  private pulseFlash(): void {
    this.flash.set(true);
    setTimeout(() => this.flash.set(false), 400);
  }

  constructor() {
    addIcons({ iconHistory, iconSaveAll });
  }
}
