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
    const transformMatrix = this.baseModule.getWorldTransformMatrix();
    const halfHeight = this.baseModule.height / 2;
    const lightsPositionMargin = 3;
    const lightsSize = (this.baseModule.width * 1.5) / 10;

    this.flames = this.scene.add.particles('flares');
    this.pathLights = [];
    this.lightEmitters = [];
    const _createLight = (xMargin, hPos, color) => {
      const lightPath = new Phaser.Curves.Path(
        transformMatrix.transformPoint(0, hPos).x,
        transformMatrix.transformPoint(0, hPos).y,
      );
      for (let i = 0; i < lightsSize; i += 2) {
        lightPath.lineTo(
          transformMatrix.transformPoint(xMargin * i, hPos).x,
          transformMatrix.transformPoint(xMargin * i, hPos).y,
        );
      }
      const lightEmitter = this.flames.createEmitter({
        frame: color,
        scale: { start: 0.05, end: 0 },
        lifespan: 500,
        frequency: 200,
        blendMode: 'ADD',
        alpha: { start: 1, end: 1 },
        emitZone: { type: 'edge', source: lightPath, quantity: 2, yoyo: false },
      });
      this.pathLights.push(lightPath);
      this.lightEmitters.push(lightEmitter);
    };
    _createLight(10, halfHeight - lightsPositionMargin, 'yellow');
    _createLight(10, -halfHeight + lightsPositionMargin, 'blue');
    _createLight(-10, -halfHeight + lightsPositionMargin, 'blue');
    _createLight(-10, halfHeight - lightsPositionMargin, 'yellow');
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
