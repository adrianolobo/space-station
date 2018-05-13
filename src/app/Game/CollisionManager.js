export default class CollisionManager {
  constructor(scene) {
    this.scene = scene;
  }
  create() {
    this.scene.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        pair.bodyA.gameObject.__self.collided(pair.bodyB, pair.bodyA);
        pair.bodyB.gameObject.__self.collided(pair.bodyA, pair.bodyB);
      });
    });
  }
}
