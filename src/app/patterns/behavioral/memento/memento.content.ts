import { Topic } from '../../../core/content/content.model';
import { MementoDemo } from './memento-demo';

export const mementoTopic: Topic = {
  id: 'memento',
  title: 'Memento',
  tagline: 'Snapshot an object’s state so you can roll back to it later.',
  icon: 'history',
  demo: MementoDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Without violating encapsulation, capture and externalize an object’s internal state so that the object can be restored to this state later.',
    },
    {
      heading: 'Problem it solves',
      body: 'Undo, checkpoints, and rollback all need a way to remember a past state and return to it. Doing that naively usually means exposing an object’s private fields to whatever is keeping the history, which breaks encapsulation. You want the history-keeper to hold snapshots it can pass back for restoration, without needing to understand or reach into their contents.',
    },
    {
      heading: 'How it works',
      body: 'The originator (the object with state) knows how to produce a memento of itself and how to restore from one; the caretaker just stores mementos in order without looking inside them. In the demo, "Save checkpoint" asks the editor for a snapshot of its current text and appends it, labelled and numbered, to a visible history list. Pressing "Restore" on any entry — not only the latest one — hands that snapshot back to the editor, which resets its text to exactly what was saved, demonstrating rollback to any earlier point.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when you need to save and restore an object’s state without exposing its implementation details, such as for undo/redo stacks, transactional edits, save points in a game, or form drafts a user can revert to.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A video game’s save slots: the game writes a save file capturing everything needed to resume, and you can load any slot later to return exactly to that moment — without the save system needing to understand the game’s internal logic.',
    },
  ],
  code: [
    {
      label: 'memento.ts',
      language: 'typescript',
      source: `class EditorMemento {
  // Read-only snapshot; the caretaker cannot mutate it.
  constructor(private readonly text: string) {}
  getText(): string {
    return this.text;
  }
}

class Editor {
  private text = '';

  type(words: string): void {
    this.text += words;
  }

  save(): EditorMemento {
    return new EditorMemento(this.text);
  }

  restore(memento: EditorMemento): void {
    this.text = memento.getText();
  }

  getText(): string {
    return this.text;
  }
}

class History {
  private checkpoints: EditorMemento[] = [];

  push(memento: EditorMemento): void {
    this.checkpoints.push(memento);
  }

  get(index: number): EditorMemento {
    return this.checkpoints[index]; // caretaker never inspects the contents
  }
}

const editor = new Editor();
const history = new History();

editor.type('Once upon a time...');
history.push(editor.save()); // checkpoint #0

editor.type(' The end.');
history.push(editor.save()); // checkpoint #1

editor.restore(history.get(0)); // roll back to checkpoint #0, not just one step
console.log(editor.getText()); // 'Once upon a time...'`,
    },
  ],
};
