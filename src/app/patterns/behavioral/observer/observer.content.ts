import { Topic } from '../../../core/content/content.model';
import { ObserverDemo } from './observer-demo';

export const observerTopic: Topic = {
  id: 'observer',
  title: 'Observer',
  tagline: 'Notify many dependents automatically when one object changes.',
  icon: 'eye',
  demo: ObserverDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Define a one-to-many dependency between objects so that when one object (the subject) changes state, all its dependents (observers) are notified and updated automatically.',
    },
    {
      heading: 'Problem it solves',
      body: 'Many parts of a system need to react when something changes — a UI, a logger, a cache. Hard-wiring the subject to call each one couples them tightly and makes adding or removing reactions painful. You want the subject to stay ignorant of who is listening.',
    },
    {
      heading: 'How it works',
      body: 'Observers subscribe to a subject. When the subject changes, it iterates its subscribers and pushes the update — it never needs to know their concrete types. In the demo, broadcasting a new reading updates only the subscribed cards; unsubscribe one and it simply stops receiving updates, with no change to the subject.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when a change to one object requires changing others and you do not know how many objects need to change, or when an object should notify others without being coupled to them. It underpins event systems, reactive UIs, and pub/sub messaging.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A newspaper subscription: the publisher does not know its readers personally. Anyone subscribed gets each new issue; cancel your subscription and the deliveries stop — the publisher carries on unaffected.',
    },
  ],
  code: [
    {
      label: 'observer.ts',
      language: 'typescript',
      source: `type Observer = (value: number) => void;

class Subject {
  private observers = new Set<Observer>();

  subscribe(observer: Observer): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer); // unsubscribe handle
  }

  notify(value: number): void {
    this.observers.forEach((observer) => observer(value));
  }
}

const station = new Subject();
const unsubscribe = station.subscribe((t) => console.log('phone:', t));
station.subscribe((t) => console.log('dashboard:', t));

station.notify(23); // phone: 23  dashboard: 23
unsubscribe();
station.notify(19); // dashboard: 19   (phone no longer listening)`,
    },
  ],
};
