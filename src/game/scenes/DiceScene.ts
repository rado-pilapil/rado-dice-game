import Phaser from "phaser";

import { gameEvents, BridgeEvents } from "../bridge/events";

import { GAME_CONSTANTS } from "@constants/Constants";

import { ASSETS } from "@game/assets";

export class DiceScene extends Phaser.Scene {
  private diceText!: Phaser.GameObjects.Text;
  private diceContainer!: Phaser.GameObjects.Container;
  private diceBox!: Phaser.GameObjects.Rectangle;

  private rolling = false;

  private centerX = 0;
  private centerY = 0;

  private bounds = {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  };

  constructor() {
    super("DiceScene");
  }

  preload() {
    this.load.on("loaderror", (file: any) => {
      console.error("Failed loading:", file.key, file.src);
    });

    this.load.audio("rollDice", ASSETS.audio.rollDice);
  }

  create() {
    this.cameras.main.setBackgroundColor("#1f2937");

    this.centerX = this.scale.width / 2;
    this.centerY = this.scale.height / 2;

    const padding = 140;

    console.log(this.cache.audio.getKeys());

    this.bounds = {
      minX: padding,
      maxX: this.scale.width - padding,
      minY: padding,
      maxY: this.scale.height - padding,
    };

    this.diceBox = this.add.rectangle(0, 0, 220, 220, 0xffffff);
    this.diceBox.setStrokeStyle(6, 0x111827);

    this.diceText = this.add.text(0, 0, "0", {
      fontSize: "80px",
      color: "#111827",
    });

    this.diceText.setOrigin(0.5);

    this.diceContainer = this.add.container(this.centerX, this.centerY, [
      this.diceBox,
      this.diceText,
    ]);

    gameEvents.emit(BridgeEvents.READY);

    gameEvents.on(BridgeEvents.ROLL_REQUEST, this.rollDice, this);
    gameEvents.on(BridgeEvents.SET_MUTE, this.handleMute, this);
  }

  private applyBounds(vx: number, vy: number) {
    if (
      this.diceContainer.x <= this.bounds.minX ||
      this.diceContainer.x >= this.bounds.maxX
    ) {
      vx *= -1;
    }

    if (
      this.diceContainer.y <= this.bounds.minY ||
      this.diceContainer.y >= this.bounds.maxY
    ) {
      vy *= -1;
    }

    this.diceContainer.x = Phaser.Math.Clamp(
      this.diceContainer.x,
      this.bounds.minX,
      this.bounds.maxX,
    );

    this.diceContainer.y = Phaser.Math.Clamp(
      this.diceContainer.y,
      this.bounds.minY,
      this.bounds.maxY,
    );

    return { vx, vy };
  }

  private rollDice(result: number) {
    if (this.rolling) return;

    this.sound.play("rollDice", { volume: 5 });

    this.rolling = true;

    let tick = 0;

    let vx = Phaser.Math.Between(-20, 20);
    let vy = Phaser.Math.Between(-20, 20);

    const spinDirection = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    let va = Phaser.Math.Between(25, 40) * spinDirection;

    const timer = this.time.addEvent({
      delay: 23,
      loop: true,

      callback: () => {
        tick++;

        // =========================
        // 🔥 EASED DECAY (UPDATED)
        // =========================
        const t = Phaser.Math.Clamp(tick / 40, 0, 1);
        const decay = Phaser.Math.Easing.Quadratic.Out(1 - t);

        // =========================
        // CHAOS MOTION (unchanged)
        // =========================
        vx += Phaser.Math.Between(-4, 4) * decay;
        vy += Phaser.Math.Between(-4, 4) * decay;

        vx = Phaser.Math.Clamp(vx, -25, 25);
        vy = Phaser.Math.Clamp(vy, -25, 25);

        // =========================
        // APPLY MOVEMENT (smoothed)
        // =========================
        this.diceContainer.x += vx * decay * 0.98;
        this.diceContainer.y += vy * decay * 0.98;

        // =========================
        // ROTATION (smooth friction)
        // =========================
        va *= decay;
        this.diceContainer.angle += va * 0.92;

        // =========================
        // BOUNDARY CONTROL
        // =========================
        const corrected = this.applyBounds(vx, vy);
        vx = corrected.vx;
        vy = corrected.vy;

        // =========================
        // NUMBER SHUFFLE
        // =========================
        this.diceText.setText(
          Phaser.Math.Between(
            GAME_CONSTANTS.DICE_MIN_VALUE,
            GAME_CONSTANTS.DICE_MAX_VALUE,
          ).toString(),
        );

        // =========================
        // STOP (SOFT TRANSITION)
        // =========================
        if (tick >= 40) {
          timer.remove(false);

          // 🔥 smooth settle instead of hard snap
          this.tweens.add({
            targets: this.diceContainer,
            x: this.centerX,
            y: this.centerY,
            angle: 0,
            duration: 250,
            ease: "Cubic.easeOut",
          });

          this.diceText.setText(result.toString());

          this.tweens.add({
            targets: this.diceContainer,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 120,
            ease: "Bounce.easeOut",
            yoyo: true,
          });

          this.rolling = false;

          gameEvents.emit(BridgeEvents.ROLL_COMPLETE, result);
        }
      },
    });
  }

  private handleMute(muted: boolean) {
    this.sound.mute = muted;
  }

  shutdown() {
    gameEvents.off(BridgeEvents.ROLL_REQUEST, this.rollDice, this);
    gameEvents.off(BridgeEvents.SET_MUTE, this.handleMute, this);

    this.tweens.killAll();
  }
}
