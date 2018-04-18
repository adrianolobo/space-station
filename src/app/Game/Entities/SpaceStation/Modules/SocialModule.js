import BaseModule from './BaseModule';

export default class SocialModule extends BaseModule {
  constructor(scene, parent, position, direction) {
    super(scene);
    this.parent = parent;
    this.position = position;
    this.direction = direction;
    this._createBaseModule('social-module-1');
  }
}
