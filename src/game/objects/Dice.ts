import Phaser from "phaser";
// import { BridgeEvents, gameEvents } from "../bridge/events";
import { GAME_CONSTANTS } from "../../constants/Constants";

export class Dice {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  private box: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  private rolling = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // shadow
    const shadow = scene.add.rectangle(6, 6, 220, 220, 0x000000, 0.2);

    // dice body
    this.box = scene.add.rectangle(0, 0, 220, 220, 0xffffff);

    this.box.setStrokeStyle(6, 0x222222);

    // number
    this.text = scene.add.text(0, 0, "0", {
      fontSize: "72px",
      color: "#111",
    });

    this.text.setOrigin(0.5);

    this.container = scene.add.container(x, y, [shadow, this.box, this.text]);
  }

  public roll(result: number, onComplete: () => void) {
    if (this.rolling) return;

    // const sound = this.scene.sound.play("rollDice", { volume: 1 });
    // console.log("sound instance:", sound);

    this.rolling = true;

    let count = 0;

    const shuffle = this.scene.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        count++;

        this.text.setText(
          Phaser.Math.Between(
            GAME_CONSTANTS.DICE_MIN_VALUE,
            GAME_CONSTANTS.DICE_MAX_VALUE,
          ).toString(),
        );

        if (count > 18) {
          shuffle.remove();
        }
      },
    });

    this.scene.tweens.add({
      targets: this.container,

      angle: 1080,

      scaleX: 0.85,
      scaleY: 1.15,

      duration: 1100,
      ease: "Cubic.easeOut",

      onStart: () => {},

      onComplete: () => {
        this.container.setScale(1);
        this.container.angle = 0;

        this.text.setText(result.toString());

        this.scene.tweens.add({
          targets: this.container,
          scaleX: 1.25,
          scaleY: 1.25,
          yoyo: true,
          duration: 120,
        });

        this.rolling = false;

        onComplete();
      },
    });
  }

  public destroy() {
    this.container.destroy();
  }
}
