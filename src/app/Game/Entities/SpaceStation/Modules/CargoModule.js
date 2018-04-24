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
    console.log('this.sensor');
    console.log(this.sensor);
    console.log('****************');
    this.sensor.collisionFilter.category = collisionCategories.SPACE_STATION;
    this.sensor.gameObject = { __self: this };
  }
  collided(collider, collided) {
    console.log('CARGO MODULE');
    if (collided === this.sensor) {
      console.log('TRATOR BEEAAAMMM');
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
