import { Component, signal } from '@angular/core';
import { IxButton, IxToggle } from '@siemens/ix-angular/standalone';

interface Client {
  name: string;
  instance: number | null;
}

/**
 * Interactive Singleton demo: toggle the pattern on/off, then let three clients
 * request "the configuration". With the Singleton on, every client resolves to
 * the same instance (#1) and the created-objects counter stays at 1.
 */
@Component({
  selector: 'app-singleton-demo',
  imports: [IxButton, IxToggle],
  template: `
    <div class="demo">
      <div class="demo__controls">
        <ix-toggle
          [checked]="useSingleton()"
          textOn="Singleton ON"
          textOff="Singleton OFF"
          (checkedChange)="setMode($event.detail)"
        ></ix-toggle>
        <ix-button variant="secondary" (click)="reset()">Reset</ix-button>
      </div>

      <p class="demo__hint">
        Click each client to request the configuration object. Matching numbers
        (and colours) mean they share the <em>same</em> instance.
      </p>

      <div class="demo__clients">
        @for (client of clients(); track client.name; let i = $index) {
          <div class="client">
            <span class="client__name">{{ client.name }}</span>
            <div
              class="client__slot"
              [class.client__slot--filled]="client.instance !== null"
              [style.--c]="colorFor(client.instance)"
            >
              @if (client.instance !== null) {
                <span class="client__id">#{{ client.instance }}</span>
              } @else {
                <span class="client__empty">—</span>
              }
            </div>
            <ix-button variant="primary" (click)="request(i)">Request</ix-button>
          </div>
        }
      </div>

      <div class="demo__meter" [class.demo__meter--warn]="created() > 1">
        Objects actually created:
        <strong>{{ created() }}</strong>
        @if (useSingleton()) {
          <span class="demo__tag">shared everywhere ✔</span>
        } @else {
          <span class="demo__tag demo__tag--warn">one per request ✘</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .demo__controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .demo__clients {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
      .client {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid var(--theme-color-soft-bdr);
        border-radius: 8px;
      }
      .client__name {
        font-weight: 600;
      }
      .client__slot {
        --c: var(--theme-color-component-1);
        width: 84px;
        height: 84px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--theme-color-soft-bdr);
        transition: all 0.3s ease;
      }
      .client__slot--filled {
        border-style: solid;
        border-color: var(--c);
        background: color-mix(in srgb, var(--c) 20%, transparent);
        box-shadow: 0 0 18px color-mix(in srgb, var(--c) 55%, transparent);
      }
      .client__id {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--c);
      }
      .client__empty {
        color: var(--theme-color-soft-text);
        font-size: 1.5rem;
      }
      .demo__meter {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background: var(--theme-color-2);
      }
      .demo__meter--warn {
        background: color-mix(in srgb, var(--theme-color-warning) 18%, transparent);
      }
      .demo__tag {
        margin-left: 0.5rem;
        color: var(--theme-color-success);
        font-weight: 600;
      }
      .demo__tag--warn {
        color: var(--theme-color-warning);
      }
      @media (max-width: 640px) {
        .demo__clients {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SingletonDemo {
  private static readonly PALETTE = ['#00cc76', '#ff9000', '#7c5cff', '#00a0e9', '#e5504d'];

  readonly useSingleton = signal(true);
  readonly created = signal(0);
  readonly clients = signal<Client[]>([
    { name: 'Client A', instance: null },
    { name: 'Client B', instance: null },
    { name: 'Client C', instance: null },
  ]);

  private nextId = 1;
  private shared: number | null = null;

  request(index: number): void {
    let id: number;
    if (this.useSingleton()) {
      if (this.shared === null) {
        this.shared = this.nextId++;
        this.created.update((count) => count + 1);
      }
      id = this.shared;
    } else {
      id = this.nextId++;
      this.created.update((count) => count + 1);
    }
    this.clients.update((list) =>
      list.map((client, i) => (i === index ? { ...client, instance: id } : client)),
    );
  }

  setMode(on: boolean): void {
    this.useSingleton.set(on);
    this.reset();
  }

  reset(): void {
    this.nextId = 1;
    this.shared = null;
    this.created.set(0);
    this.clients.update((list) => list.map((client) => ({ ...client, instance: null })));
  }

  colorFor(instance: number | null): string {
    if (instance === null) {
      return 'var(--theme-color-component-1)';
    }
    return SingletonDemo.PALETTE[(instance - 1) % SingletonDemo.PALETTE.length];
  }
}
