import { Category } from '../../core/content/content.model';
import { observerTopic } from './observer/observer.content';
import { chainOfResponsibilityTopic } from './chain-of-responsibility/chain-of-responsibility.content';
import { commandTopic } from './command/command.content';
import { interpreterTopic } from './interpreter/interpreter.content';
import { iteratorTopic } from './iterator/iterator.content';
import { mediatorTopic } from './mediator/mediator.content';
import { mementoTopic } from './memento/memento.content';
import { stateTopic } from './state/state.content';
import { strategyTopic } from './strategy/strategy.content';
import { templateMethodTopic } from './template-method/template-method.content';
import { visitorTopic } from './visitor/visitor.content';

/** Behavioral patterns — how objects communicate and share responsibility. */
export const behavioralCategory: Category = {
  id: 'behavioral',
  title: 'Behavioral Patterns',
  description:
    'Behavioral patterns are about communication between objects — how they ' +
    'interact, distribute responsibility, and stay loosely coupled while working ' +
    'together. Each demo below is fully interactive.',
  icon: 'connected',
  accent: '#00a0e9',
  topics: [
    chainOfResponsibilityTopic,
    commandTopic,
    interpreterTopic,
    iteratorTopic,
    mediatorTopic,
    mementoTopic,
    observerTopic,
    stateTopic,
    strategyTopic,
    templateMethodTopic,
    visitorTopic,
  ],
};
