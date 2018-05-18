import SpaceStation from '../../Entities/SpaceStation/SpaceStation';

export default class SpaceStationManager {
  constructor(scene) {
    this.scene = scene;
    this.spaceStation = null;
  }
  preload() {
    this.scene.load.image('solar-panel', '/static/img/solar-panel.png');
    this.scene.load.image('solar-module', '/static/img/solar-module.png');
    this.scene.load.image('cargo-module', '/static/img/cargo-module.png');
    this.scene.load.image('social-module-1', '/static/img/social-module-1.png');
    this.scene.load.image('connector-module', '/static/img/connector-module.png');
  }
  create() {
    this.spaceStation = new SpaceStation(this.scene);
  }
  update() {
    this.spaceStation.update();
  }
}
