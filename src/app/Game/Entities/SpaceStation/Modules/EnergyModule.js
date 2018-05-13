import BaseModule from './BaseModule';

export default class EnergyModule extends BaseModule {
  constructor(scene, position) {
    super(scene);
    this._baseModule = this.scene.matter.add
      .sprite(position.x, position.y, 'solar-module');
    this.solarPanel2 = this.scene.matter.add
      .sprite(0, 0, 'solar-panel');
    this.solarPanel2.setPosition(
      this._baseModule.x,
      this._baseModule.y - (this._baseModule.height / 2) - (this.solarPanel2.height / 2),
    );
    this.solarPanel1 = this.scene.matter.add
      .sprite(0, 0, 'solar-panel')
      .setFlipY(true);
    this.solarPanel1.setPosition(
      this._baseModule.x,
      this._baseModule.y + (this._baseModule.height / 2) + (this.solarPanel1.height / 2),
    );
    BaseModule.setDefaultCollisionCategories(this._baseModule);
    BaseModule.setDefaultCollisionCategories(this.solarPanel1);
    BaseModule.setDefaultCollisionCategories(this.solarPanel2);
    this._baseModule.__self = this;
    this.solarPanel1.__self = this;
    this.solarPanel2.__self = this;
  }
}
