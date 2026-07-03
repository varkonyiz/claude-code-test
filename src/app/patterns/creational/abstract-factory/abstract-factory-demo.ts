import { Component, computed, signal } from '@angular/core';
import { IxButton } from '@siemens/ix-angular/standalone';

interface Kit {
  key: string;
  label: string;
  hint: string;
}

/**
 * Abstract Factory demo: pick a UI "kit" and a whole *family* of matching
 * widgets (button, toggle, card) swaps together, staying visually consistent.
 * One factory = one coherent family of products.
 */
@Component({
  selector: 'app-abstract-factory-demo',
  imports: [IxButton],
  template: `
    <div class="demo">
      <div class="demo__kits">
        <span class="demo__label">Choose a factory:</span>
        @for (kit of kits; track kit.key) {
          <ix-button
            [variant]="kit.key === activeKey() ? 'primary' : 'secondary'"
            (click)="select(kit.key)"
          >
            {{ kit.label }}
          </ix-button>
        }
      </div>

      <p class="demo__hint">{{ activeKit().hint }}</p>

      <div class="preview" [class]="'preview--' + activeKey()">
        <div class="preview__product">
          <span class="preview__caption">Button</span>
          <button class="w-button">Save</button>
        </div>
        <div class="preview__product">
          <span class="preview__caption">Toggle</span>
          <span class="w-toggle"><span class="w-toggle__knob"></span></span>
        </div>
        <div class="preview__product">
          <span class="preview__caption">Card</span>
          <div class="w-card">
            <div class="w-card__bar"></div>
            <div class="w-card__line"></div>
            <div class="w-card__line w-card__line--short"></div>
          </div>
        </div>
      </div>

      <p class="demo__note">
        Every product above is produced by the <strong>{{ activeKit().label }}</strong>
        factory — you can never accidentally mix a Material button with a Neon card.
      </p>
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .demo__kits {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .demo__label {
        font-weight: 600;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .preview {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        padding: 2rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        transition: background 0.3s ease;
      }
      .preview__product {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }
      .preview__caption {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--theme-color-soft-text);
      }
      .w-button {
        border: none;
        cursor: pointer;
        font: inherit;
        padding: 0.6rem 1.4rem;
        transition: all 0.3s ease;
      }
      .w-toggle {
        width: 52px;
        height: 28px;
        display: inline-flex;
        align-items: center;
        padding: 3px;
        transition: all 0.3s ease;
      }
      .w-toggle__knob {
        width: 22px;
        height: 22px;
        background: #fff;
        margin-left: auto;
        transition: all 0.3s ease;
      }
      .w-card {
        width: 120px;
        padding: 0.75rem;
        transition: all 0.3s ease;
      }
      .w-card__bar {
        height: 10px;
        width: 60%;
        background: currentColor;
        opacity: 0.9;
        margin-bottom: 0.6rem;
      }
      .w-card__line {
        height: 6px;
        background: currentColor;
        opacity: 0.35;
        margin-bottom: 0.4rem;
      }
      .w-card__line--short {
        width: 70%;
      }
      .demo__note {
        margin: 0;
        color: var(--theme-color-soft-text);
      }

      /* --- Material kit --- */
      .preview--material .w-button {
        background: #6750a4;
        color: #fff;
        border-radius: 999px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }
      .preview--material .w-toggle {
        background: #6750a4;
        border-radius: 999px;
      }
      .preview--material .w-toggle__knob {
        border-radius: 50%;
      }
      .preview--material .w-card {
        background: #2b2930;
        color: #d0bcff;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
      }

      /* --- Flat kit --- */
      .preview--flat .w-button {
        background: #0a84ff;
        color: #fff;
        border-radius: 4px;
      }
      .preview--flat .w-toggle {
        background: #0a84ff;
        border-radius: 4px;
      }
      .preview--flat .w-toggle__knob {
        border-radius: 2px;
      }
      .preview--flat .w-card {
        background: #1c2b3a;
        color: #7fb2ff;
        border-radius: 4px;
        border: 1px solid #0a84ff;
      }

      /* --- Neon kit --- */
      .preview--neon .w-button {
        background: transparent;
        color: #39ff14;
        border: 2px solid #39ff14;
        border-radius: 2px;
        box-shadow: 0 0 12px #39ff14;
        text-shadow: 0 0 6px #39ff14;
      }
      .preview--neon .w-toggle {
        background: transparent;
        border: 2px solid #ff2ecd;
        border-radius: 2px;
        box-shadow: 0 0 12px #ff2ecd;
      }
      .preview--neon .w-toggle__knob {
        background: #ff2ecd;
        box-shadow: 0 0 8px #ff2ecd;
      }
      .preview--neon .w-card {
        background: #0b0b16;
        color: #39ff14;
        border: 1px solid #39ff14;
        border-radius: 2px;
        box-shadow: 0 0 14px rgba(57, 255, 20, 0.5);
      }
    `,
  ],
})
export class AbstractFactoryDemo {
  readonly kits: Kit[] = [
    { key: 'material', label: 'Material', hint: 'Rounded, elevated, purple accents.' },
    { key: 'flat', label: 'Flat', hint: 'Sharp corners, crisp blue, minimal shadow.' },
    { key: 'neon', label: 'Neon', hint: 'Glowing outlines on a dark canvas.' },
  ];

  readonly activeKey = signal(this.kits[0].key);
  readonly activeKit = computed(
    () => this.kits.find((kit) => kit.key === this.activeKey()) ?? this.kits[0],
  );

  select(key: string): void {
    this.activeKey.set(key);
  }
}
