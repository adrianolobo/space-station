export default class BaseModule {
  constructor(scene) {
    this.scene = scene;
  }
  collided() {
    return this;
  }
}
