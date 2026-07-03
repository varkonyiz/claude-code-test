import { Topic } from '../../../core/content/content.model';
import { LiskovSubstitutionDemo } from './liskov-substitution-demo';

export const liskovSubstitutionTopic: Topic = {
  id: 'liskov-substitution',
  title: 'Liskov Substitution',
  tagline: 'Subtypes must be usable anywhere their base type is expected.',
  icon: 'swap-left-right',
  demo: LiskovSubstitutionDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Any subtype should be swappable for its base type without the client code noticing a difference in correctness.',
    },
    {
      heading: 'Problem it solves',
      body: 'A tempting but unsafe modeling choice — like making every bird a subtype of a Bird base class that can fly() — breaks the moment a real-world exception shows up (an Ostrich). Client code that loops over "birds" and calls fly() now crashes on a type it was told it could rely on.',
    },
    {
      heading: 'How it works',
      body: 'Model the capability, not just the category: only types that truly support an operation should expose it. As the demo shows, forcing every bird through one fly()-bearing base type breaks Ostrich at runtime; separating "can fly" from "is a bird" lets the client safely call fly() only where it is actually supported.',
    },
    {
      heading: 'When to use it',
      body: 'Apply it whenever you are tempted to override a method to do less than the base type promises, throw from an inherited method, or special-case a subtype in client code. Those are all signs the hierarchy doesn\'t reflect real substitutability.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A "vehicle" that promises `fly()` is a bad abstraction if some vehicles are cars. Rather than giving Car a fly() that throws, only Aircraft should expose flight — Car simply doesn\'t claim to.',
    },
  ],
  code: [
    {
      label: 'liskov-substitution.ts',
      language: 'typescript',
      source: `// Violates LSP: Ostrich must expose fly(), but can't honor it.
class Bird {
  fly(): string { return 'flies away'; }
}
class Ostrich extends Bird {
  fly(): string { throw new Error('cannot fly!'); } // breaks callers
}

// LSP-safe: only flying birds promise fly().
interface FlyingBird {
  fly(): string;
}
class Sparrow implements FlyingBird {
  fly() { return 'flies away'; }
}
class SafeOstrich {
  run() { return 'runs instead'; } // no broken promise
}

function releaseAll(birds: FlyingBird[]): string[] {
  return birds.map((b) => b.fly()); // never crashes — every item here can truly fly
}`,
    },
  ],
};
