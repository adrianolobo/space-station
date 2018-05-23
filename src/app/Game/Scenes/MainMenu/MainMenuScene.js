import Phaser from 'phaser/dist/phaser.min';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }
  create() {
    this.graphics = this.add.graphics(
      { lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } },
    );
    this.circle = new Phaser.Geom.Circle(100, 100, 100);
    this.graphics.strokeCircleShape(this.circle);
    setTimeout(() => {
      this.scene.start('GameScene');
    }, 100);
  }
}
