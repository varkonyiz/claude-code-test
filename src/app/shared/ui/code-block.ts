import { Component, computed, input, signal } from '@angular/core';
import hljs from 'highlight.js';
import { IxIconButton } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconCheck, iconCopy } from '@siemens/ix-icons/icons';

/**
 * Read-only, syntax-highlighted code sample with a copy button. Highlighting is
 * done with highlight.js; the `github-dark` theme is imported globally in
 * `styles.css` so the injected `hljs-*` spans are styled.
 */
@Component({
  selector: 'app-code-block',
  imports: [IxIconButton],
  templateUrl: './code-block.html',
  styleUrl: './code-block.css',
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly language = input<string>('typescript');
  readonly label = input<string>('');

  protected readonly copied = signal(false);

  protected readonly highlighted = computed(() => {
    const source = this.code();
    const language = this.language();
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(source, { language }).value;
    }
    return hljs.highlightAuto(source).value;
  });

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context); ignore silently.
    }
  }

  constructor() {
    addIcons({ iconCopy, iconCheck });
  }
}
