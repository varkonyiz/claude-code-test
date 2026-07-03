import { Topic } from '../../../core/content/content.model';
import { DependencyInversionDemo } from './dependency-inversion-demo';

export const dependencyInversionTopic: Topic = {
  id: 'dependency-inversion',
  title: 'Dependency Inversion',
  tagline: 'Depend on abstractions, not on concrete implementations.',
  icon: 'client-interface',
  demo: DependencyInversionDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'High-level modules should not depend on low-level modules — both should depend on an abstraction, so either side can change independently.',
    },
    {
      heading: 'Problem it solves',
      body: 'When a high-level NotificationService is written directly against a concrete EmailSender, switching to SMS or push notifications means editing NotificationService itself — a class that has nothing conceptually to do with the transport mechanism.',
    },
    {
      heading: 'How it works',
      body: 'Introduce a Notifier abstraction that NotificationService depends on, and have EmailSender, SmsSender, and PushSender each implement it. As the demo shows, in the tightly-coupled version switching senders flags NotificationService\'s source as edited; once it depends on the abstraction, swapping senders is just plugging in a different implementation — the service itself stays untouched.',
    },
    {
      heading: 'When to use it',
      body: 'Apply it at the boundary between policy (what should happen) and mechanism (how it happens) — notifications, storage, payment processors. It is the principle that makes dependency injection possible and useful, not a reason to add an interface to every single class.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A wall socket is the abstraction between your lamp (high-level) and the power plant (low-level). Neither depends on the other directly — both depend on the standard socket, so you can swap the lamp or the power source independently.',
    },
  ],
  code: [
    {
      label: 'dependency-inversion.ts',
      language: 'typescript',
      source: `// Tightly coupled: high-level module depends on a concrete class.
class EmailSender { send(msg: string) { /* ... */ } }
class NotificationService {
  private sender = new EmailSender(); // hard-wired
  notify(msg: string) { this.sender.send(msg); }
}

// Inverted: both depend on an abstraction.
interface Notifier { send(msg: string): void; }
class SmsSender implements Notifier { send(msg: string) { /* ... */ } }

class FlexibleNotificationService {
  constructor(private sender: Notifier) {} // depends on the abstraction
  notify(msg: string) { this.sender.send(msg); }
}

new FlexibleNotificationService(new SmsSender()).notify('Hi!');
// Swapping senders never touches FlexibleNotificationService.`,
    },
  ],
};
