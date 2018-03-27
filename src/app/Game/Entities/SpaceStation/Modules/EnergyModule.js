import BaseModule from './BaseModule';

export default class EnergyModule extends BaseModule {
  constructor(scene, position) {
    super(scene);
    this.solarModule = this.scene.matter.add
      .sprite(position.x, position.y, 'solar-module')
      .setStatic(true);
    console.log(this.solarModule);
    this.solarPanel2 = this.scene.matter.add
      .sprite(0, 0, 'solar-panel')
      .setStatic(true);
    this.solarPanel2.setPosition(
      this.solarModule.x,
      this.solarModule.y - (this.solarModule.height / 2) - (this.solarPanel2.height / 2),
    );
    this.solarPanel1 = this.scene.matter.add
      .sprite(0, 0, 'solar-panel')
      .setStatic(true)
      .setFlipY(true);
    this.solarPanel1.setPosition(
      this.solarModule.x,
      this.solarModule.y + (this.solarModule.height / 2) + (this.solarPanel1.height / 2),
    );
    this.solarModule.__self = this;
    this.solarPanel1.__self = this;
    this.solarPanel2.__self = this;
  }
  getBaseModule() {
    return this.solarModule;
  }
}
