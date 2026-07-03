import { Category } from '../../core/content/content.model';
import { singletonTopic } from './singleton/singleton.content';
import { factoryMethodTopic } from './factory-method/factory-method.content';
import { abstractFactoryTopic } from './abstract-factory/abstract-factory.content';
import { builderTopic } from './builder/builder.content';
import { prototypeTopic } from './prototype/prototype.content';

/** The Creational design patterns — patterns about how objects get created. */
export const creationalCategory: Category = {
  id: 'creational',
  title: 'Creational Patterns',
  description:
    'Creational patterns deal with object creation — making a system independent ' +
    'of how its objects are made, composed and represented. Each demo below is ' +
    'fully interactive.',
  icon: 'layers',
  accent: '#7c5cff',
  topics: [
    singletonTopic,
    factoryMethodTopic,
    abstractFactoryTopic,
    builderTopic,
    prototypeTopic,
  ],
};
