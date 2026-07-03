import { Topic } from '../../../core/content/content.model';
import { StateDemo } from './state-demo';

export const stateTopic: Topic = {
  id: 'state',
  title: 'State',
  tagline: 'Let an object change its behavior when its internal state changes.',
  icon: 'switch-slider',
  demo: StateDemo,
  sections: [
    {
      heading: 'Intent',
      body: 'Allow an object to alter its behavior when its internal state changes, so that it appears to change its class. The object delegates state-specific behavior to a current-state representation instead of branching on a status flag everywhere.',
    },
    {
      heading: 'Problem it solves',
      body: 'An object often behaves differently depending on some internal mode — a document that is Draft, Moderation, or Published; a connection that is Idle, Connecting, or Open. Left unmanaged, this turns into a sprawling if/else or switch on a status field, repeated in every method, that the client has to understand and keep in sync. Adding a new state means hunting down every conditional.',
    },
    {
      heading: 'How it works',
      body: 'Each state owns its own reaction to the same requests, and transitions are decided by the current state alone. In the demo, pressing Play/Pause does something different depending on which state the player is currently in — Stopped goes to Playing, Playing goes to Paused, Paused goes back to Playing — while Stop always resets to Stopped from either. The caller never branches on the state; it just asks for the action and the current state supplies the behavior and the next transition.',
    },
    {
      heading: 'When to use it',
      body: 'Use it when an object behaves differently depending on its state and has many state-dependent conditionals, or when transitions between states follow clear rules that are easier to reason about as isolated units than as one giant conditional. It is a natural fit for workflows, connections, and UI components with distinct modes.',
    },
    {
      heading: 'Real-world analogy',
      body: 'A traffic light responds to the same "advance" signal differently depending on its current color: red advances to green, green advances to yellow, yellow advances to red. Nobody outside the light needs to track which color comes next — the light itself knows, based purely on where it currently is.',
    },
  ],
  code: [
    {
      label: 'state.ts',
      language: 'typescript',
      source: `interface PlayerState {
  playPause(player: Player): void;
  stop(player: Player): void;
  readonly name: string;
}

class Stopped implements PlayerState {
  readonly name = 'Stopped';
  playPause(player: Player) { player.setState(new Playing()); }
  stop(player: Player) { /* already stopped */ }
}

class Playing implements PlayerState {
  readonly name = 'Playing';
  playPause(player: Player) { player.setState(new Paused()); }
  stop(player: Player) { player.setState(new Stopped()); }
}

class Paused implements PlayerState {
  readonly name = 'Paused';
  playPause(player: Player) { player.setState(new Playing()); }
  stop(player: Player) { player.setState(new Stopped()); }
}

class Player {
  private state: PlayerState = new Stopped();

  setState(state: PlayerState) { this.state = state; }
  // The same call produces a different transition depending on current state.
  playPause() { this.state.playPause(this); }
  stop() { this.state.stop(this); }
  get current() { return this.state.name; }
}

const player = new Player();
player.playPause(); // Stopped -> Playing
player.playPause(); // Playing -> Paused
player.playPause(); // Paused -> Playing
player.stop();      // Playing -> Stopped`,
    },
  ],
};
