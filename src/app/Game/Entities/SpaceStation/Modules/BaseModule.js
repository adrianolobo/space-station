import ModuleBuilder from './ModuleBuilder';
import collisionCategories from '../../../Constants/collisionCategories';
import depth from '../../../Constants/depth';
import gameScale from '../../../Constants/gameScale';

export default class BaseModule {
  constructor(scene) {
    this.scene = scene;
  }
  collided() {
    return this;
  }
  _createBaseModule(spriteName) {
    this._baseModule = this.scene.matter.add
      .sprite(0, 0, spriteName);
    this._baseModule.setScale(gameScale);
    this._connector = this.scene.matter.add
      .sprite(0, 0, 'connector-module');
    this._connector.setScale(gameScale);
    ModuleBuilder.modulePositioning(
      this.baseModule,
      this.connector,
      this.parent.baseModule,
      this.position,
      this.direction,
    );
    BaseModule.setDefaultCollisionCategories(this._connector);
    BaseModule.setDefaultCollisionCategories(this._baseModule);

    this.baseModule.setDepth(depth.BaseModule);
    this.connector.setDepth(depth.ModuleConnector);
    this.baseModule.__self = this;
    this.connector.__self = this;
  }
  get baseModule() {
    return this._baseModule;
  }
  get connector() {
    return this._connector;
  }
  static setDefaultCollisionCategories(body) {
    body.setCollisionCategory(collisionCategories.SPACE_STATION);
    body.setCollidesWith([
      collisionCategories.DEFAULT,
      collisionCategories.SPACE_SHIPS,
      collisionCategories.SHIP_PROXIMITY_SENSOR,
    ]);
  }
}
