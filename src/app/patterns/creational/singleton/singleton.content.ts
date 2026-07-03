import { Topic } from '../../../core/content/content.model';
import { SingletonDemo } from './singleton-demo';

export const singletonTopic: Topic = {
  id: 'singleton',
  title: 'Singleton',
  tagline: 'Guarantee a class has exactly one instance, shared everywhere.',
  icon: 'circle-dot',
  demo: SingletonDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Ensure a class has only one instance and provide a single, global point of access to it.',
    },
    {
      heading: 'Problem it solves',
      body: 'Some resources should exist exactly once — an app configuration, a logging service, a connection pool. If every part of the code freely creates its own copy, they drift out of sync and waste resources. You need a way to make sure everyone talks to the same object.',
    },
    {
      heading: 'How it works',
      body: 'The class hides its constructor and exposes a static accessor. The first call lazily creates the instance and caches it; every later call returns that same cached object. Flip the toggle in the demo off to see what happens without it — each request manufactures a brand-new object.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when exactly one instance must coordinate actions across the system and a plain global variable would not give you controlled, lazy creation. Be cautious: an overused Singleton becomes hidden global state that complicates testing.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A country has a single official government. No matter who asks "who governs here?", the answer points to the same one entity — not a fresh government per citizen.',
    },
  ],
  code: [
    {
      label: 'singleton.ts',
      language: 'typescript',
      source: `class AppConfig {
  private static instance: AppConfig | null = null;

  // Private constructor blocks 'new AppConfig()' from outside.
  private constructor(public readonly settings: Record<string, string>) {}

  static getInstance(): AppConfig {
    if (AppConfig.instance === null) {
      AppConfig.instance = new AppConfig({ theme: 'dark' });
    }
    return AppConfig.instance;
  }
}

const a = AppConfig.getInstance();
const b = AppConfig.getInstance();
console.log(a === b); // true — one shared instance`,
    },
  ],
};
