import Phaser from 'phaser/dist/phaser';
import CargoShip from './Entities/CargoShip';

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
    // REMOVER
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(2, 0xffffff, 1);
    const gameConfig = this.scene.scene.systems.game.config;
    const originX = gameConfig.width / 2;
    const originY = gameConfig.height / 2;
    const radius = 300;
    console.log(this.scene);
    console.log(originX);
    console.log(originY);
    this.path = new Phaser.Curves.Path(originX, originY);
    for (let i = 0; i < 2 * Math.PI; i += 0.01) {
      this.path.lineTo(
        (Math.sin(i * Math.PI) * radius) + originX,
        (Math.cos(i * Math.PI) * radius) + originY,
      );
    }
    let angle = Math.random() * Math.PI * 2;
    this.ships.push(new CargoShip(this.scene, {
      x: (Math.cos(angle) * radius) + originX,
      y: (Math.sin(angle) * radius) + originY,
    }));
    angle = Math.random() * Math.PI * 2;
    this.ships.push(new CargoShip(this.scene, {
      x: (Math.cos(angle) * radius) + originX,
      y: (Math.sin(angle) * radius) + originY,
    }));
    angle = Math.random() * Math.PI * 2;
    this.ships.push(new CargoShip(this.scene, {
      x: (Math.cos(angle) * radius) + originX,
      y: (Math.sin(angle) * radius) + originY,
    }));
    angle = Math.random() * Math.PI * 2;
    this.ships.push(new CargoShip(this.scene, {
      x: (Math.cos(angle) * radius) + originX,
      y: (Math.sin(angle) * radius) + originY,
    }));
    angle = Math.random() * Math.PI * 2;
    this.ships.push(new CargoShip(this.scene, {
      x: (Math.cos(angle) * radius) + originX,
      y: (Math.sin(angle) * radius) + originY,
    }));
    this.path.draw(this.graphics);
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
