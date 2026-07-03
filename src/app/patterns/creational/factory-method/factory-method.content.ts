import { Topic } from '../../../core/content/content.model';
import { FactoryMethodDemo } from './factory-method-demo';

export const factoryMethodTopic: Topic = {
  id: 'factory-method',
  title: 'Factory Method',
  tagline: 'Let subclasses decide which concrete product gets created.',
  icon: 'cogwheel',
  demo: FactoryMethodDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Define an interface for creating an object, but let subclasses (or configuration) decide which class to instantiate. The factory method defers instantiation to a dedicated overridable step.',
    },
    {
      heading: 'Problem it solves',
      body: 'Your code needs to create objects, but you do not want it hard-wired to specific concrete classes with "new". That coupling makes it painful to introduce new variants. You want to add a new product type without editing the code that uses products.',
    },
    {
      heading: 'How it works',
      body: 'A creator class declares a factory method that returns a product interface. Each concrete creator overrides it to return a specific product. The client calls the factory method and works only against the interface — as you saw in the demo, the same createTransport() call produces a truck, ship, or plane depending on the creator.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when a class cannot anticipate the exact type of objects it must create, or when you want to let subclasses/config choose. It shines when adding new variants should not require touching existing client code (Open/Closed Principle).',
    },
    {
      heading: 'Real-world analogy',
      body: 'A logistics company plans routes the same way regardless of vehicle. The "create vehicle" step is what differs: a road division builds trucks, a sea division builds ships — the planning process stays identical.',
    },
  ],
  code: [
    {
      label: 'factory-method.ts',
      language: 'typescript',
      source: `interface Transport {
  deliver(): string;
}

class Truck implements Transport {
  deliver() { return 'delivering by road'; }
}
class Ship implements Transport {
  deliver() { return 'delivering by sea'; }
}

abstract class Logistics {
  // The factory method — subclasses decide the concrete product.
  abstract createTransport(): Transport;

  planDelivery(): string {
    const transport = this.createTransport();
    return transport.deliver();
  }
}

class RoadLogistics extends Logistics {
  createTransport() { return new Truck(); }
}
class SeaLogistics extends Logistics {
  createTransport() { return new Ship(); }
}

console.log(new RoadLogistics().planDelivery()); // delivering by road`,
    },
  ],
};
