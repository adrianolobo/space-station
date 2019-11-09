import Phaser from 'phaser/dist/phaser';
import collisionCategories from '../../Constants/collisionCategories';

export default class ProximitySensor {
  constructor(scene, cargoShip) {
    this.scene = scene;
    this.cargoShip = cargoShip;
    this.sensor = this.scene.matter.add.circle(
      0,
      0,
      this.cargoShip.width,
      {
        isSensor: true,
      },
    );
    this.source = new Phaser.Geom.Circle(0, 0, this.cargoShip.width);
    this.particles = this.scene.add.particles('flares');
    this.emitter = this.particles.createEmitter({
      frame: 'red',
      scale: { start: 0.05, end: 0.05 },
      lifespan: 100,
      frequency: 0,
      delay: 0,
      speed: { min: 0, max: 0 },
      blendMode: 'ADD',
      alpha: { start: 1, end: 1 },
      emitZone: { type: 'edge', source: this.source, quantity: 30, yoyo: false },
    });
    this.sensor.collisionFilter.category = collisionCategories.SHIP_PROXIMITY_SENSOR;
    this.sensor.gameObject = { __self: this };
    this.collisionActive = false;
    this.preventWarning = false;
  }
  colliding(collider) {
    if (collider.name === 'CARGO MODULE TRACTOR SENSOR') {
      return;
    }
    this.collisionActive = true;
  }
  update() {
    this.emitter.setPosition(this.cargoShip.x, this.cargoShip.y);
    this.sensor.position.x = this.cargoShip.x;
    this.sensor.position.y = this.cargoShip.y;
    if (this.collisionActive && !this.preventWarning) {
      this.activate();
      this.collisionActive = false;
    } else {
      this.stop();
    }
  }
  setPreventWarning(state) {
    this.preventWarning = state;
  }
  activate() {
    this.toggle(true);
  }
  stop() {
    this.toggle(false);
  }
  toggle(active) {
    this.emitter.on = active;
  }
  getSensor() {
    return this.sensor;
  }
  destroy() {
    this.emitter.destroy();
    this.particles.destroy();
  }
}
