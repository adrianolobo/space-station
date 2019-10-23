import BaseModule from './BaseModule';
import gameScale from '../../../Constants/gameScale';
import ModuleBuilder from './ModuleBuilder';

export default class EnergyModule extends BaseModule {
  constructor(scene, position, direction) {
    super(scene);
    this._direction = direction;
    this._baseModule = this.scene.matter.add
      .sprite(position.x, position.y, 'solar-module')
      .setScale(gameScale);
    if (direction === 'vertical') {
      this._baseModule.setAngle(90);
    }

    this._positionSolarPanels();
    BaseModule.setDefaultCollisionCategories(this._baseModule);
    BaseModule.setDefaultCollisionCategories(this.solarPanel1);
    BaseModule.setDefaultCollisionCategories(this.solarPanel2);
    this._baseModule.__self = this;
    this.solarPanel1.__self = this;
    this.solarPanel2.__self = this;
  }
  _positionSolarPanels() {
    const baseModuleSize = ModuleBuilder.getSize(this._baseModule);

    this.solarPanel2 = this.scene.matter.add
      .sprite(0, 0, 'solar-panel')
      .setScale(gameScale);
    this.solarPanel1 = this.scene.matter.add
      .sprite(0, 0, 'solar-panel')
      .setFlipY(true)
      .setScale(gameScale);
    if (this._direction === 'vertical') {
      // baseModuleSize = ModuleBuilder.invertSize(baseModuleSize);
      this.solarPanel1.setAngle(90);
      this.solarPanel2.setAngle(90);

      this.solarPanel2.setPosition(
        this._baseModule.x + (baseModuleSize.height / 2) +
                                              (this.solarPanel2.displayHeight / 2),
        this._baseModule.y,
      );
      this.solarPanel1.setPosition(
        this._baseModule.x - (baseModuleSize.height / 2) -
                                              (this.solarPanel2.displayHeight / 2),
        this._baseModule.y,
      );
      return;
    }
    this.solarPanel2.setPosition(
      this._baseModule.x,
      this._baseModule.y - (baseModuleSize.height / 2) -
                                                          (this.solarPanel2.displayHeight / 2),
    );

    this.solarPanel1.setPosition(
      this._baseModule.x,
      this._baseModule.y + (baseModuleSize.height / 2) +
                                                          (this.solarPanel1.displayHeight / 2),
    );
  }
}
