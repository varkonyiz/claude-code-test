import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IxButton, IxCard, IxCardContent, IxIcon } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconArrowRight, iconBulb, iconChevronRight } from '@siemens/ix-icons/icons';
import { ContentService } from '../../core/content/content.service';
import { AUTHOR } from './author';

/** Landing page: explains the app's goal, introduces the author, and links out. */
@Component({
  selector: 'app-landing',
  imports: [IxButton, IxCard, IxCardContent, IxIcon],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  readonly author = AUTHOR;
  readonly categories = this.content.categories;
  readonly initials = AUTHOR.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  constructor() {
    addIcons({ iconBulb, iconArrowRight, iconChevronRight });
  }

  openCategory(categoryId: string): void {
    this.router.navigate(['/patterns', categoryId]);
  }

  startLearning(): void {
    const first = this.categories()[0];
    if (first) {
      this.openCategory(first.id);
    }
  }

  openLinkedIn(): void {
    window.open(this.author.linkedInUrl, '_blank', 'noopener');
  }
}
