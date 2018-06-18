import CargoShip from '../../Entities/CargoShip/CargoShip';

export default class CargoShipsManager {
  constructor(scene) {
    this.scene = scene;
    this.ships = [];
    this.activeShip = null;
  }
  preload() {
    this.scene.load.image('cargo-ship', '/static/img/cargo-ship.png');
    this.scene.load.image('cargo-red', '/static/img/cargo-red.png');
    this.scene.load.image('cargo-blue', '/static/img/cargo-blue.png');
  }
  create() {
    this.manageInputs();
    // this.newShip();
    // setInterval(this.newShip.bind(this), 5000);
    const newShip = new CargoShip(this.scene, {
      x: 150,
      y: 150,
    });
    const newShip2 = new CargoShip(this.scene, {
      x: 150,
      y: 250,
    });
    const gameConfig = this.scene.scene.systems.game.config;
    const originX = gameConfig.width / 2;
    const originY = gameConfig.height / 2;
    newShip.turnTo({ x: originX, y: originY });
    newShip.goFoward();
    this.ships.push(newShip);
    newShip2.turnTo({ x: originX, y: originY });
    newShip2.goFoward();
    this.ships.push(newShip2);
  }
  newShip() {
    const radius = 600;
    const gameConfig = this.scene.scene.systems.game.config;
    const originX = gameConfig.width / 2;
    const originY = gameConfig.height / 2;
    const angle = Math.random() * Math.PI * 2;
    const newShip = new CargoShip(this.scene, {
      x: (Math.cos(angle) * radius) + originX,
      y: (Math.sin(angle) * radius) + originY,
    });
    this.ships.push(newShip);
    newShip.turnTo({ x: originX, y: originY });
    newShip.goFoward();
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
          ship.requestUserMove(pointer.position, 'begin');
        }
      }
    });
    this.scene.input.on('pointermove', (pointer) => {
      if (this.activeShip) {
        this.activeShip.requestUserMove(pointer.position);
      }
    });
    this.scene.input.on('pointerup', (pointer) => {
      if (this.activeShip) {
        this.activeShip.requestUserMove(pointer.position);
        this.activeShip = null;
      }
    });
  }
}
