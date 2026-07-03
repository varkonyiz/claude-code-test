import { Topic } from '../../../core/content/content.model';
import { VisitorDemo } from './visitor-demo';

export const visitorTopic: Topic = {
  id: 'visitor',
  title: 'Visitor',
  tagline: 'Add new operations to a set of classes without changing them.',
  icon: 'user-check',
  demo: VisitorDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Represent an operation to be performed on the elements of an object structure without changing the classes of the elements it operates on. Each element accepts a visitor, and the visitor supplies the type-specific behavior for that operation.',
    },
    {
      heading: 'Problem it solves',
      body: 'A family of related classes — shapes, AST nodes, file-system entries — regularly needs new operations added (compute area, export to XML, calculate size). Adding a method to every class for every new operation bloats those classes and forces you to touch classes that otherwise have nothing to do with the new feature, especially painful when the classes are meant to be stable or third-party.',
    },
    {
      heading: 'How it works',
      body: 'Each element type implements a small "accept a visitor" method, and the operation itself lives entirely inside the visitor, one method per concrete element type. In the demo, Circle, Square, and Triangle stay exactly as they are while two different visitors are applied to them in turn: "Compute Area" reveals each shape\'s correctly-computed area using its own formula, and "Highlight Only" just pulses each shape briefly instead — a brand-new operation was applied to each shape without editing what a Circle, Square, or Triangle is.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when you need to perform many distinct, unrelated operations on a stable set of object types, and you want to add new operations without modifying those types. It fits object structures that rarely gain new element types but frequently gain new operations — compilers, document object models, and shape/geometry libraries are classic cases.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A tax auditor visits different kinds of businesses — a bakery, a bookstore, a garage — each entirely unaware of "auditing" as a concept. The auditor (the visitor) knows how to handle each type of business; the businesses just let the auditor in and go about their normal operations.',
    },
  ],
  code: [
    {
      label: 'visitor.ts',
      language: 'typescript',
      source: `interface Shape {
  accept(visitor: ShapeVisitor): void;
}

interface ShapeVisitor {
  visitCircle(shape: Circle): void;
  visitSquare(shape: Square): void;
}

class Circle implements Shape {
  constructor(public radius: number) {}
  accept(visitor: ShapeVisitor) { visitor.visitCircle(this); }
}

class Square implements Shape {
  constructor(public side: number) {}
  accept(visitor: ShapeVisitor) { visitor.visitSquare(this); }
}

// A brand-new operation, added without touching Circle or Square at all.
class AreaVisitor implements ShapeVisitor {
  visitCircle(shape: Circle) {
    console.log('circle area:', Math.PI * shape.radius ** 2);
  }
  visitSquare(shape: Square) {
    console.log('square area:', shape.side ** 2);
  }
}

const shapes: Shape[] = [new Circle(4), new Square(5)];
const areaVisitor = new AreaVisitor();
shapes.forEach((shape) => shape.accept(areaVisitor));
// circle area: 50.26...
// square area: 25`,
    },
  ],
};
