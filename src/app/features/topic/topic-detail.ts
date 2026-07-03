import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { IxButton, IxIcon, IxTabItem, IxTabs } from '@siemens/ix-angular/standalone';
import { addIcons } from '@siemens/ix-icons';
import { iconArrowLeft, iconCode, iconInfo, iconRocket } from '@siemens/ix-icons/icons';
import { ContentService } from '../../core/content/content.service';
import { CodeBlock } from '../../shared/ui/code-block';

type TabKey = 'demo' | 'explain' | 'code';

/**
 * Renders a single topic: a tabbed view over the live interactive demo, the
 * explanation, and the source code. The demo component is projected via
 * `NgComponentOutlet` straight from the registry entry, so topics are entirely
 * data-driven.
 */
@Component({
  selector: 'app-topic-detail',
  imports: [NgComponentOutlet, IxButton, IxIcon, IxTabs, IxTabItem, CodeBlock],
  templateUrl: './topic-detail.html',
  styleUrl: './topic-detail.css',
})
export class TopicDetail {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly params = toSignal(
    this.route.paramMap.pipe(
      map((params) => ({
        categoryId: params.get('categoryId') ?? '',
        topicId: params.get('topicId') ?? '',
      })),
    ),
    {
      initialValue: {
        categoryId: this.route.snapshot.paramMap.get('categoryId') ?? '',
        topicId: this.route.snapshot.paramMap.get('topicId') ?? '',
      },
    },
  );

  readonly resolved = computed(() => {
    const { categoryId, topicId } = this.params();
    return this.content.getTopic(categoryId, topicId);
  });

  readonly activeTab = signal<TabKey>('demo');

  constructor() {
    addIcons({ iconArrowLeft, iconRocket, iconInfo, iconCode });
  }

  onTabChange(key: string | undefined): void {
    this.activeTab.set((key as TabKey) ?? 'demo');
  }

  backToCategory(): void {
    this.router.navigate(['/patterns', this.params().categoryId]);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
