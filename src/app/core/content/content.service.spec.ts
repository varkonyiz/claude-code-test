import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    service = TestBed.inject(ContentService);
  });

  it('exposes the creational category', () => {
    expect(service.categories().length).toBeGreaterThan(0);
    expect(service.getCategory('creational')).toBeDefined();
  });

  it('resolves a known topic to its category and topic', () => {
    const resolved = service.getTopic('creational', 'singleton');
    expect(resolved?.category.id).toBe('creational');
    expect(resolved?.topic.title).toBe('Singleton');
  });

  it('every topic has a demo component, sections and code', () => {
    for (const category of service.categories()) {
      for (const topic of category.topics) {
        expect(topic.demo).toBeTruthy();
        expect(topic.sections.length).toBeGreaterThan(0);
        expect(topic.code.length).toBeGreaterThan(0);
      }
    }
  });

  it('returns undefined for unknown ids', () => {
    expect(service.getCategory('does-not-exist')).toBeUndefined();
    expect(service.getTopic('creational', 'does-not-exist')).toBeUndefined();
  });
});
