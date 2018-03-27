import BaseModule from './BaseModule';

export default class SocialModule extends BaseModule {
  constructor(scene, relativeTo, side, direction) {
    super(scene);
    const originX = side === 'left' ? 1 : 0;
    const originY = 0.5;
    // TODO DEIXAR ESSE CALCULO TODO GENÉRICO
    this.connectorModule = this.scene.matter.add
      .sprite(0, 0, 'connector-module')
      .setStatic(true)
      .setOrigin(originX, originY);
    console.log(origin);
    let relativeBounds = relativeTo.getBounds();
    this.connectorModule.setPosition(
      relativeBounds.x,
      relativeBounds.y + (relativeBounds.height / 2),
    );
    console.log(this.connectorModule);
    this.socialModule = this.scene.matter.add
      .sprite(0, 0, 'social-module-1')
      .setStatic(true)
      .setOrigin(originX, originY);
    relativeBounds = this.connectorModule.getBounds();
    this.socialModule.setPosition(
      relativeBounds.x,
      relativeBounds.y + (relativeBounds.height / 2),
    );
    console.log(direction);
    this.socialModule.__self = this;
    this.connectorModule.__self = this;
  }
  getBaseModule() {
    return this.socialModule;
  }
}
