import CargoShip from './Entities/CargoShip';

export default class CargoShipsManager {
  constructor(scene) {
    this.scene = scene;
    this.ships = [];
    this.activeShip = null;
  }
  preload() {
    this.scene.load.image('cargo-ship', '/static/img/cargo-ship.png');
  }
  create() {
    this.ships.push(new CargoShip(this.scene));
    this.manageInputs();
  }
  update() {
    this.ships.forEach((ship) => {
      ship.update();
    });
  }
  manageInputs() {
    this.scene.input.on('pointerdown', (pointer, gameObjects) => {
      if ((gameObjects[0] || {}).name === 'CargoShip') {
        const ship = gameObjects[0].__self;
        if (ship) {
          this.activeShip = ship;
          ship.beginPath(pointer.position);
        }
      }
    });
    this.scene.input.on('pointermove', (pointer) => {
      if (this.activeShip) {
        this.activeShip.movePath(pointer.position);
      }
    });
    this.scene.input.on('pointerup', (pointer) => {
      if (this.activeShip) {
        this.activeShip.endPath(pointer.position);
        this.activeShip = null;
      }
    });
  }
}
