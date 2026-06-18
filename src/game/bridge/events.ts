import Phaser from "phaser";

export const gameEvents = new Phaser.Events.EventEmitter();

export const BridgeEvents = {
  READY: "READY",
  ROLL_REQUEST: "ROLL_REQUEST",
  ROLL_COMPLETE: "ROLL_COMPLETE",
  SET_MUTE: "SET_MUTE",
} as const;

export type BridgeEvent = (typeof BridgeEvents)[keyof typeof BridgeEvents];
