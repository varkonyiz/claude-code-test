import { Topic } from '../../../core/content/content.model';
import { CommandDemo } from './command-demo';

export const commandTopic: Topic = {
  id: 'command',
  title: 'Command',
  tagline: 'Turn a request into an object, so it can be queued, logged, or undone.',
  icon: 'play',
  demo: CommandDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Encapsulate a request as a self-contained object that carries both an action and everything needed to perform (and reverse) it, decoupling the object that invokes an operation from the object that knows how to perform it.',
    },
    {
      heading: 'Problem it solves',
      body: 'A button or menu item often needs to trigger very different actions, and later needs to support undo, logging, or replay. If the invoker calls the receiver directly, it has to know the receiver\'s API and has nowhere to record what happened or how to reverse it.',
    },
    {
      heading: 'How it works',
      body: 'Each user action is wrapped in a command object exposing a uniform "execute" (and its inverse); the invoker only ever calls execute and pushes the command onto a history stack. In the demo, pressing Light On/Off or Fan On/Off calls a generic remote-control invoker that runs the command and records it; pressing Undo pops the last command off the stack and runs its stored inverse, reverting only that one change without the invoker knowing anything about lights or fans.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when you need to parameterize objects with an action to perform, queue or log requests, or support undo/redo. It is the mechanism behind menu actions, macro recording, and transactional operations.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A restaurant order slip: the waiter (invoker) does not cook — they just hand a written order (the command) to the kitchen (receiver). The same waiter can carry completely different orders, and a cancelled order can be pulled back out of the queue before it is made.',
    },
  ],
  code: [
    {
      label: 'command.ts',
      language: 'typescript',
      source: `interface Command {
  label: string;
  execute(): void;
  undo(): void;
}

class Light {
  on = false;
}

class LightOnCommand implements Command {
  label = 'Light On';
  constructor(private light: Light) {}
  execute() { this.light.on = true; }
  undo() { this.light.on = false; }
}

// The invoker knows nothing about Light — only the Command interface.
class RemoteControl {
  private history: Command[] = [];

  press(command: Command): void {
    command.execute();
    this.history.push(command); // record for undo
  }

  undoLast(): void {
    const command = this.history.pop();
    command?.undo();
  }
}

const light = new Light();
const remote = new RemoteControl();
remote.press(new LightOnCommand(light));
console.log(light.on); // true
remote.undoLast();
console.log(light.on); // false — reverted without the remote knowing how`,
    },
  ],
};
