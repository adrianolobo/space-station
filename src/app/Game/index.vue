<template>
  <div class="hello" ref="gameCanvasContainer">
  </div>
</template>

<script>
import Phaser from 'phaser/dist/phaser';

let graphics;
let path;
let linePath = [];
let isDrawing = false;
let ship;

export default {
  mounted() {
    const config = {
      parent: this.$refs.gameCanvasContainer,
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'matter',
        matter: {
          gravity: {
            x: 0,
            y: 0,
          },
        },
      },
      scene: {
        preload() {
          this.load.image('cargo-ship', '/static/img/cargo-ship.png');
        },
        create() {
          graphics = this.add.graphics();
          ship = this.matter.add.sprite(400, 300, 'cargo-ship');

          console.log(ship);
          this.input.on('pointerdown', (pointer) => {
            linePath.push({
              x: pointer.position.x,
              y: pointer.position.y,
            });
            isDrawing = true;
          });
          this.input.on('pointermove', (pointer) => {
            if (isDrawing) {
              const lastLine = linePath[linePath.length - 1];
              const pointerPos = pointer.position;
              const distance = Phaser.Math.Distance.Between(
                lastLine.x, lastLine.y,
                pointerPos.x, pointerPos.y,
              );
              console.log(distance);
              const MAX_DISTANCE = 10;
              if (distance > MAX_DISTANCE) {
                const amount = Math.floor(distance / MAX_DISTANCE);
                console.log(amount);
                for (let i = 0; i < amount; i += 1) {
                  const deltaY = pointerPos.y - lastLine.y;
                  const deltaX = pointerPos.x - lastLine.x;
                  const angle = Math.atan2(deltaY, deltaX);
                  linePath.push({
                    x: lastLine.x + (Math.cos(angle) * MAX_DISTANCE * (i + 1)),
                    y: lastLine.y + (Math.sin(angle) * MAX_DISTANCE * (i + 1)),
                  });
                }
                console.log('AEEEEE');
              }
            }
          });
          this.input.on('pointerup', (pointer) => {
            linePath.push({
              x: pointer.position.x,
              y: pointer.position.y,
            });
            isDrawing = false;
            linePath = [];
          });
        },
        update() {
          graphics.clear();
          graphics.lineStyle(2, 0xffffff, 1);
          if (linePath.length > 0) {
            path = new Phaser.Curves.Path(linePath[0].x, linePath[0].y);
            for (let i = 1; i < linePath.length; i += 1) {
              path.lineTo(linePath[i].x, linePath[i].y);
            }
          }
          if (path) {
            path.draw(graphics);
          }
          if (((path || {}).curves || []).length > 0) {
            const point = path.curves[0].p0;
            const angle = Math.atan2(point.y - ship.y, point.x - ship.x);
            let angleToTurn = 0;
            if (ship.body.angle > (angle + 0.02)) {
              angleToTurn = ship.body.angle - 0.07;
              console.log('MAIOR');
            } else if (ship.body.angle < (angle - 0.02)) {
              angleToTurn = ship.body.angle + 0.07;
              console.log('MENOR');
            } else {
              console.log('RECEBE ANGULO');
              angleToTurn = angle;
            }
            ship.setAngle((angleToTurn * 180) / Math.PI);
            ship.setVelocityX(Math.cos(angle));
            ship.setVelocityY(Math.sin(angle));
            const distance = Phaser.Math.Distance.Between(ship.x, ship.y, point.x, point.y);
            if (distance < 1) {
              path.curves.shift();
            }
          }
        },
      },
    };
    this.game = new Phaser.Game(config);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
