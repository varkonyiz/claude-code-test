import { Topic } from '../../../core/content/content.model';
import { FlyweightDemo } from './flyweight-demo';

export const flyweightTopic: Topic = {
  id: 'flyweight',
  title: 'Flyweight',
  tagline: 'Share the heavy, common data so many objects stay cheap.',
  icon: 'database',
  demo: FlyweightDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Use sharing to support large numbers of fine-grained objects efficiently, by splitting an object\'s state into shared "intrinsic" state (kept in one flyweight) and per-instance "extrinsic" state (kept by the caller).',
    },
    {
      heading: 'Problem it solves',
      body: 'When a program needs thousands of similar objects — trees in a forest, characters in a document, tiles on a map — storing every heavy, repeated detail (a texture, a font, a mesh) once per object wastes enormous memory, even though most of that data is identical across instances.',
    },
    {
      heading: 'How it works',
      body: 'Common data (a species\' texture and behaviour) is created once and cached in a factory, then reused by reference for every new instance; only what genuinely varies per object (its position) is stored separately. In the demo, planting trees increases the "instances placed" counter freely, while "species objects created" only grows the first time a species is used and stays capped at three no matter how many trees you plant.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when an application needs a huge number of objects, most of their state can be made extrinsic, and grouping objects by their shared intrinsic state would let a small number of shared objects replace many. It trades a bit of lookup indirection for a large memory saving.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A print shop keeping one master stencil per letter of the alphabet: it stamps the same "A" stencil onto thousands of pages rather than carving a brand-new "A" for every single occurrence.',
    },
  ],
  code: [
    {
      label: 'flyweight.ts',
      language: 'typescript',
      source: `// Intrinsic (shared) state: heavy data common to a whole species.
class TreeSpecies {
  constructor(public readonly name: string, public readonly texture: string) {}
}

// Factory caches and reuses flyweights instead of recreating them.
class TreeSpeciesFactory {
  private static cache = new Map<string, TreeSpecies>();

  static get(name: string): TreeSpecies {
    let species = this.cache.get(name);
    if (!species) {
      species = new TreeSpecies(name, \`\${name.toLowerCase()}-bark.png\`); // "expensive" to build
      this.cache.set(name, species);
    }
    return species;
  }
}

// Extrinsic (per-instance) state: only what actually varies.
class Tree {
  constructor(public x: number, public y: number, private species: TreeSpecies) {}
}

const forest: Tree[] = [];
for (let i = 0; i < 1000; i++) {
  const species = TreeSpeciesFactory.get('Oak'); // same shared instance every time
  forest.push(new Tree(Math.random() * 100, Math.random() * 100, species));
}

console.log(forest.length);              // 1000 tree instances
console.log(TreeSpeciesFactory['cache'].size); // just 1 species object`,
    },
  ],
};
