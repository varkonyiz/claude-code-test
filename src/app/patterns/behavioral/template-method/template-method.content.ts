import { Topic } from '../../../core/content/content.model';
import { TemplateMethodDemo } from './template-method-demo';

export const templateMethodTopic: Topic = {
  id: 'template-method',
  title: 'Template Method',
  tagline: 'Fix the skeleton of an algorithm, let specific steps vary.',
  icon: 'add-task-list',
  demo: TemplateMethodDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Define the skeleton of an algorithm as a fixed sequence of steps in a base method, deferring the implementation of a few specific steps to subclasses or configuration. The overall structure never changes; only the steps marked as overridable do.',
    },
    {
      heading: 'Problem it solves',
      body: 'Similar processes — brewing a hot drink, processing an order, generating a report — often share most of their steps but differ in one or two places. Duplicating the whole process for every variant means the shared steps drift out of sync over time, and it is easy to forget a step in one of the copies.',
    },
    {
      heading: 'How it works',
      body: 'The algorithm is written once as an ordered list of steps; most steps are identical for every variant, and a couple are hooks that get a different implementation per variant. In the demo, brewing always runs the same 4-step checklist in the same order — Boil water, Brew, Pour into cup, Add condiments — but only the two highlighted steps ("Brew" and "Add condiments") change their detail depending on whether Tea or Coffee is selected; the fixed steps stay word-for-word identical either way.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when several classes or workflows share the same overall algorithm but differ in a small number of steps, and you want to avoid duplicating the shared parts. It is common in data processing pipelines, test setup/teardown, and any "same shape, different details" workflow.',
    },
    {
      heading: 'Real-world analogy',
      body: 'Making tea or coffee follows the same ritual either way: boil water, brew, pour, add something to taste. Only the brewing step and the "something to taste" differ — the ritual itself, and its order, stays exactly the same.',
    },
  ],
  code: [
    {
      label: 'template-method.ts',
      language: 'typescript',
      source: `abstract class HotBeverage {
  // The template method: fixes the algorithm's skeleton, never overridden.
  brew(): string[] {
    const log: string[] = [];
    log.push('Boil water');
    log.push(this.addMainIngredient()); // step to override
    log.push('Pour into cup');
    log.push(this.addCondiments());     // step to override
    return log;
  }

  protected abstract addMainIngredient(): string;
  protected abstract addCondiments(): string;
}

class Tea extends HotBeverage {
  protected addMainIngredient() { return 'Steep tea bag'; }
  protected addCondiments() { return 'Add lemon'; }
}

class Coffee extends HotBeverage {
  protected addMainIngredient() { return 'Pour through coffee grounds'; }
  protected addCondiments() { return 'Add milk & sugar'; }
}

console.log(new Tea().brew());
// ['Boil water', 'Steep tea bag', 'Pour into cup', 'Add lemon']
console.log(new Coffee().brew());
// ['Boil water', 'Pour through coffee grounds', 'Pour into cup', 'Add milk & sugar']
// Same 4-step skeleton, same order — only two steps differ.`,
    },
  ],
};
