import { Topic } from '../../../core/content/content.model';
import { BridgeDemo } from './bridge-demo';

export const bridgeTopic: Topic = {
  id: 'bridge',
  title: 'Bridge',
  tagline: 'Split an abstraction from its implementation so both can vary independently.',
  icon: 'link',
  demo: BridgeDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Decouple an abstraction from its implementation so the two can evolve, extend, and combine independently, instead of being locked together in one class hierarchy.',
    },
    {
      heading: 'Problem it solves',
      body: 'When an abstraction (say, a Remote) and something it controls (a Device) each have their own variations, naively subclassing every combination explodes: BasicRemote, AdvancedRemote, BasicRemoteForTv, AdvancedRemoteForRadio, and so on. Adding one more remote type or one more device type multiplies the subclasses again. You want to add either side without touching the other.',
    },
    {
      heading: 'How it works',
      body: 'The abstraction holds a reference to an implementation interface rather than inheriting from a concrete implementation, and delegates the actual work through it. In the demo, the Remote (abstraction) and the Device (implementation) are chosen independently — Basic or Advanced remote, TV or Radio device — and pressing power always produces the right result for whichever pair is active, using only two remote classes and two device classes to cover all four combinations.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when you have an abstraction with multiple variants and multiple ways to implement it, and you want to avoid a permanent binding between the two at compile time. It’s especially valuable when both hierarchies are expected to grow independently over time.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A universal remote control (the abstraction) works with many brands of TV (the implementations) because it talks to any of them through the same underlying signal protocol — you don’t need a different remote model for every TV brand it supports.',
    },
  ],
  code: [
    {
      label: 'bridge.ts',
      language: 'typescript',
      source: `// Implementation hierarchy: how a command actually reaches a device.
interface Device {
  turnOn(): string;
}

class Tv implements Device {
  turnOn(): string {
    return 'TV powers on to channel 1';
  }
}

class Radio implements Device {
  turnOn(): string {
    return 'Radio powers on, tunes to FM';
  }
}

// Abstraction hierarchy: holds a Device rather than inheriting from one.
class Remote {
  constructor(protected device: Device) {}

  pressPower(): string {
    return \`Remote -> \${this.device.turnOn()}\`;
  }
}

class AdvancedRemote extends Remote {
  override pressPower(): string {
    return \`Advanced \${super.pressPower()} (favourites recalled)\`;
  }
}

// Any remote works with any device -- 2 + 2 classes cover all 4 pairings.
console.log(new Remote(new Radio()).pressPower());
console.log(new AdvancedRemote(new Tv()).pressPower());`,
    },
  ],
};
