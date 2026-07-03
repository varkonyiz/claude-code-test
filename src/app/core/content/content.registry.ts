import { Category } from './content.model';
import { creationalCategory } from '../../patterns/creational/creational.category';
import { behavioralCategory } from '../../patterns/behavioral/behavioral.category';

/**
 * The registry of everything the app teaches. To add a new subject area (e.g.
 * SOLID principles or prompting techniques), build its `Category` under
 * `src/app/patterns/<area>/` and append it here — no other file needs to change.
 */
export const CATEGORIES: readonly Category[] = [creationalCategory, behavioralCategory];
