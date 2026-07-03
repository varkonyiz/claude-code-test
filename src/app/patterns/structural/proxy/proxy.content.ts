import { Topic } from '../../../core/content/content.model';
import { ProxyDemo } from './proxy-demo';

export const proxyTopic: Topic = {
  id: 'proxy',
  title: 'Proxy',
  tagline: 'A stand-in that guards or defers the real thing.',
  icon: 'shield',
  demo: ProxyDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Provide a surrogate or placeholder for another object to control access to it — adding a check, a cache, or lazy creation in front of the real object without the caller needing to know the difference.',
    },
    {
      heading: 'Problem it solves',
      body: 'Sometimes you cannot, or should not, let callers talk to the real object directly: it might be expensive to create, sensitive to unauthorized use, or slow to load. Scattering permission checks or lazy-loading logic across every call site duplicates that logic and is easy to get wrong.',
    },
    {
      heading: 'How it works',
      body: 'The proxy implements the same interface as the real object and sits in front of it, adding its own logic before delegating (or refusing to delegate). The demo shows both flavours at once: a protection proxy blocks the restricted thumbnail unless "Authorized user" is on, and a virtual proxy lazily loads each image only on first access — a "Loading…" state appears once, the real loads counter ticks up by one, and every click after that is instant and reuses the cached result.',
    },
    {
      heading: 'When to use it',
      body: 'Use a proxy for access control (protection proxy), to defer expensive creation until it is actually needed (virtual proxy), to cache results transparently, or to add logging/remote-call plumbing in front of a real subject — all without changing the real object or its callers.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A hotel receptionist: guests do not walk straight into rooms. The receptionist checks you are authorized to be there (protection) and only has housekeeping actually prepare a room the first time it is needed (virtual/lazy), handing over the same prepared room on every later visit.',
    },
  ],
  code: [
    {
      label: 'proxy.ts',
      language: 'typescript',
      source: `interface ImageSource {
  display(): string;
}

// The "real" object: expensive to create.
class RealImage implements ImageSource {
  constructor(private filename: string) {
    console.log(\`loading \${filename} from disk...\`); // the expensive part
  }
  display(): string {
    return \`showing \${this.filename}\`;
  }
}

// The proxy: same interface, adds access control + lazy caching.
class ImageProxy implements ImageSource {
  private real: RealImage | null = null;

  constructor(private filename: string, private authorized: () => boolean) {}

  display(): string {
    if (!this.authorized()) {
      return 'Access denied';                 // protection proxy
    }
    if (!this.real) {
      this.real = new RealImage(this.filename); // virtual proxy: created once, on demand
    }
    return this.real.display();                // cached on every later call
  }
}

let isAuthorized = false;
const photo = new ImageProxy('vacation.png', () => isAuthorized);
console.log(photo.display()); // "Access denied" — never touches RealImage
isAuthorized = true;
console.log(photo.display()); // loads once, then "showing vacation.png"
console.log(photo.display()); // "showing vacation.png" — no reload`,
    },
  ],
};
