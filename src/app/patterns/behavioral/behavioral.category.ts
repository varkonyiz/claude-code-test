import { Category } from '../../core/content/content.model';
import { observerTopic } from './observer/observer.content';

/** Behavioral patterns — how objects communicate and share responsibility. */
export const behavioralCategory: Category = {
  id: 'behavioral',
  title: 'Behavioral Patterns',
  description:
    'Behavioral patterns are about communication between objects — how they ' +
    'interact, distribute responsibility, and stay loosely coupled while working ' +
    'together. Each demo below is fully interactive.',
  icon: 'connected',
  accent: '#00a0e9',
  topics: [observerTopic],
};
