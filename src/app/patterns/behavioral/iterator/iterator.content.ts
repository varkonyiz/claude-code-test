import { Topic } from '../../../core/content/content.model';
import { IteratorDemo } from './iterator-demo';

export const iteratorTopic: Topic = {
  id: 'iterator',
  title: 'Iterator',
  tagline: 'Step through a collection without exposing how it is stored.',
  icon: 'list',
  demo: IteratorDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.',
    },
    {
      heading: 'Problem it solves',
      body: 'A client that walks a collection often ends up depending on how it is stored — an array index here, a linked list pointer there. That coupling makes it hard to change the storage later or to support more than one way of traversing the same data. You want "give me the next item" to be the whole contract, regardless of what is underneath or in what order it walks.',
    },
    {
      heading: 'How it works',
      body: 'An iterator object holds its own position and exposes a simple next-style operation; the client repeatedly calls it without ever touching the collection directly. In the demo, pressing "Next" always does the same thing from the client\'s point of view, but the toggle swaps which iterator is behind it: a sequential one that walks the playlist in order, or a shuffled one whose order is computed once when you switch to it. The list re-renders in the new order and the cursor keeps walking — the calling code never had to change.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when you want to traverse a collection without exposing its internals, when you need multiple simultaneous traversals of the same collection, or when you want to support several traversal algorithms (sequential, shuffled, filtered) interchangeably behind one interface.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A music player\'s "next track" button: you press the same button whether the player is going in playlist order or shuffle. The button does not know or care how the next song is chosen — it just asks the player for it.',
    },
  ],
  code: [
    {
      label: 'iterator.ts',
      language: 'typescript',
      source: `interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}

class ArrayIterator<T> implements Iterator<T> {
  private index = 0;
  constructor(private items: T[]) {}

  hasNext(): boolean {
    return this.index < this.items.length;
  }

  next(): T {
    return this.items[this.index++];
  }
}

class ShuffledIterator<T> implements Iterator<T> {
  private order: number[];
  private pos = 0;
  constructor(private items: T[]) {
    this.order = items.map((_, i) => i).sort(() => Math.random() - 0.5);
  }

  hasNext(): boolean {
    return this.pos < this.order.length;
  }

  next(): T {
    return this.items[this.order[this.pos++]];
  }
}

// The client only ever calls hasNext() / next() — it never knows which
// traversal strategy is behind the interface.
function play<T>(iterator: Iterator<T>): void {
  while (iterator.hasNext()) {
    console.log(iterator.next());
  }
}

play(new ArrayIterator(['a', 'b', 'c']));
play(new ShuffledIterator(['a', 'b', 'c']));`,
    },
  ],
};
