import gameScale from '../Constants/gameScale';

export default class OutsideArrow {
  constructor(scene, ship) {
    this.scene = scene;
    this.ship = ship;

    this.outsideArrowImage = this.scene.add.image(0, 0, 'outside-arrow');
    this.outsideArrowImage.setScale(gameScale);
    this.outsideArrowImage.setOrigin(1, 0.5);
    this.setPosition();
  }
  setPosition() {
    const shipPosition = this.ship.position;
    const camWidth = this.scene.cameras.main.width;
    const camHeight = this.scene.cameras.main.height;
    if (shipPosition.y < 0) {
      this.outsideArrowImage.x = shipPosition.x;
      this.outsideArrowImage.y = 0;
      this.outsideArrowImage.setAngle(270);
      return;
    }
    if (shipPosition.y > camHeight) {
      this.outsideArrowImage.x = shipPosition.x;
      this.outsideArrowImage.y = camHeight;
      this.outsideArrowImage.setAngle(90);
      return;
    }
    if (shipPosition.x < 0) {
      this.outsideArrowImage.x = 0;
      this.outsideArrowImage.y = shipPosition.y;
      this.outsideArrowImage.setAngle(180);
      return;
    }
    if (shipPosition.x > camWidth) {
      this.outsideArrowImage.x = camWidth;
      this.outsideArrowImage.y = shipPosition.y;
      this.outsideArrowImage.setAngle(0);
    }
  }
  destroy() {
    this.outsideArrowImage.destroy();
  }
  static preload(scene) {
    scene.load.image('outside-arrow', '/static/img/outside-arrow.png');
  }
}
