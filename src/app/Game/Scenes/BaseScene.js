import Phaser from 'phaser/dist/phaser.min';

export default class BaseScene extends Phaser.Scene {
  create() {
    this.appScene = this.scene.get('AppController');
  }
  get width() {
    if (!((this.cameras || {}).main || {}).width) return null;
    return this.cameras.main.width;
  }
  get height() {
    if (!((this.cameras || {}).main || {}).height) return null;
    return this.cameras.main.height;
  }
}
