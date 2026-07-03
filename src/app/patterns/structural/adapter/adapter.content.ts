import { Topic } from '../../../core/content/content.model';
import { AdapterDemo } from './adapter-demo';

export const adapterTopic: Topic = {
  id: 'adapter',
  title: 'Adapter',
  tagline: 'Wrap an incompatible interface so it fits the one the client expects.',
  icon: 'connector',
  demo: AdapterDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Convert the interface of a class into another interface clients expect, letting classes work together that couldn’t otherwise because of incompatible interfaces.',
    },
    {
      heading: 'Problem it solves',
      body: 'You often want to reuse an existing class — a legacy library, a third-party SDK — but its methods don’t match the shape your code already calls against. Rewriting either side is wasteful or impossible when the legacy code isn’t yours to change. You need a small go-between that translates one interface into the other without touching either.',
    },
    {
      heading: 'How it works',
      body: 'An Adapter class implements the interface the client already expects, and internally holds a reference to the incompatible object, translating each call into whatever that object actually understands. In the demo, the client plug is round and the legacy device’s socket is square; connecting them directly clashes. Switch the adapter on and it visibly sits between the two, translating play() into spinVinyl(), and the connection succeeds.',
    },
    {
      heading: 'When to use it',
      body: 'Reach for it when you want to use an existing class but its interface doesn’t match what your code requires, especially when you can’t or shouldn’t modify that class’s source. It’s ideal for integrating legacy code or third-party libraries behind a clean interface your application controls.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A travel power plug adapter doesn’t change your laptop charger or the wall socket — it just sits between a round pin and a flat pin so the two, otherwise incompatible, fit together.',
    },
  ],
  code: [
    {
      label: 'adapter.ts',
      language: 'typescript',
      source: `interface MediaPlayer {
  play(): string;
}

// Legacy class with an incompatible interface we can't change.
class VinylPlayer {
  spinVinyl(): string {
    return 'spinning the vinyl record';
  }
}

// Adapter makes VinylPlayer satisfy the MediaPlayer interface.
class VinylPlayerAdapter implements MediaPlayer {
  constructor(private readonly legacy: VinylPlayer) {}

  play(): string {
    return this.legacy.spinVinyl();
  }
}

function startPlayback(player: MediaPlayer): void {
  console.log(player.play());
}

startPlayback(new VinylPlayerAdapter(new VinylPlayer()));
// 'spinning the vinyl record' -- old device, new interface`,
    },
  ],
};
