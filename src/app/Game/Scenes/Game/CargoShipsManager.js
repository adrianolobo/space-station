import Phaser from 'phaser';
import CargoShip from '../../Entities/CargoShip/CargoShip';

export default class CargoShipsManager {
  constructor(scene, spawnTime = { min: 4000, max: 7000 }) {
    this.scene = scene;
    this.ships = [];
    this.activeShip = null;
    this.spawnTime = spawnTime;
    const sides = ['top', 'right', 'down', 'left'];
    this.isCreatingShips = true;
    this.spawnSequence = Phaser.Utils.Array.Shuffle(sides);
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
    this.spawnShips();
  }
  spawnShips() {
    if (!this.isCreatingShips) return;
    const timeout = Phaser.Math.Between(this.spawnTime.min, this.spawnTime.max);
    setTimeout(() => {
      this.newShip();
      this.spawnShips();
    }, timeout);
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
    const currentPosition = this.spawnSequence.shift();
    this.spawnSequence.push(currentPosition);
    const sceneWidth = this.scene.cameras.main.width;
    const sceneHeight = this.scene.cameras.main.height;
    const spawnMargin = 20;
    const rnd = Phaser.Math.Between;
    if (currentPosition === 'top') return { x: rnd(0, sceneWidth), y: -spawnMargin };
    if (currentPosition === 'right') return { x: sceneWidth + spawnMargin, y: rnd(0, sceneHeight) };
    if (currentPosition === 'down') return { x: rnd(0, sceneWidth), y: sceneHeight + spawnMargin };
    if (currentPosition === 'left') return { x: -spawnMargin, y: rnd(0, sceneHeight) };
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
