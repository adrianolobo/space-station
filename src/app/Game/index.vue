<template>
  <div class="hello" ref="gameCanvasContainer">
  </div>
</template>

<script>
import Phaser from 'phaser/dist/phaser.min';

let graphics;
let path;
let linePath = [];
let follower;
let isDrawing = false;

export default {
  mounted() {
    const config = {
      parent: this.$refs.gameCanvasContainer,
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload() {
          this.load.image('cargo-ship', '/static/img/cargo-ship.png');
        },
        create() {
          graphics = this.add.graphics();
          // eslint-disable-next-line
          this.input.on('pointerdown', (pointer) => {
            console.log('pointerdown');
            console.log(pointer);
            linePath.push({
              x: pointer.position.x,
              y: pointer.position.y,
            });
            isDrawing = true;
          });
          this.input.on('pointermove', (pointer) => {
            console.log('pointermove');
            console.log(pointer);
            if (isDrawing) {
              linePath.push({
                x: pointer.position.x,
                y: pointer.position.y,
              });
            }
          });
          this.input.on('pointerup', (pointer) => {
            console.log('pointerup');
            console.log(pointer);
            linePath.push({
              x: pointer.position.x,
              y: pointer.position.y,
            });
            isDrawing = false;
            console.log(linePath);
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
          if (path && !follower && !isDrawing) {
            follower = this.add.follower(path, 0, 0, 'cargo-ship');
            follower.start({
              positionOnPath: true,
              duration: 3000,
              yoyo: true,
              repeat: -1,
              rotateToPath: true,
              verticalAdjust: true,
            });
            console.log('**************');
            console.log('**************');
            console.log('**************');
          }
          if (path) {
            path.draw(graphics);
          }
        },
      },
    };
    const game = new Phaser.Game(config);
    console.log(game);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
