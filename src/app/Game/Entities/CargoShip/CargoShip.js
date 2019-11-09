import Phaser from 'phaser/dist/phaser';
import collisionCategories from '../../Constants/collisionCategories';
import depth from '../../Constants/depth';
import EngineFlames from './EngineFlames';
import ProximitySensor from './ProximitySensor';
import gameScale from '../../Constants/gameScale';

const CARGO_SHIP_STATES = {
  MOVING: 'moving',
  TRACTOR: 'tractor',
  UNLOADING: 'unloading',
  UNLOADED: 'unloaded',
};

const TIME_PER_CARGO = 1000;
const TIME_INVINCIBILITY_AFTER_UNLOAD = 3000;

export default class CargoShip {
  constructor(scene, position, amountCargos = 6) {
    this.scene = scene;

    this.state = CARGO_SHIP_STATES.MOVING;
    this.amountCargos = amountCargos;

    this.path = null;
    this.cargoShipImage = this.scene.add.image(0, 0, 'cargo-ship');
    this.cargoShipImage.setScale(gameScale);
    this.addCargos();
    this.cargoShipContainer = this.scene.add.container(position.x, position.y, [
      this.cargoShipImage,
      ...this.cargos,
    ]);
    this.cargoShipContainer.setDepth(depth.CargoShip);
    this.cargoShipContainer.setSize(this.cargoShipImage.width, this.cargoShipImage.height);
    this.cargoShip = this.scene.matter.add.gameObject(this.cargoShipContainer);
    this.cargoShip.__self = this;
    this.cargoShip.name = 'CargoShip';
    const hitArea = new Phaser.Geom.Rectangle(0, 0,
      this.cargoShipImage.width,
      this.cargoShipImage.height,
    );
    this.cargoModuleUnloading = null;
    this.cargoShip.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    this.cargoShip.setFrictionAir(0);
    this.cargoShip.setCollisionCategory(collisionCategories.SPACE_SHIPS);
    this.setCollidesWithDefault();
    this.graphics = this.scene.add.graphics();
    this.proximitySensor = new ProximitySensor(this.scene, this.cargoShip);
    this.engineFlames = new EngineFlames(this.scene, this.cargoShip, this.cargoShipImage);
  }
  get velocity() {
    const velocities = [0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];
    return velocities[this.amountCargos] || 0.05;
  }
  get position() {
    return {
      x: this.cargoShip.x,
      y: this.cargoShip.y,
    };
  }
  checkOutside(safeArea = 0) {
    const camWidth = this.scene.cameras.main.width;
    const camHeight = this.scene.cameras.main.height;
    if (this.position.x > camWidth + safeArea) return true;
    if (this.position.x < -safeArea) return true;
    if (this.position.y > camHeight - safeArea) return true;
    if (this.position.y < safeArea) return true;
    return false;
  }
  get isOutsideView() {
    return this.checkOutside();
  }
  get isAllOutsideView() {
    const shipImage = this.cargoShipImage;
    const shipLargerMetric = Math.max(shipImage.displayWidth, shipImage.displayHeight);
    return this.checkOutside(shipLargerMetric);
  }
  get isInView() {
    return !this.isOutsideView;
  }
  addCargos() {
    this.cargos = [];
    for (let i = 0; i < this.amountCargos; i += 1) {
      const cargoSprite = i % 2 ? 'cargo-red' : 'cargo-blue';
      const cargo = this.scene.add.image(0, 0, cargoSprite).setOrigin(0, 0).setScale(gameScale);
      this.cargos.push(cargo);
    }
    const shipSize = {
      width: this.cargoShipImage.displayWidth,
      height: this.cargoShipImage.displayHeight,
    };
    const originX = -(this.cargoShipImage.displayWidth / 2);
    const originY = -(this.cargoShipImage.displayHeight / 2);
    const startPadding = 5;
    const paddingCargoX = 1;
    const halfLength = this.cargos.length / 2;
    this.cargos.forEach((cargo, key) => {
      const isSecondHalf = key >= halfLength;
      const mutliplierX = isSecondHalf ? this.cargos.length - key - 1 : key;
      const positionY = isSecondHalf ? (shipSize.height / 2) - cargo.displayHeight : originY;
      const cargoMutiPos = ((paddingCargoX + cargo.displayWidth) * mutliplierX);
      const positionX = originX + startPadding + cargoMutiPos;
      cargo.setPosition(positionX, positionY);
    });
  }
  update() {
    this.graphics.clear();
    if (this.path) {
      this.graphics.lineStyle(2, 0xffffff, 0.4);
      this.path.draw(this.graphics);
    }
    this._move();
    this.engineFlames.handleEmitter(this.state === CARGO_SHIP_STATES.UNLOADING);
    this.proximitySensor.update();
  }
  _move() {
    if (((this.path || {}).curves || []).length === 0) {
      if (this.state === CARGO_SHIP_STATES.TRACTOR) {
        this.setUnloadingState();
      }
      return;
    }
    const point = this.path.curves[0].p1;
    this.turnTo(point);
    this.goFoward();
    const spritePos = { x: this.cargoShipContainer.x, y: this.cargoShipContainer.y };
    const distance = Phaser.Math.Distance.Between(point.x, point.y, spritePos.x, spritePos.y);
    if (distance < 1) {
      this.path.curves.shift();
    }
    /*
    let angleToTurn = 0;
    if (this.cargoShip.body.angle > (angle + 0.02)) {
      angleToTurn = this.cargoShip.body.angle - 0.07;
    } else if (this.cargoShip.body.angle < (angle - 0.02)) {
      angleToTurn = this.cargoShip.body.angle + 0.07;
    } else {
      angleToTurn = angle;
    }
    */
  }
  turnTo(point) {
    const spritePos = { x: this.cargoShip.x, y: this.cargoShip.y };
    const angle = Phaser.Math.Angle.BetweenPoints(spritePos, point);
    const degAngle = Phaser.Math.RadToDeg(angle);
    this.cargoShip.setAngle(degAngle);
  }
  goFoward() {
    this.cargoShip.setVelocityX(Math.cos(this.cargoShip.rotation) * this.velocity);
    this.cargoShip.setVelocityY(Math.sin(this.cargoShip.rotation) * this.velocity);
  }
  beginPath(position) {
    this.path = new Phaser.Curves.Path(position.x, position.y);
  }
  movePath(position) {
    if (!this.path) {
      this.beginPath(position);
    }
    let lastLine = this.path.getEndPoint();
    const distance = Phaser.Math.Distance.Between(
      lastLine.x, lastLine.y,
      position.x, position.y,
    );
    const MAX_DISTANCE = 10;
    if (distance > MAX_DISTANCE) {
      const amount = Math.floor(distance / MAX_DISTANCE);
      for (let i = 1; i <= amount; i += 1) {
        lastLine = this.path.getEndPoint();
        const deltaY = position.y - lastLine.y;
        const deltaX = position.x - lastLine.x;
        const angle = Math.atan2(deltaY, deltaX);
        this.path.lineTo(
          lastLine.x + (Math.cos(angle) * MAX_DISTANCE),
          lastLine.y + (Math.sin(angle) * MAX_DISTANCE),
        );
      }
      this.path.lineTo(position.x, position.y);
    }
  }
  requestUserMove(position, state) {
    if (this.canUserControl()) {
      if (state === 'begin') {
        this.beginPath(position);
      }
      this.movePath(position);
    }
  }
  checkSprite(sprite) {
    return this.cargoShip === sprite;
  }
  tractorBeam(enterCoords, cargoModule) {
    if (this.state !== CARGO_SHIP_STATES.MOVING) {
      return;
    }
    this.cargoModuleUnloading = cargoModule;
    this.cargoModuleUnloading.setBusy(true);
    this.resetPath();
    this.setCollidesWithShips();
    this.setState(CARGO_SHIP_STATES.TRACTOR);
    this.proximitySensor.setPreventWarning(true);
    this.beginPath({ x: this.cargoShip.x, y: this.cargoShip.y });
    enterCoords.forEach((coord) => {
      this.movePath(coord);
    });
  }
  setCollidesWithDefault() {
    this.cargoShip.setCollidesWith([
      collisionCategories.DEFAULT,
      collisionCategories.SPACE_SHIPS,
      collisionCategories.SPACE_STATION,
      collisionCategories.TRACTOR_SENSOR,
    ]);
  }
  setCollidesWithShips() {
    this.cargoShip.setCollidesWith([
      collisionCategories.SPACE_SHIPS,
    ]);
  }
  resetPath() {
    this.path = null;
  }
  setUnloadingState() {
    this.setState(CARGO_SHIP_STATES.UNLOADING);
    this.cargoShip.setVelocity(0, 0);
    setTimeout(() => {
      this.setUnloadedState();
      this.cargoModuleUnloading.setBusy(false);
      this.cargoModuleUnloading = null;
      this.amountCargos = 0;
      this.goFoward();
      setTimeout(() => {
        this.setCollidesWithDefault();
        this.proximitySensor.setPreventWarning(false);
      }, TIME_INVINCIBILITY_AFTER_UNLOAD);
    }, this.amountCargos * TIME_PER_CARGO);
    let cargoToRemoveIndex = this.cargos.length - 1;
    const unloadInterval = setInterval(() => {
      this.cargos[cargoToRemoveIndex].destroy();
      cargoToRemoveIndex -= 1;
      if (cargoToRemoveIndex === -1) {
        clearInterval(unloadInterval);
      }
    }, TIME_PER_CARGO);
  }
  destroy() {
    this.cargoShipContainer.destroy();
    this.cargoShipImage.destroy();
    this.cargoShip.destroy();
    this.cargos.forEach(cargo => cargo.destroy());
    this.graphics.destroy();
    this.proximitySensor.destroy();
    this.engineFlames.destroy();
  }
  setUnloadedState() {
    this.setState(CARGO_SHIP_STATES.UNLOADED);
  }
  setState(state) {
    this.state = state;
  }
  canUserControl() {
    return this.state === CARGO_SHIP_STATES.MOVING || this.state === CARGO_SHIP_STATES.UNLOADED;
  }
  get isUnloaded() {
    return this.state === CARGO_SHIP_STATES.UNLOADED;
  }
  collided(bodyCollided) {
    if (bodyCollided.isSensor) return false;
    if (this.state === CARGO_SHIP_STATES.MOVING || this.state === CARGO_SHIP_STATES.UNLOADED) alert('GAME OVER');
    return this;
  }
}
