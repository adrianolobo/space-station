import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
  constructor(sceneKey) {
    super({ key: sceneKey });
  }
  create() {
    this.appScene = this.scene.get('AppController');
  }
  get width() {
    if (!((this.cameras || {}).main || {}).width) return;
    return this.cameras.main.width;
  }
  get height() {
    if (!((this.cameras || {}).main || {}).height) return;
    return this.cameras.main.height;
  }
}
