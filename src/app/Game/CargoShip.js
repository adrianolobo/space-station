import Phaser from 'phaser/dist/phaser';

export default class CargoShip {
  constructor(scene) {
    this.scene = scene;

    this.path = null;
    this.sprite = this.scene.matter.add.sprite(400, 300, 'cargo-ship');
    this.sprite.name = 'CargoShip';
    this.sprite.setInteractive();
    this.sprite.setFrictionAir(0);

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
      return;
    }
    const point = this.path.curves[0].p0;
    const spritePos = { x: this.sprite.x, y: this.sprite.y };
    const angle = Phaser.Math.Angle.BetweenPoints(spritePos, point);
    this.sprite.setVelocityX(Math.cos(angle));
    this.sprite.setVelocityY(Math.sin(angle));
    const distance = Phaser.Math.Distance.Between(point.x, point.y, spritePos.x, spritePos.y);
    if (distance < 1) {
      this.path.curves.shift();
    }
    let angleToTurn = 0;
    if (this.sprite.body.angle > (angle + 0.02)) {
      angleToTurn = this.sprite.body.angle - 0.07;
    } else if (this.sprite.body.angle < (angle - 0.02)) {
      angleToTurn = this.sprite.body.angle + 0.07;
    } else {
      angleToTurn = angle;
    }
    this.sprite.setAngle(Phaser.Math.RadToDeg(angleToTurn));
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
    return this.sprite === sprite;
  }
}
