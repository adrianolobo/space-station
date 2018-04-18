export default class CollisionManager {
  constructor(scene) {
    this.scene = scene;
  }
  create() {
    this.scene.matter.world.on('collisionstart', (event) => {
      console.log(event.pairs[0].bodyA);
      console.log(event.pairs[0].bodyB);
      event.pairs.forEach((pair) => {
        console.log(pair);
        pair.bodyA.gameObject.__self.collided(pair.bodyB, pair.bodyA);
        pair.bodyB.gameObject.__self.collided(pair.bodyA, pair.bodyB);
      });
    });
  }
}
