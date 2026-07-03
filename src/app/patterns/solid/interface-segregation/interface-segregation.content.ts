import { Topic } from '../../../core/content/content.model';
import { InterfaceSegregationDemo } from './interface-segregation-demo';

export const interfaceSegregationTopic: Topic = {
  id: 'interface-segregation',
  title: 'Interface Segregation',
  tagline: "Don't force a class to depend on methods it doesn't use.",
  icon: 'split',
  demo: InterfaceSegregationDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Prefer several small, specific interfaces over one large, general-purpose one, so implementers only take on the methods that actually apply to them.',
    },
    {
      heading: 'Problem it solves',
      body: 'A single "fat" interface — Worker with work(), eat(), and sleep() — forces every implementer to provide all three, even ones like Robot that only make sense for one of them. The unused methods either throw, return nothing meaningful, or quietly lie about what the object can do.',
    },
    {
      heading: 'How it works',
      body: 'Split the fat interface into focused ones — Workable, Eatable, Sleepable — and implement only the ones that fit. As the demo shows, calling eat() or sleep() on a Robot forced through the fat interface throws; once Robot only implements Workable, there is nothing broken left to call in the first place.',
    },
    {
      heading: 'When to use it',
      body: 'Watch for implementers with methods that throw "not supported" or sit empty — that is the fat-interface smell. Segregate when different clients only care about different subsets of an interface\'s methods.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A universal remote with 200 buttons for every possible device is worse than three simple remotes — one for the TV, one for the AC, one for the speaker. Each device only needs to "implement" the buttons it actually has functions for.',
    },
  ],
  code: [
    {
      label: 'interface-segregation.ts',
      language: 'typescript',
      source: `// Fat interface forces Robot to fake eat/sleep.
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}
class Robot implements Worker {
  work() { /* ... */ }
  eat() { throw new Error('Robot does not eat'); }   // forced, unused
  sleep() { throw new Error('Robot does not sleep'); } // forced, unused
}

// Segregated: Robot only implements what applies to it.
interface Workable { work(): void; }
interface Eatable { eat(): void; }
interface Sleepable { sleep(): void; }

class SafeRobot implements Workable {
  work() { /* ... */ }
}
class Human implements Workable, Eatable, Sleepable {
  work() { /* ... */ }
  eat() { /* ... */ }
  sleep() { /* ... */ }
}`,
    },
  ],
};
