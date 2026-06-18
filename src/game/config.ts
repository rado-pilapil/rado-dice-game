import Phaser from "phaser";
import { DiceScene } from "./scenes/DiceScene";

export const createConfig = (
  parent: HTMLElement,
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,

  parent,

  width: 800,
  height: 600,

  backgroundColor: "#111827",

  scene: [DiceScene],

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,

    // 🔥 ensures it always recalculates on resize
    resizeInterval: 0,

    // optional but helps prevent layout drift
    expandParent: true,
  },

  render: {
    antialias: true,
    pixelArt: false,
    powerPreference: "high-performance",

    // 🔥 helps avoid visual artifacts during fast tweens (shake/scale)
    clearBeforeRender: true,
  },
});
