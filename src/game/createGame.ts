import Phaser from "phaser";

import { createConfig } from "./config";

export function createGame(parent: HTMLElement) {
  return new Phaser.Game(createConfig(parent));
}
