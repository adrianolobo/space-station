import Phaser from 'phaser/dist/phaser';
import BaseModule from './BaseModule';
import ModuleBuilder from './ModuleBuilder';
import collisionCategories from '../../../Constants/collisionCategories';

export default class SocialModule extends BaseModule {
  constructor(scene, parent, position, direction) {
    super(scene);
    this.parent = parent;
    this.position = position;
    this.direction = direction;
    this._createBaseModule('cargo-module');
    this._createSensor();
    this._createLights();
  }
  _createSensor() {
    let sensorSize = ModuleBuilder.getSize(this.baseModule);
    sensorSize.width *= 3;
    sensorSize.height -= 6;
    if (this.baseModule.angle === 90) {
      sensorSize = ModuleBuilder.invertSize(sensorSize);
    }
    this.sensor = this.scene.matter.add.rectangle(
      this.baseModule.x,
      this.baseModule.y,
      sensorSize.width,
      sensorSize.height,
      {
        isStatic: true,
        isSensor: true,
      },
    );
    this.sensor.collisionFilter.category = collisionCategories.SPACE_STATION;
    this.sensor.gameObject = { __self: this };
  }
  _createLights() {
    console.log(this.baseModule);
    const transformMatrix = this.baseModule.getWorldTransformMatrix();
    const halfHeight = this.baseModule.height / 2;
    this.pathLights = new Phaser.Curves.Path(
      transformMatrix.transformPoint(0, halfHeight).x,
      transformMatrix.transformPoint(0, halfHeight).y,
    );
    for (let i = 0; i < 10; i += 2) {
      this.pathLights.lineTo(
        transformMatrix.transformPoint(10 * i, halfHeight).x,
        transformMatrix.transformPoint(10 * i, halfHeight).y,
      );
    }
    this.flames = this.scene.add.particles('flares');
    this.flames.createEmitter({
      frame: 'yellow',
      scale: { start: 0.1, end: 0 },
      lifespan: 500,
      frequency: 200,
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: this.pathLights, quantity: 2, yoyo: false },
    });
  }
  collided(collider, collided) {
    if (collided === this.sensor) {
      const firstCoords = {};

      const colliderPos = ModuleBuilder.getPosition(collider.gameObject);
      const baseModulePos = ModuleBuilder.getPosition(this.baseModule);
      const baseModuleSize = ModuleBuilder.getSize(this.baseModule);
      const coord1 = this.baseModule.angle === 90 ? 'y' : 'x';
      const coord2 = this.baseModule.angle === 90 ? 'x' : 'y';
      if (colliderPos[coord1] > baseModulePos[coord1]) {
        firstCoords[coord1] = baseModulePos[coord1] + baseModuleSize.width;
      } else {
        firstCoords[coord1] = baseModulePos[coord1] - baseModuleSize.width;
      }
      firstCoords[coord2] = baseModulePos[coord2];
      collider.gameObject.__self.tractorBeam([
        firstCoords,
        { x: this.baseModule.x, y: this.baseModule.y },
      ]);
    }
    return this;
  }
}
