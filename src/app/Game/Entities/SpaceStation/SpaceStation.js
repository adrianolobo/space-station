import EnergyModule from './Modules/EnergyModule';
import SocialModule from './Modules/SocialModule';
import CargoModule from './Modules/CargoModule';

export default class SpaceStation {
  constructor(scene) {
    this.scene = scene;

    this.path = null;
    this.spaceStation = [];
    const gameConfig = this.scene.scene.systems.game.config;
    this.spaceStation.push(new EnergyModule(scene, {
      x: gameConfig.width / 2,
      y: gameConfig.height / 2,
    }));
    this.spaceStation[1] = new SocialModule(scene, this.spaceStation[0], 'left', 'horizontal');
    this.spaceStation[2] = new SocialModule(scene, this.spaceStation[1], 'left', 'vertical');
    this.spaceStation[3] = new CargoModule(scene, this.spaceStation[2], 'left', 'vertical');

    this.spaceStation[4] = new SocialModule(scene, this.spaceStation[0], 'right', 'horizontal');
    this.spaceStation[5] = new SocialModule(scene, this.spaceStation[4], 'right', 'horizontal');
    this.spaceStation[6] = new SocialModule(scene, this.spaceStation[5], 'right', 'vertical');
    this.spaceStation[7] = new CargoModule(scene, this.spaceStation[6], 'bottom', 'horizontal');
  }
  update() {
    return this;
  }
  collided(collider, objectCollided) {
    if (objectCollided === this.cargoBays.cargoBay1.sensor) {
      const sensorPosition = this.cargoBays.cargoBay1.sensor.position;
      const enterCoords = [
        sensorPosition,
        { x: sensorPosition.x - 100, y: sensorPosition.y },
      ];
      const leaveCoords = [this.cargoBays.cargoBay1.sensor.position];
      collider.gameObject.__self.tractorBeam(enterCoords, leaveCoords);
    }
  }
}
