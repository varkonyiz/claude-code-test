import { Topic } from '../../../core/content/content.model';
import { ChainOfResponsibilityDemo } from './chain-of-responsibility-demo';

export const chainOfResponsibilityTopic: Topic = {
  id: 'chain-of-responsibility',
  title: 'Chain of Responsibility',
  tagline: 'Pass a request along a line of handlers until one deals with it.',
  icon: 'route-target',
  demo: ChainOfResponsibilityDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Avoid coupling the sender of a request to a single receiver by giving more than one handler a chance to handle it: chain the receiving objects and pass the request along until one of them handles it.',
    },
    {
      heading: 'Problem it solves',
      body: 'Often the right handler for a request depends on runtime conditions the sender should not need to know about — how severe an issue is, how much authority is needed. Hard-coding "if severity is X call handler Y" in the sender couples it to every handler and every rule.',
    },
    {
      heading: 'How it works',
      body: 'Each handler holds a reference to the next handler and decides independently whether it can deal with the request; if not, it forwards it along the chain. The demo submits a ticket at a chosen severity and animates it stepping through Level 1 Support, Level 2 Support and Manager one node at a time, lighting up and stopping at the first handler whose threshold covers that severity — Low stops immediately, High travels the whole chain.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when more than one object may handle a request and the handler is not known in advance, when you want to issue a request without specifying the receiver explicitly, or when the set of handlers and their order should be configurable independently of the sender.',
    },
    {
      heading: 'Real-world analogy',
      body: 'Escalating a support ticket: a front-line agent resolves what they can, and only passes trickier issues up to a specialist, who in turn escalates to a manager if needed. The customer never has to know who ends up handling it.',
    },
  ],
  code: [
    {
      label: 'chain-of-responsibility.ts',
      language: 'typescript',
      source: `type Severity = 'low' | 'medium' | 'high';

abstract class SupportHandler {
  protected next: SupportHandler | null = null;

  setNext(handler: SupportHandler): SupportHandler {
    this.next = handler;
    return handler; // enables chaining: a.setNext(b).setNext(c)
  }

  handle(severity: Severity): void {
    if (this.canHandle(severity)) {
      console.log(\`\${this.constructor.name} resolved a \${severity} ticket\`);
    } else if (this.next) {
      this.next.handle(severity); // pass along the chain
    } else {
      console.log('No handler could resolve this ticket');
    }
  }

  protected abstract canHandle(severity: Severity): boolean;
}

class Level1Support extends SupportHandler {
  protected canHandle(s: Severity) { return s === 'low'; }
}
class Level2Support extends SupportHandler {
  protected canHandle(s: Severity) { return s === 'medium'; }
}
class Manager extends SupportHandler {
  protected canHandle(s: Severity) { return s === 'high'; }
}

const level1 = new Level1Support();
level1.setNext(new Level2Support()).setNext(new Manager());

level1.handle('low');    // Level1Support resolved a low ticket
level1.handle('high');   // passes through Level1 and Level2 -> Manager resolved a high ticket`,
    },
  ],
};
