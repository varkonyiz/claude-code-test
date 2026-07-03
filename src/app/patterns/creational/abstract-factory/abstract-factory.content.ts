import { Topic } from '../../../core/content/content.model';
import { AbstractFactoryDemo } from './abstract-factory-demo';

export const abstractFactoryTopic: Topic = {
  id: 'abstract-factory',
  title: 'Abstract Factory',
  tagline: 'Create whole families of related objects that always match.',
  icon: 'apps',
  demo: AbstractFactoryDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.',
    },
    {
      heading: 'Problem it solves',
      body: 'Sometimes objects must be used together as a coherent set — a button, a toggle and a card that all share one visual language. If code picks each piece independently, you can end up mixing incompatible parts. You need a way to produce a matching family in one decision.',
    },
    {
      heading: 'How it works',
      body: 'An abstract factory declares a creation method per product in the family. Each concrete factory produces a matching set. Client code picks one factory and asks it for products — as in the demo, choosing the "Neon" factory guarantees a neon button AND a neon card, never a mismatched pair.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when your system must be independent of how its products are created, and when products come in families that must be used together. Common cases: cross-platform UI toolkits, swappable database/driver suites, themeable design systems.',
    },
    {
      heading: 'Real-world analogy',
      body: 'Flat-pack furniture "collections": pick the Nordic collection and every piece — chair, table, shelf — shares the same wood, finish and hardware. You cannot get a Nordic chair with Industrial-collection legs.',
    },
  ],
  code: [
    {
      label: 'abstract-factory.ts',
      language: 'typescript',
      source: `interface Button { render(): string; }
interface Card { render(): string; }

// Abstract factory: one method per product in the family.
interface UIFactory {
  createButton(): Button;
  createCard(): Card;
}

class NeonFactory implements UIFactory {
  createButton() { return { render: () => 'neon button' }; }
  createCard() { return { render: () => 'neon card' }; }
}
class FlatFactory implements UIFactory {
  createButton() { return { render: () => 'flat button' }; }
  createCard() { return { render: () => 'flat card' }; }
}

function buildUI(factory: UIFactory) {
  // Client depends only on the interfaces — the family always matches.
  return [factory.createButton().render(), factory.createCard().render()];
}

console.log(buildUI(new NeonFactory())); // ['neon button', 'neon card']`,
    },
  ],
};
