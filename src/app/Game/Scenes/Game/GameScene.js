import BaseScene from '../BaseScene';
import CargoShipsManager from './CargoShipsManager';
import SpaceStationManager from './SpaceStationManager';
import CollisionManager from './CollisionManager';
import OutsideArrow from '../../Entities/OutsideArrow';

export default class GameScene extends BaseScene {
  constructor() {
    super({ key: 'GameScene' });
  }
  preload() {
    // COLOCAR EM UM LOADER
    this.load.atlas('flares', '/static/img/flares.png', '/static/flares.json');

    this.CargoShipsManager = new CargoShipsManager(this);
    this.SpaceStationManager = new SpaceStationManager(this);
    this.CollisionManager = new CollisionManager(this);

    this.CargoShipsManager.preload();
    this.SpaceStationManager.preload();
    OutsideArrow.preload(this);
  }
  create() {
    super.create();
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
