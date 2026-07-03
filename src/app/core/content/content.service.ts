import { Injectable, signal } from '@angular/core';
import { Category, Topic } from './content.model';
import { CATEGORIES } from './content.registry';

/** Resolved (category, topic) pair returned by {@link ContentService.getTopic}. */
export interface ResolvedTopic {
  category: Category;
  topic: Topic;
}

/**
 * Single source of truth for content lookups. Pages and the nav menu read from
 * here so they stay in sync with the registry automatically.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly _categories = signal<readonly Category[]>(CATEGORIES);

  /** All registered categories, in registration order. */
  readonly categories = this._categories.asReadonly();

  getCategory(id: string): Category | undefined {
    return this._categories().find((category) => category.id === id);
  }

  getTopic(categoryId: string, topicId: string): ResolvedTopic | undefined {
    const category = this.getCategory(categoryId);
    const topic = category?.topics.find((candidate) => candidate.id === topicId);
    return category && topic ? { category, topic } : undefined;
  }
}
