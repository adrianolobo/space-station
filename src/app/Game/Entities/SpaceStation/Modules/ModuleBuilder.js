export default {
  modulePositioning(newModule, connector, parent, position, direction) {
    let parentSize = this._getSize(parent);
    if (parent.angle === 90) {
      parentSize = this._invertSize(parentSize);
    }
    let connectorSize = this._getSize(connector);
    if (position === 'top' || position === 'bottom') {
      connector.setAngle(90);
      connectorSize = this._invertSize(connectorSize);
    }
    const parentPos = this._getPosition(parent);
    const connectorPos = this._calcPosition(connectorSize, parentSize, parentPos, position);
    connector.setPosition(connectorPos.x, connectorPos.y);

    let moduleSize = this._getSize(newModule);
    if (direction === 'vertical') {
      moduleSize = this._invertSize(moduleSize);
      newModule.setAngle(90);
    }
    const newModulePos = this._calcPosition(moduleSize, connectorSize, connectorPos, position);
    newModule.setPosition(newModulePos.x, newModulePos.y);
  },
  _calcPosition(moduleSize, parentSize, parentPos, position) {
    const modulePosition = { x: parentPos.x, y: parentPos.y };

    const parentHalfWidth = this._getRoundedHalf(parentSize.width);
    const parentHalfHeight = this._getRoundedHalf(parentSize.height);

    const moduleHalfWidth = this._getRoundedHalf(moduleSize.width);
    const moduleHalfHeight = this._getRoundedHalf(moduleSize.height);
    if (position === 'left') {
      modulePosition.x = parentPos.x - parentHalfWidth - moduleHalfWidth;
    } else if (position === 'right') {
      modulePosition.x = parentPos.x + parentHalfWidth + moduleHalfWidth;
    } else if (position === 'top') {
      modulePosition.y = parentPos.y - parentHalfHeight - moduleHalfHeight;
    } else if (position === 'bottom') {
      modulePosition.y = parentPos.y + parentHalfHeight + moduleHalfHeight;
    }
    return modulePosition;
  },
  _getPosition(target) {
    return { x: target.x, y: target.y };
  },
  _getSize(target) {
    return { width: target.width, height: target.height };
  },
  _invertSize(target) {
    return { width: target.height, height: target.width };
  },
  _getRoundedHalf(target) {
    return Math.floor(target / 2);
  },
};
