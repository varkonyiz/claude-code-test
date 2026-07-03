import { Topic } from '../../../core/content/content.model';
import { PrototypeDemo } from './prototype-demo';

export const prototypeTopic: Topic = {
  id: 'prototype',
  title: 'Prototype',
  tagline: 'Create new objects by cloning an existing one.',
  icon: 'duplicate',
  demo: PrototypeDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.',
    },
    {
      heading: 'Problem it solves',
      body: 'Sometimes constructing an object from scratch is expensive or complicated, or you only have an object (not its class) at hand. You want new instances that start identical to an existing, already-configured object — without coupling to its concrete type.',
    },
    {
      heading: 'How it works',
      body: 'The object exposes a clone operation that returns a copy of itself. Clients clone instead of calling constructors. As the demo shows, each clone is a deep, independent copy: changing a clone’s colour or energy leaves the prototype and other clones untouched.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when your code should not depend on the concrete classes of objects it copies, when instances have only a few configurations you would otherwise hard-code, or when creation is costly and cloning a ready-made instance is cheaper.',
    },
    {
      heading: 'Real-world analogy',
      body: 'Biological cell division: an existing cell copies itself to produce a new, independent cell. The copy can then mutate on its own without affecting the parent.',
    },
  ],
  code: [
    {
      label: 'prototype.ts',
      language: 'typescript',
      source: `interface Cloneable<T> {
  clone(): T;
}

class Creature implements Cloneable<Creature> {
  constructor(
    public color: string,
    public energy: number,
  ) {}

  clone(): Creature {
    // Deep, independent copy of the current state.
    return new Creature(this.color, this.energy);
  }
}

const prototype = new Creature('blue', 3);
const copy = prototype.clone();
copy.color = 'green'; // mutating the clone...

console.log(prototype.color); // 'blue' — original is untouched`,
    },
  ],
};
