import { Topic } from '../../../core/content/content.model';
import { FacadeDemo } from './facade-demo';

export const facadeTopic: Topic = {
  id: 'facade',
  title: 'Facade',
  tagline: 'One simple button that hides a whole subsystem of steps.',
  icon: 'frames',
  demo: FacadeDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Provide a single, simplified interface to a larger body of code — a set of subsystems with their own APIs and ordering rules — so callers do not need to understand or coordinate the parts themselves.',
    },
    {
      heading: 'Problem it solves',
      body: 'A complex subsystem often requires several components to be operated in a precise sequence: power one thing on before another, configure this before that. Making every caller learn and repeat that sequence is repetitive and error-prone — miss a step or get the order wrong and things break.',
    },
    {
      heading: 'How it works',
      body: 'The facade sits in front of the subsystem and exposes one or two intention-revealing methods, internally calling the subsystem parts in the right order. In the demo, the Amplifier, Projector and Screen can each be flipped manually, but the "Watch Movie" facade button runs all three steps for you, animated in the correct sequence, so the caller never has to think about ordering.',
    },
    {
      heading: 'When to use it',
      body: 'Reach for a facade when client code needs a simple entry point into a complicated or evolving subsystem, when you want to decouple client code from subsystem internals, or when you want to layer a system by giving each layer one clean entry point. It does not stop anyone reaching the subsystem directly when they truly need finer control.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A universal remote\'s "Movie Mode" button: behind the scenes it dims the lights, lowers the screen, and switches on the projector and amplifier in the right order, but you only ever press one button.',
    },
  ],
  code: [
    {
      label: 'facade.ts',
      language: 'typescript',
      source: `class Amplifier {
  powerOn() { console.log('Amplifier: on'); }
}
class Projector {
  powerOn() { console.log('Projector: on'); }
}
class Screen {
  lower() { console.log('Screen: lowered'); }
}

// The facade hides the subsystem and its required ordering.
class HomeTheaterFacade {
  constructor(
    private screen: Screen,
    private projector: Projector,
    private amp: Amplifier,
  ) {}

  watchMovie(): void {
    this.screen.lower();     // must happen first
    this.projector.powerOn();
    this.amp.powerOn();      // must happen last
  }
}

const theater = new HomeTheaterFacade(new Screen(), new Projector(), new Amplifier());
theater.watchMovie(); // one call instead of three, in the right order`,
    },
  ],
};
