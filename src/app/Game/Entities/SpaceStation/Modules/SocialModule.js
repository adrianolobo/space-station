// import Phaser from 'phaser/dist/phaser.min';
import BaseModule from './BaseModule';
import ModuleBuilder from './ModuleBuilder';

export default class SocialModule extends BaseModule {
  constructor(scene, parent, position, direction) {
    const moduleSprite = 'social-module-1';
    super(scene, parent, position, direction, moduleSprite);
    this.parent = parent;
    this.position = position;
    this.direction = direction;
    this._baseModule = this.scene.matter.add
      .sprite(0, 0, 'social-module-1')
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
  }

  get connector() {
    return this._connector;
  }
}
