import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { IxButton, IxCard, IxCardContent, IxIcon } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconArrowLeft, iconChevronRight } from '@siemens/ix-icons/icons';
import { ContentService } from '../../core/content/content.service';

/** Lists the topics inside one category as an interactive grid of cards. */
@Component({
  selector: 'app-category-overview',
  imports: [IxButton, IxCard, IxCardContent, IxIcon],
  templateUrl: './category-overview.html',
  styleUrl: './category-overview.css',
})
export class CategoryOverview {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly categoryId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('categoryId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('categoryId') ?? '' },
  );

  readonly category = computed(() => this.content.getCategory(this.categoryId()));

  constructor() {
    addIcons({ iconArrowLeft, iconChevronRight });
  }

  openTopic(topicId: string): void {
    this.router.navigate(['/patterns', this.categoryId(), topicId]);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
