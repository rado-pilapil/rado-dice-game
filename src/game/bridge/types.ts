export interface ReactToPhaser {
  roll(result: number): void;
  setMute(muted: boolean): void;
}

export interface PhaserToReact {
  onReady(): void;
  onRollComplete(result: number): void;
}
