import Phaser from 'phaser';
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
    this.cargosPercentage = [
      {
        cargos: 2,
        min: 0,
        max: 50,
      }, {
        cargos: 4,
        min: 51,
        max: 80,
      }, {
        cargos: 6,
        min: 81,
        max: 100,
      },
    ];
    this.newShip();
    setInterval(this.newShip.bind(this), 5000);
  }
  newShip() {
    const gameConfig = this.scene.cameras.main;
    const originX = gameConfig.width / 2;
    const originY = gameConfig.height / 2;
    const amountCargos = this.generateCargoAmount();
    const startPosition = this.generateStartPosition();
    const newShip = new CargoShip(this.scene, {
      x: startPosition.x,
      y: startPosition.y,
    }, amountCargos);
    this.ships.push(newShip);
    newShip.turnTo({ x: originX, y: originY });
    newShip.goFoward();
  }
  generateStartPosition() {
    console.log(this);
    // TODO: criar lógica de geração de positions
    return { x: 100, y: 100 };
  }
  generateCargoAmount() {
    const cargoChance = Phaser.Math.Between(0, 100);
    const cargoSelected = this.cargosPercentage.find(cargoPercentage =>
      cargoChance > cargoPercentage.min && cargoChance < cargoPercentage.max,
    );
    return (cargoSelected || { cargos: 4 }).cargos;
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
