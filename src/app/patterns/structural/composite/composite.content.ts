import { Topic } from '../../../core/content/content.model';
import { CompositeDemo } from './composite-demo';

export const compositeTopic: Topic = {
  id: 'composite',
  title: 'Composite',
  tagline: 'Treat a single object and a group of objects through the same interface.',
  icon: 'tree',
  demo: CompositeDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Compose objects into tree structures to represent part-whole hierarchies, so clients can treat individual objects and compositions of objects uniformly through one common interface.',
    },
    {
      heading: 'Problem it solves',
      body: 'A file system, a UI layout, an org chart — all nest individual items inside containers that can themselves contain more containers. Without a shared interface, client code has to keep checking "is this a leaf or a container?" and branch accordingly, and that check has to repeat at every level of nesting. You want one operation, like "give me the total size," that just works no matter how deep the tree goes.',
    },
    {
      heading: 'How it works',
      body: 'Both leaves (files) and composites (folders) implement the same interface; a composite delegates the operation to each of its children and combines the results, while a leaf simply returns its own value. In the demo, pressing "Compute total size" reveals each file’s size first, then bubbles the sum upward — each folder lights up once all of its children have reported in — until the root shows the grand total, using the exact same rule at every level.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when your data naturally forms a part-whole tree and you want client code to be indifferent to whether it’s handling a single item or an entire branch. It shines for recursive structures like file systems, UI component trees, and nested menus.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A company org chart: asking "how many people report up through this manager?" works the same whether you ask it of an individual contributor (one person) or the CEO (everyone) — the question and the counting rule never change with depth.',
    },
  ],
  code: [
    {
      label: 'composite.ts',
      language: 'typescript',
      source: `interface FsNode {
  size(): number;
}

// Leaf: a file's size IS its size.
class FileNode implements FsNode {
  constructor(private readonly kb: number) {}
  size(): number {
    return this.kb;
  }
}

// Composite: a folder's size is the sum of its children's sizes.
class FolderNode implements FsNode {
  private children: FsNode[] = [];

  add(node: FsNode): void {
    this.children.push(node);
  }

  size(): number {
    return this.children.reduce((sum, child) => sum + child.size(), 0);
  }
}

const src = new FolderNode();
src.add(new FileNode(5));
src.add(new FileNode(3));

const project = new FolderNode();
project.add(new FileNode(2)); // readme.txt
project.add(src); // a folder nested inside a folder

console.log(project.size()); // 10 -- same .size() call, any depth`,
    },
  ],
};
