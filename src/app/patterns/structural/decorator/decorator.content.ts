import { Topic } from '../../../core/content/content.model';
import { DecoratorDemo } from './decorator-demo';

export const decoratorTopic: Topic = {
  id: 'decorator',
  title: 'Decorator',
  tagline: 'Attach new responsibilities to an object by wrapping it, not subclassing it.',
  icon: 'brush',
  demo: DecoratorDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Attach additional responsibilities to an object dynamically, wrapping it in one or more decorator objects that each add behaviour while keeping the same interface as the object they wrap.',
    },
    {
      heading: 'Problem it solves',
      body: 'A coffee can have milk, sugar, whip, or any mix of them — a fixed inheritance hierarchy would need a subclass for every combination: CoffeeWithMilk, CoffeeWithMilkAndSugar, CoffeeWithEverything, and so on, growing exponentially with each new add-on. You want to combine behaviours freely, at runtime, without pre-declaring every possible mix as its own class.',
    },
    {
      heading: 'How it works',
      body: 'Each decorator wraps another object that shares the same interface, forwards to it, and adds its own bit on top — cost, description, whatever the responsibility is. In the demo, toggling Milk, Sugar, or Whip wraps or unwraps a visible ring layer around the base coffee, and the price and description update immediately to reflect exactly the stack of decorators currently applied, in any order or combination.',
    },
    {
      heading: 'When to use it',
      body: 'Reach for it when responsibilities need to be added or removed at runtime, and subclassing for every combination would be impractical or rigid. It’s a natural fit for UI components (scrollable, bordered, resizable), streams (buffered, compressed, encrypted), and priced add-ons.',
    },
    {
      heading: 'Real-world analogy',
      body: 'Dressing for winter: you start with a shirt, then optionally add a sweater, then optionally a coat — each layer wraps the one before it, adding warmth, and you can put on or take off any layer independently without changing the shirt itself.',
    },
  ],
  code: [
    {
      label: 'decorator.ts',
      language: 'typescript',
      source: `interface Beverage {
  cost(): number;
  description(): string;
}

class Coffee implements Beverage {
  cost(): number {
    return 2;
  }
  description(): string {
    return 'Coffee';
  }
}

// Each decorator wraps a Beverage and shares its interface.
abstract class AddOn implements Beverage {
  constructor(protected inner: Beverage) {}
  abstract cost(): number;
  abstract description(): string;
}

class WithMilk extends AddOn {
  cost(): number {
    return this.inner.cost() + 0.5;
  }
  description(): string {
    return \`\${this.inner.description()} + Milk\`;
  }
}

class WithSugar extends AddOn {
  cost(): number {
    return this.inner.cost() + 0.3;
  }
  description(): string {
    return \`\${this.inner.description()} + Sugar\`;
  }
}

// Layers stack in any order or combination -- no subclass per combo.
const order = new WithSugar(new WithMilk(new Coffee()));
console.log(order.description(), '$' + order.cost().toFixed(2));
// 'Coffee + Milk + Sugar $2.80'`,
    },
  ],
};
