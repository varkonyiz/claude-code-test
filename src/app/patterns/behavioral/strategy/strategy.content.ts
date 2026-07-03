import { Topic } from '../../../core/content/content.model';
import { StrategyDemo } from './strategy-demo';

export const strategyTopic: Topic = {
  id: 'strategy',
  title: 'Strategy',
  tagline: 'Make algorithms interchangeable, chosen at runtime.',
  icon: 'route',
  demo: StrategyDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Define a family of algorithms, encapsulate each one behind a common interface, and make them interchangeable. Strategy lets the algorithm vary independently from the code that uses it, so swapping behavior never means editing the caller.',
    },
    {
      heading: 'Problem it solves',
      body: 'When a task can be done in several ways — different sorting algorithms, pricing rules, or validation logic — it is tempting to pack all the variants into one method with a big conditional selecting between them. That method grows every time a variant is added or tweaked, and it is hard to test or reuse a single variant in isolation.',
    },
    {
      heading: 'How it works',
      body: 'Each algorithm is wrapped in its own interchangeable unit that honors the same contract, and the client holds a reference to whichever one is currently selected. In the demo, the same "Run" button and the same row of bars work identically no matter which strategy is selected — Bubble Sort, Quick Sort, or Shuffle all plug into the same display, taking their own distinct path (bubble sort in many small swaps, quick sort in partitioning jumps, shuffle in one random pass) without the surrounding code changing at all.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when you have several related algorithms and want to pick one at runtime, or when you want to isolate the algorithm logic from the code that consumes it so each can vary and be tested independently. It is common in sorting, pricing, validation, and route-calculation code.',
    },
    {
      heading: 'Real-world analogy',
      body: 'Planning a trip, you can choose to go by car, bike, or train. The destination and the act of "travel" stay the same; only the strategy for getting there changes, and you can swap it without replanning the whole trip.',
    },
  ],
  code: [
    {
      label: 'strategy.ts',
      language: 'typescript',
      source: `interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    return arr;
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;
    const [pivot, ...rest] = data;
    const left = rest.filter((n) => n < pivot);
    const right = rest.filter((n) => n >= pivot);
    return [...this.sort(left), pivot, ...this.sort(right)];
  }
}

class Sorter {
  // The client depends only on the SortStrategy interface.
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy) { this.strategy = strategy; }
  run(data: number[]): number[] { return this.strategy.sort(data); }
}

const sorter = new Sorter(new BubbleSort());
console.log(sorter.run([5, 2, 8, 1]));   // same call...
sorter.setStrategy(new QuickSort());
console.log(sorter.run([5, 2, 8, 1]));   // ...different algorithm underneath`,
    },
  ],
};
