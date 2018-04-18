import ModuleBuilder from './ModuleBuilder';

export default class BaseModule {
  constructor(scene) {
    this.scene = scene;
  }
  collided() {
    return this;
  }
  _createBaseModule(spriteName) {
    this._baseModule = this.scene.matter.add
      .sprite(0, 0, spriteName)
      .setStatic(true);
    this._connector = this.scene.matter.add
      .sprite(0, 0, 'connector-module')
      .setStatic(true);
    ModuleBuilder.modulePositioning(
      this.baseModule,
      this.connector,
      this.parent.baseModule,
      this.position,
      this.direction,
    );
    this.baseModule.__self = this;
    this.connector.__self = this;
  }
  get baseModule() {
    return this._baseModule;
  }
  get connector() {
    return this._connector;
  }
}
