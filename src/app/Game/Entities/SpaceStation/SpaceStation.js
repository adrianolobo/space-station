import EnergyModule from './Modules/EnergyModule';
import SocialModule from './Modules/SocialModule';

export default class SpaceStation {
  constructor(scene) {
    this.scene = scene;

    this.path = null;
    this.spaceStation = [];
    this.spaceStation.push(new EnergyModule(scene, { x: 300, y: 200 }));
    this.spaceStation.push(
      new SocialModule(
        scene,
        this.spaceStation[0].getBaseModule(),
        'left',
        'horizontal',
      ),
    );
    this.spaceStation.push(
      new SocialModule(
        scene,
        this.spaceStation[1].getBaseModule(),
        'left',
        'horizontal',
      ),
    );
    /*
    this.spaceStation.setBody({
      type: 'circle',
      radius: 134,
    });
    this.spaceStation.setStatic(true);
    console.log(this.spaceStation);

    this.cargoBays = {
      cargoBay1: {
        wall1: this.scene.matter.add.sprite((200 + 134 + 35) - 5, 200 + 25, 'cargo-bay-wall'),
        sensor: this.scene.matter.add.rectangle(420, 200, 50, 65, {
          isStatic: true,
          isSensor: true,
        }),
        wall2: this.scene.matter.add.sprite((200 + 134 + 35) - 5, 200 - 25, 'cargo-bay-wall'),
      },
    };
    this.cargoBays.cargoBay1.wall1.setStatic(true);
    this.cargoBays.cargoBay1.wall2.setStatic(true);
    console.log(this.cargoBays.cargoBay1.sensor);
    this.spaceStation.name = 'SpaceStation';

    this.spaceStation.__self = this;
    this.cargoBays.cargoBay1.sensor.gameObject = { __self: this };
    this.cargoBays.cargoBay1.wall1.__self = this;
    this.cargoBays.cargoBay1.wall2.__self = this;
    */
  }
  update() {
    return this;
  }
  collided(collider, objectCollided) {
    if (objectCollided === this.cargoBays.cargoBay1.sensor) {
      console.log('AEEEEEEEEEEEEEE');
      const sensorPosition = this.cargoBays.cargoBay1.sensor.position;
      const enterCoords = [
        sensorPosition,
        { x: sensorPosition.x - 100, y: sensorPosition.y },
      ];
      const leaveCoords = [this.cargoBays.cargoBay1.sensor.position];
      collider.gameObject.__self.tractorBeam(enterCoords, leaveCoords);
      return;
    }
    console.log('UUUUUUUUUUUUUUU');
  }
}
