export default {
  modulePositioning(newModule, connector, parent, position, direction) {
    let parentSize = this.getSize(parent);
    if (parent.angle === 90) {
      parentSize = this.invertSize(parentSize);
    }
    let connectorSize = this.getSize(connector);
    if (position === 'top' || position === 'bottom') {
      connector.setAngle(90);
      connectorSize = this.invertSize(connectorSize);
    }
    const parentPos = this.getPosition(parent);
    const connectorPos = this.calcPosition(connectorSize, parentSize, parentPos, position);
    connector.setPosition(connectorPos.x, connectorPos.y);

    let moduleSize = this.getSize(newModule);
    if (direction === 'vertical') {
      moduleSize = this.invertSize(moduleSize);
      newModule.setAngle(90);
    }
    const newModulePos = this.calcPosition(moduleSize, connectorSize, connectorPos, position);
    newModule.setPosition(newModulePos.x, newModulePos.y);
  },
  calcPosition(moduleSize, parentSize, parentPos, position) {
    const modulePosition = { x: parentPos.x, y: parentPos.y };

    const parentHalfWidth = this.getRoundedHalf(parentSize.width);
    const parentHalfHeight = this.getRoundedHalf(parentSize.height);

    const moduleHalfWidth = this.getRoundedHalf(moduleSize.width);
    const moduleHalfHeight = this.getRoundedHalf(moduleSize.height);
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
  getPosition(target) {
    return { x: target.x, y: target.y };
  },
  getSize(target) {
    return { width: target.width, height: target.height };
  },
  invertSize(target) {
    return { width: target.height, height: target.width };
  },
  invertPosition(target) {
    return { x: target.y, y: target.x };
  },
  getRoundedHalf(target) {
    return Math.floor(target / 2);
  },
};
