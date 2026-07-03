import { Category } from '../../core/content/content.model';
import { singleResponsibilityTopic } from './single-responsibility/single-responsibility.content';
import { openClosedTopic } from './open-closed/open-closed.content';
import { liskovSubstitutionTopic } from './liskov-substitution/liskov-substitution.content';
import { interfaceSegregationTopic } from './interface-segregation/interface-segregation.content';
import { dependencyInversionTopic } from './dependency-inversion/dependency-inversion.content';

/** The SOLID principles — five guidelines for maintainable object-oriented design. */
export const solidCategory: Category = {
  id: 'solid',
  title: 'SOLID Principles',
  description:
    'Five guidelines for object-oriented design that keep code easy to extend and ' +
    'hard to accidentally break. Each demo below contrasts a design that violates ' +
    'the principle with one that follows it.',
  icon: 'shield-check',
  accent: '#00cc76',
  topics: [
    singleResponsibilityTopic,
    openClosedTopic,
    liskovSubstitutionTopic,
    interfaceSegregationTopic,
    dependencyInversionTopic,
  ],
};
