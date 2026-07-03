import { Topic } from '../../../core/content/content.model';
import { OpenClosedDemo } from './open-closed-demo';

export const openClosedTopic: Topic = {
  id: 'open-closed',
  title: 'Open/Closed',
  tagline: 'Open for extension, closed for modification.',
  icon: 'extension',
  demo: OpenClosedDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Design software so new behavior can be added by writing new code, not by editing code that already works.',
    },
    {
      heading: 'Problem it solves',
      body: 'A function that branches on type with a growing switch statement or if/else chain must be edited every time a new case shows up. Each edit risks breaking the cases that already worked and forces a re-review of code that had nothing to do with the new feature.',
    },
    {
      heading: 'How it works',
      body: 'Depend on an abstraction (an interface or a strategy) rather than a fixed set of concrete cases, so new cases plug in alongside the existing ones. In the demo, adding a "Loyalty" discount either means editing the core checkout function\'s switch statement (legacy) or simply adding one more strategy to a list the core function already knows how to use (open for extension) — the core function itself never changes.',
    },
    {
      heading: 'When to use it',
      body: 'Reach for it where new variants are a recurring, expected kind of change — payment methods, discount rules, export formats. It is not a mandate to abstract everything up front; add the extension point once you actually see the variation recurring.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A power strip is closed for modification (you never rewire the strip itself) but open for extension — any new appliance just plugs into an existing socket.',
    },
  ],
  code: [
    {
      label: 'open-closed.ts',
      language: 'typescript',
      source: `interface Discount {
  apply(total: number): number;
}

class SeasonalDiscount implements Discount {
  apply(total: number) { return total * 0.9; }
}
class BulkDiscount implements Discount {
  apply(total: number) { return total * 0.85; }
}

// Adding "Loyalty" is a new class, not an edit to checkout().
class LoyaltyDiscount implements Discount {
  apply(total: number) { return total * 0.8; }
}

function checkout(total: number, discounts: Discount[]): number {
  // Never needs to change when a new Discount is added.
  return discounts.reduce((sum, d) => d.apply(sum), total);
}

checkout(100, [new SeasonalDiscount(), new LoyaltyDiscount()]);`,
    },
  ],
};
