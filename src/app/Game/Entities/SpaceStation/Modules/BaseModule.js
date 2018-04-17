export default class BaseModule {
  constructor(scene) {
    this.scene = scene;
  }
  collided() {
    return this;
  }
  get baseModule() {
    return this._baseModule;
  }
  get connector() {
    return this._connector;
  }
}
