import Phaser from 'phaser/dist/phaser';
import collisionCategories from '../Constants/collisionCategories';

const CARGO_SHIP_STATES = {
  MOVING: 'moving',
  TRACTOR: 'tractor',
  UNLOADING: 'unloading',
  UNLOADED: 'unloaded',
};

const TIME_PER_CARGO = 1000;

export default class CargoShip {
  constructor(scene, position) {
    this.scene = scene;

    this.state = CARGO_SHIP_STATES.MOVING;
    this.amountCargos = 4;

    this.path = null;
    this.cargoShip = this.scene.matter.add.sprite(position.x, position.y, 'cargo-ship');
    this.cargoShip.__self = this;
    this.cargoShip.name = 'CargoShip';
    this.cargoShip.setInteractive();
    this.cargoShip.setFrictionAir(0);
    this.cargoShip.setCollisionCategory(collisionCategories.SPACE_SHIPS);
    this.setCollidesWithDefault();
    this.graphics = this.scene.add.graphics();
  }
  update() {
    this.graphics.clear();
    if (this.path) {
      this.graphics.lineStyle(2, 0xffffff, 1);
      this.path.draw(this.graphics);
    }
    this._move();
  }
  _move() {
    if (((this.path || {}).curves || []).length === 0) {
      if (this.state === CARGO_SHIP_STATES.TRACTOR) {
        this.setUnloadingState();
      }
      return;
    }
    const point = this.path.curves[0].p0;
    const spritePos = { x: this.cargoShip.x, y: this.cargoShip.y };
    const angle = Phaser.Math.Angle.BetweenPoints(spritePos, point);
    this.cargoShip.setAngle(Phaser.Math.RadToDeg(angle));
    this.goFoward();
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
  goFoward() {
    this.cargoShip.setVelocityX(Math.cos(this.cargoShip.rotation));
    this.cargoShip.setVelocityY(Math.sin(this.cargoShip.rotation));
  }
  beginPath(position) {
    this.path = new Phaser.Curves.Path(position.x, position.y);
  }
  movePath(position) {
    if (!this.path) {
      return;
    }
    const lastLine = this.path.getEndPoint();
    const distance = Phaser.Math.Distance.Between(
      lastLine.x, lastLine.y,
      position.x, position.y,
    );
    const MAX_DISTANCE = 10;
    if (distance > MAX_DISTANCE) {
      const amount = Math.floor(distance / MAX_DISTANCE);
      for (let i = 0; i < amount; i += 1) {
        const deltaY = position.y - lastLine.y;
        const deltaX = position.x - lastLine.x;
        const angle = Math.atan2(deltaY, deltaX);
        this.path.lineTo(
          lastLine.x + (Math.cos(angle) * MAX_DISTANCE * (i + 1)),
          lastLine.y + (Math.sin(angle) * MAX_DISTANCE * (i + 1)),
        );
      }
    }
  }
  endPath(position) {
    this.path.lineTo(position.x, position.y);
  }
  checkSprite(sprite) {
    return this.cargoShip === sprite;
  }
  tractorBeam(enterCoords) {
    if (this.state !== CARGO_SHIP_STATES.MOVING) {
      return;
    }
    this.setCollidesWithShips();
    this.setState(CARGO_SHIP_STATES.TRACTOR);
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
    ]);
  }
  setCollidesWithShips() {
    this.cargoShip.setCollidesWith([
      collisionCategories.SPACE_SHIPS,
    ]);
  }
  setUnloadingState() {
    this.setState(CARGO_SHIP_STATES.UNLOADING);
    this.cargoShip.setVelocity(0, 0);
    setTimeout(() => {
      this.setUnloadedState();
      this.goFoward();
    }, this.amountCargos * TIME_PER_CARGO);
  }
  setUnloadedState() {
    this.setState(CARGO_SHIP_STATES.UNLOADED);
  }
  setState(state) {
    this.state = state;
  }
  collided() {
    return this;
  }
}
