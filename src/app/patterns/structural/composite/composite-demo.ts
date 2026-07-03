import { NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { IxButton, IxIcon } from '@siemens/ix-angular/standalone';

interface FileNode {
  kind: 'file';
  id: string;
  name: string;
  size: number;
  depth: number;
  computed: number | null;
}

interface FolderNode {
  kind: 'folder';
  id: string;
  name: string;
  depth: number;
  children: TreeNode[];
  computed: number | null;
}

type TreeNode = FileNode | FolderNode;

/**
 * Composite demo: files and folders are both "nodes" with a size, computed the
 * same recursive way -- a file's size IS its size; a folder's size is the sum
 * of its children. Clicking "Compute" reveals leaves first, then bubbles the
 * sum up through each parent folder, ending at the root total.
 */
@Component({
  selector: 'app-composite-demo',
  imports: [IxButton, IxIcon, NgTemplateOutlet],
  template: `
    <div class="demo">
      <p class="demo__hint">
        Compute the total size. Files reveal their size first, then each folder lights up as it
        sums its children -- the same operation, applied uniformly at every level.
      </p>

      <div class="demo__controls">
        <ix-button variant="primary" (click)="compute()" [disabled]="running()">
          Compute total size
        </ix-button>
        <ix-button variant="tertiary" (click)="reset()">Reset</ix-button>
      </div>

      <div class="tree">
        <ng-container *ngTemplateOutlet="nodeTpl; context: { $implicit: root() }"></ng-container>
      </div>
    </div>

    <ng-template #nodeTpl let-node>
      <div class="node" [style.--depth]="node.depth">
        <div
          class="node__row"
          [class.node__row--folder]="node.kind === 'folder'"
          [class.node__row--lit]="node.computed !== null"
        >
          @if (node.kind === 'folder') {
            <ix-icon name="tree" size="16"></ix-icon>
          } @else {
            <span class="node__glyph">📄</span>
          }
          <span class="node__name">{{ node.name }}</span>
          @if (node.computed !== null) {
            <span class="node__size">{{ node.computed }} kb</span>
          } @else {
            <span class="node__size node__size--pending">—</span>
          }
        </div>
        @if (node.kind === 'folder') {
          <div class="node__children">
            @for (child of node.children; track child.id) {
              <ng-container *ngTemplateOutlet="nodeTpl; context: { $implicit: child }"></ng-container>
            }
          </div>
        }
      </div>
    </ng-template>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .demo__hint {
        margin: 0;
        color: var(--theme-color-soft-text);
      }
      .demo__controls {
        display: flex;
        gap: 0.75rem;
      }
      .tree {
        padding: 1rem 1.25rem;
        border-radius: 12px;
        background: var(--theme-color-2);
        border: 1px solid var(--theme-color-soft-bdr);
      }
      .node {
        margin-left: calc(var(--depth, 0) * 1.5rem);
      }
      .node__row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.45rem 0.6rem;
        border-radius: 6px;
        color: var(--theme-color-soft-text);
        transition: background 0.35s ease, color 0.35s ease, box-shadow 0.35s ease;
      }
      .node__row--folder {
        font-weight: 600;
      }
      .node__row--lit {
        color: var(--theme-color-std-text);
        background: color-mix(in srgb, var(--theme-color-success) 16%, transparent);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--theme-color-success) 40%, transparent);
      }
      .node__name {
        flex: 1;
      }
      .node__glyph {
        font-size: 0.95rem;
        line-height: 1;
      }
      .node__size {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        color: var(--theme-color-primary);
      }
      .node__size--pending {
        color: var(--theme-color-soft-text);
        font-weight: 400;
      }
      .node__children {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class CompositeDemo {
  readonly running = signal(false);

  readonly root = signal<FolderNode>(CompositeDemo.buildTree());

  private static buildTree(): FolderNode {
    return {
      kind: 'folder',
      id: 'project',
      name: 'Project',
      depth: 0,
      computed: null,
      children: [
        { kind: 'file', id: 'readme', name: 'readme.txt', size: 2, depth: 1, computed: null },
        {
          kind: 'folder',
          id: 'src',
          name: 'src',
          depth: 1,
          computed: null,
          children: [
            { kind: 'file', id: 'main', name: 'main.ts', size: 5, depth: 2, computed: null },
            { kind: 'file', id: 'utils', name: 'utils.ts', size: 3, depth: 2, computed: null },
          ],
        },
      ],
    };
  }

  private allNodes(node: TreeNode, acc: TreeNode[] = []): TreeNode[] {
    acc.push(node);
    if (node.kind === 'folder') {
      node.children.forEach((child) => this.allNodes(child, acc));
    }
    return acc;
  }

  private setComputed(id: string, value: number): void {
    const update = (node: TreeNode): TreeNode => {
      if (node.id === id) {
        return { ...node, computed: value } as TreeNode;
      }
      if (node.kind === 'folder') {
        return { ...node, children: node.children.map(update) };
      }
      return node;
    };
    this.root.update((root) => update(root) as FolderNode);
  }

  private sizeOf(node: TreeNode): number {
    return node.kind === 'file' ? node.size : node.children.reduce((sum, c) => sum + this.sizeOf(c), 0);
  }

  async compute(): Promise<void> {
    if (this.running()) return;
    this.running.set(true);
    this.reset(false);

    const files = this.allNodes(this.root()).filter((n): n is FileNode => n.kind === 'file');
    for (const file of files) {
      this.setComputed(file.id, file.size);
      await this.delay(260);
    }

    // Bubble up: fold deepest folders first so children are already lit.
    const folders = this.allNodes(this.root())
      .filter((n): n is FolderNode => n.kind === 'folder')
      .sort((a, b) => b.depth - a.depth);
    for (const folder of folders) {
      this.setComputed(folder.id, this.sizeOf(folder));
      await this.delay(320);
    }

    this.running.set(false);
  }

  reset(rebuild = true): void {
    if (rebuild) {
      this.root.set(CompositeDemo.buildTree());
    } else {
      const clear = (node: TreeNode): TreeNode =>
        node.kind === 'folder'
          ? { ...node, computed: null, children: node.children.map(clear) }
          : { ...node, computed: null };
      this.root.update((root) => clear(root) as FolderNode);
    }
    this.running.set(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
