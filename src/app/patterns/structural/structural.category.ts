import { Category } from '../../core/content/content.model';
import { adapterTopic } from './adapter/adapter.content';
import { bridgeTopic } from './bridge/bridge.content';
import { compositeTopic } from './composite/composite.content';
import { decoratorTopic } from './decorator/decorator.content';
import { facadeTopic } from './facade/facade.content';
import { flyweightTopic } from './flyweight/flyweight.content';
import { proxyTopic } from './proxy/proxy.content';

/** Structural patterns — how classes and objects compose into larger structures. */
export const structuralCategory: Category = {
  id: 'structural',
  title: 'Structural Patterns',
  description:
    'Structural patterns are about composition — how classes and objects are ' +
    'assembled into larger structures while keeping those structures flexible ' +
    'and efficient. Each demo below is fully interactive.',
  icon: 'hierarchy',
  accent: '#ff9000',
  topics: [
    adapterTopic,
    bridgeTopic,
    compositeTopic,
    decoratorTopic,
    facadeTopic,
    flyweightTopic,
    proxyTopic,
  ],
};
