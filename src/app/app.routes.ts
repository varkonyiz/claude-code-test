import { Routes } from '@angular/router';

/**
 * Registry-driven routing: category and topic pages resolve their content from
 * `ContentService` using the URL params, so new content needs no new routes.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'patterns/:categoryId',
    loadComponent: () =>
      import('./features/category/category-overview').then((m) => m.CategoryOverview),
  },
  {
    path: 'patterns/:categoryId/:topicId',
    loadComponent: () => import('./features/topic/topic-detail').then((m) => m.TopicDetail),
  },
  { path: '**', redirectTo: '' },
];
