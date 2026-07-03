import { Topic } from '../../../core/content/content.model';
import { BuilderDemo } from './builder-demo';

export const builderTopic: Topic = {
  id: 'builder',
  title: 'Builder',
  tagline: 'Construct complex objects step by step from the same process.',
  icon: 'building-block',
  demo: BuilderDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Separate the construction of a complex object from its representation, so the same construction process can create different representations.',
    },
    {
      heading: 'Problem it solves',
      body: 'When an object needs many parts and optional configuration, a giant constructor with a dozen parameters becomes unreadable and error-prone. You want to build the object incrementally and only include the parts you actually need.',
    },
    {
      heading: 'How it works',
      body: 'A builder exposes methods to add each part, keeping the half-built product internally, and a final step returns the result. As in the demo, you add parts one by one; an optional "director" encapsulates a standard recipe so common configurations are one click away.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when creating an object involves many steps or optional parts, when you want the same steps to yield different variations, or to avoid a "telescoping constructor". Fluent builders also make call sites highly readable.',
    },
    {
      heading: 'Real-world analogy',
      body: 'Ordering a custom burger or sandwich: you (or the standard menu "recipe") choose each layer in turn. The assembly process is the same; the finished product depends on which parts you added.',
    },
  ],
  code: [
    {
      label: 'builder.ts',
      language: 'typescript',
      source: `class Burger {
  readonly parts: string[] = [];
}

class BurgerBuilder {
  private burger = new Burger();

  add(part: string): this {
    this.burger.parts.push(part);
    return this; // fluent: enables chaining
  }

  build(): Burger {
    const result = this.burger;
    this.burger = new Burger();
    return result;
  }
}

// A "director" captures a standard recipe.
function classicCheeseburger(builder: BurgerBuilder): Burger {
  return builder
    .add('bottom bun').add('patty').add('cheese')
    .add('sauce').add('lettuce').add('top bun')
    .build();
}

const burger = classicCheeseburger(new BurgerBuilder());
console.log(burger.parts.length); // 6`,
    },
  ],
};
