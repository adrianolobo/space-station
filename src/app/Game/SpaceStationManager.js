import SpaceStation from './SpaceStation';

export default class SpaceStationManager {
  constructor(scene) {
    this.scene = scene;
    this.spaceStation = null;
  }
  preload() {
    this.scene.load.image('space-station', '/static/img/space-station.png');
    this.scene.load.image('cargo-bay-wall', '/static/img/cargo-bay-wall.png');
  }
  create() {
    this.spaceStation = new SpaceStation(this.scene);
  }
  update() {
    this.spaceStation.update();
  }
}
