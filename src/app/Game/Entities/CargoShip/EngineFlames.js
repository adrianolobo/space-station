import depth from '../../Constants/depth';

const EMITTER_LIFESPAN = 40;

export default class EngineFlames {
  constructor(scene, cargoShip, cargoShipImage) {
    this.scene = scene;
    this.cargoShip = cargoShip;
    this.cargoShipImage = cargoShipImage;

    this.flames = this.scene.add.particles('flares');
    this.flames.setDepth(depth.CargoShip);
    const emitterConfig = {
      frame: 'yellow',
      lifespan: EMITTER_LIFESPAN,
      speed: { min: 0, max: 300 },
      scale: { start: 0.06, end: 0 },
      blendMode: 'ADD',
    };
    this.emitters = [
      this.flames.createEmitter(emitterConfig),
      this.flames.createEmitter(emitterConfig),
    ];
  }
  destroy() {
    this.emitters.forEach(emitter => emitter.destroy());
    this.flames.destroy();
  }
  handleEmitter(emitterStopped) {
    if (emitterStopped) {
      this.emitters.forEach((e) => { e.lifespan.propertyValue = 0; });
    } else {
      this.emitters.forEach((e) => { e.lifespan.propertyValue = EMITTER_LIFESPAN; });
    }
    const emitterAngle = (this.cargoShip.angle + 180) % 360;
    const cargoShipTransformMatrix = this.cargoShipImage.getWorldTransformMatrix();
    this.emitters.forEach((e) => { e.setAngle(emitterAngle); });
    const halfWidth = this.cargoShip.width / 2;
    const halfHeight = this.cargoShip.height / 2;
    const offset = 4;
    this.emitters[0].setPosition(
      cargoShipTransformMatrix.transformPoint(-halfWidth, -halfHeight + offset).x,
      cargoShipTransformMatrix.transformPoint(-halfWidth, -halfHeight + offset).y,
    );
    this.emitters[1].setPosition(
      cargoShipTransformMatrix.transformPoint(-halfWidth, +halfHeight - offset).x,
      cargoShipTransformMatrix.transformPoint(-halfWidth, +halfHeight - offset).y,
    );
  }
}
