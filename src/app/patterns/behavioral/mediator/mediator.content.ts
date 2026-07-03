import { Topic } from '../../../core/content/content.model';
import { MediatorDemo } from './mediator-demo';

export const mediatorTopic: Topic = {
  id: 'mediator',
  title: 'Mediator',
  tagline: 'Route communication through one hub instead of wiring objects to each other.',
  icon: 'share',
  demo: MediatorDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Define an object that encapsulates how a set of objects interact, so those objects (colleagues) do not refer to each other explicitly, and their interaction can vary independently.',
    },
    {
      heading: 'Problem it solves',
      body: 'When every object needs to know about and call several others directly, the number of connections grows out of control — adding one more participant means wiring it to everyone it might talk to. You want colleagues to stay simple and only know about a single shared mediator, which owns the actual routing logic.',
    },
    {
      heading: 'How it works',
      body: 'Each colleague only ever talks to the mediator, never to another colleague directly. The mediator receives an action from one colleague and decides who else should hear about it. In the demo, sending a quick message from Alice, Bob or Carol\'s panel never reaches another panel directly — it pulses the central mediator hub first, and the hub is the one that appends the message into the other two colleagues\' logs, leaving the sender\'s own log untouched.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when a group of objects communicate in well-defined but complex ways and the web of direct references is becoming hard to follow, or when you want to reuse a colleague independently of the others it currently talks to. It shows up in UI widget coordination, chat and notification hubs, and air-traffic-control-style coordination logic.',
    },
    {
      heading: 'Real-world analogy',
      body: 'An air traffic control tower: pilots never negotiate directly with each other about who lands first. Every pilot talks only to the tower, and the tower decides how to relay instructions between them.',
    },
  ],
  code: [
    {
      label: 'mediator.ts',
      language: 'typescript',
      source: `interface Mediator {
  send(message: string, from: Colleague): void;
}

class ChatRoom implements Mediator {
  private members: Colleague[] = [];

  register(member: Colleague): void {
    this.members.push(member);
  }

  send(message: string, from: Colleague): void {
    // Route to everyone except the sender — colleagues never call each other.
    for (const member of this.members) {
      if (member !== from) member.receive(message, from.name);
    }
  }
}

class Colleague {
  constructor(public name: string, private mediator: Mediator) {}

  send(message: string): void {
    this.mediator.send(message, this);
  }

  receive(message: string, from: string): void {
    console.log(\`\${this.name} got from \${from}: \${message}\`);
  }
}

const room = new ChatRoom();
const alice = new Colleague('Alice', room);
const bob = new Colleague('Bob', room);
room.register(alice);
room.register(bob);

alice.send('Standup in 5!'); // Bob receives it; Alice does not receive her own message`,
    },
  ],
};
