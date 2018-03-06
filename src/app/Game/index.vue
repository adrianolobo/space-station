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
          // eslint-disable-next-line
          this.input.on('pointerdown', (pointer) => {
            linePath.push({
              x: pointer.position.x,
              y: pointer.position.y,
            });
            isDrawing = true;
          });
          this.input.on('pointermove', (pointer) => {
            if (isDrawing) {
              linePath.push({
                x: pointer.position.x,
                y: pointer.position.y,
              });
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
