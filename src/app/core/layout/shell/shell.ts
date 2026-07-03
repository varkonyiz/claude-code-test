import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  IxApplication,
  IxApplicationHeader,
  IxContent,
  IxMenu,
  IxMenuItem,
} from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconHome, iconLayers } from '@siemens/ix-icons/icons';
import { ContentService } from '../../content/content.service';

/**
 * The persistent application frame: iX header + a navigation menu generated from
 * the content registry, with the routed page rendered inside `ix-content`.
 */
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    IxApplication,
    IxApplicationHeader,
    IxMenu,
    IxMenuItem,
    IxContent,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  readonly categories = this.content.categories;

  /** Current URL as a signal so menu items can reflect the active route. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    addIcons({ iconHome, iconLayers });
  }

  isHome(): boolean {
    return this.url() === '/' || this.url() === '';
  }

  isCategoryActive(categoryId: string): boolean {
    return this.url().startsWith(`/patterns/${categoryId}`);
  }

  go(commands: unknown[]): void {
    this.router.navigate(commands);
  }
}
