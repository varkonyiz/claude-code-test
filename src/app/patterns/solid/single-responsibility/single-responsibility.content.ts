import { Topic } from '../../../core/content/content.model';
import { SingleResponsibilityDemo } from './single-responsibility-demo';

export const singleResponsibilityTopic: Topic = {
  id: 'single-responsibility',
  title: 'Single Responsibility',
  tagline: 'A class should have only one reason to change.',
  icon: 'crosshairs',
  demo: SingleResponsibilityDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Give every class one job, and one job only, so that a change to one concern cannot ripple into unrelated behavior.',
    },
    {
      heading: 'Problem it solves',
      body: 'When a class handles several unrelated concerns — say, computing a report, formatting it, and saving it — a change to any one of them forces you to touch, recompile, and retest the whole class, even the parts that had nothing to do with the change.',
    },
    {
      heading: 'How it works',
      body: 'Split the class along its responsibilities into focused collaborators, each owning one reason to change. As the demo shows, in the monolithic design any change request flags the entire class for retesting; once split, a change only flags the one class actually responsible for it.',
    },
    {
      heading: 'When to use it',
      body: 'Apply it when a class keeps changing for multiple, unrelated reasons, or when you notice unrelated changes keep breaking the same file. Don\'t over-apply it to the point of splitting genuinely cohesive behavior — a "reason to change" should map to a real stakeholder or concern, not every single method.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A restaurant separates the chef, the cashier, and the dishwasher. If the menu changes, only the chef is affected — the cashier and dishwasher keep doing their jobs exactly as before.',
    },
  ],
  code: [
    {
      label: 'single-responsibility.ts',
      language: 'typescript',
      source: `// Before: one class, three reasons to change.
class ReportManager {
  calculate(data: number[]): number { return data.reduce((a, b) => a + b, 0); }
  format(total: number): string { return \`Total: $\${total.toFixed(2)}\`; }
  save(text: string): void { /* write to disk */ }
}

// After: each responsibility owns its own reason to change.
class Calculator {
  total(data: number[]): number { return data.reduce((a, b) => a + b, 0); }
}
class ReportFormatter {
  format(total: number): string { return \`Total: $\${total.toFixed(2)}\`; }
}
class ReportRepository {
  save(text: string): void { /* write to disk */ }
}

// A formatting-only change now only touches ReportFormatter.`,
    },
  ],
};
