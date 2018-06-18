export default class CollisionManager {
  constructor(scene) {
    this.scene = scene;
  }
  create() {
    this.scene.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA.gameObject.__self.collided) {
          pair.bodyA.gameObject.__self.collided(pair.bodyB, pair.bodyA);
        }
        if (pair.bodyB.gameObject.__self.collided) {
          pair.bodyB.gameObject.__self.collided(pair.bodyA, pair.bodyB);
        }
      });
    });
    this.scene.matter.world.on('collisionactive', (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA.gameObject.__self.colliding) {
          pair.bodyA.gameObject.__self.colliding(pair.bodyB, pair.bodyA);
        }
        if (pair.bodyB.gameObject.__self.colliding) {
          pair.bodyB.gameObject.__self.colliding(pair.bodyA, pair.bodyB);
        }
      });
    });
    this.scene.matter.world.on('collisionend', (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA.gameObject.__self.collideEnd) {
          pair.bodyA.gameObject.__self.collideEnd(pair.bodyB, pair.bodyA);
        }
        if (pair.bodyB.gameObject.__self.collideEnd) {
          pair.bodyB.gameObject.__self.collideEnd(pair.bodyA, pair.bodyB);
        }
      });
    });
  }
}
