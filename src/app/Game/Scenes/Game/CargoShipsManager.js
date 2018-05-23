import CargoShip from '../../Entities/CargoShip';

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
    this.scene.load.atlas('flares', '/static/img/flares.png', '/static/flares.json');
  }
  create() {
    this.manageInputs();
    this.newShip();
    setInterval(this.newShip.bind(this), 5000);
    console.log('REMOVERRRRR');
    this.flames = this.scene.add.particles('flares');
    this.emitter = this.flames.createEmitter({
      x: 100,
      y: 100,
      frame: 'yellow',
      speed: 100,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
    });
    console.log(this.flames);
    console.log(this.emitter);
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
