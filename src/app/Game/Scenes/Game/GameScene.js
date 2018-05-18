import Phaser from 'phaser/dist/phaser.min';
import CargoShipsManager from './CargoShipsManager';
import SpaceStationManager from './SpaceStationManager';
import CollisionManager from './CollisionManager';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  preload() {
    this.CargoShipsManager = new CargoShipsManager(this);
    this.SpaceStationManager = new SpaceStationManager(this);
    this.CollisionManager = new CollisionManager(this);

    this.CargoShipsManager.preload();
    this.SpaceStationManager.preload();
  }
  create() {
    this.CargoShipsManager.create();
    this.SpaceStationManager.create();
    this.CollisionManager.create();
    this.events.on('resize', (width, height) => {
      this.cameras.resize(width, height);
    });
  }
  update() {
    this.CargoShipsManager.update();
    this.SpaceStationManager.update();
  }
}
