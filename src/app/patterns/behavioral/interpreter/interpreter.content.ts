import { Topic } from '../../../core/content/content.model';
import { InterpreterDemo } from './interpreter-demo';

export const interpreterTopic: Topic = {
  id: 'interpreter',
  title: 'Interpreter',
  tagline: 'Represent a grammar and interpret sentences in it, one piece at a time.',
  icon: 'language',
  demo: InterpreterDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Given a language, define a representation for its grammar along with an interpreter that uses the representation to evaluate sentences in that language.',
    },
    {
      heading: 'Problem it solves',
      body: 'When you have a small, well-defined language — a search filter, a rule set, a simple arithmetic expression — writing one big parsing-and-evaluating function quickly becomes a tangle of special cases. You want each grammar rule to be its own reusable, composable piece, so evaluating a sentence is really just walking a structure rather than threading through one procedure.',
    },
    {
      heading: 'How it works',
      body: 'Each kind of expression (a number, an addition, a subtraction) is a small object that knows how to interpret itself, usually in terms of its own sub-expressions. Evaluating the whole sentence means recursively asking the outermost expression to interpret itself. The demo mirrors this by reducing an expression like "3 + 4 - 2" one operation at a time — evaluating the leftmost term, folding it into a single number, and repeating — so you can watch the structure collapse step by step instead of seeing only a final answer.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when a grammar is simple enough that a class-per-rule design stays manageable, and when you would rather compose and extend grammar rules as objects than maintain a hand-rolled parser. It shows up in rule engines, query languages, template engines, and small domain-specific languages embedded in an app.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A calculator worked out by hand, left to right: you do not solve the whole expression in one leap, you repeatedly interpret the next operation and replace it with its result until one number remains.',
    },
  ],
  code: [
    {
      label: 'interpreter.ts',
      language: 'typescript',
      source: `interface Expression {
  interpret(): number;
}

class NumberExpr implements Expression {
  constructor(private value: number) {}
  interpret(): number {
    return this.value;
  }
}

class AddExpr implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(): number {
    return this.left.interpret() + this.right.interpret();
  }
}

class SubtractExpr implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(): number {
    return this.left.interpret() - this.right.interpret();
  }
}

// Represents "3 + 4 - 2" as a tree, built left-to-right.
const expr = new SubtractExpr(
  new AddExpr(new NumberExpr(3), new NumberExpr(4)),
  new NumberExpr(2),
);

console.log(expr.interpret()); // 5 — each node interprets itself, recursively`,
    },
  ],
};
