import Phaser from '@/phaser';

export default class BaseScene extends Phaser.Scene {
  create() {
    this.appScene = this.scene.get('AppController');
    this.gameEvents = new Phaser.Events.EventEmitter();
    this.events.once('shutdown', () => {
      this.gameEvents.destroy();
    });
  }
  get width() {
    if (!(this.cameras || {}).main) return null;
    return this.cameras.main.width;
  }
  get halfWidth() {
    if (this.width === null) return null;
    return (this.width / 2);
  }
  get height() {
    if (!(this.cameras || {}).main || {}) return null;
    return this.cameras.main.height;
  }
  get halfHeight() {
    if (this.height === null) return null;
    return (this.height / 2);
  }
}
