<template>
  <div class="hello" ref="gameCanvasContainer">
  </div>
</template>

<script>
import Phaser from 'phaser/dist/phaser';
import CargoShipsManager from './CargoShipsManager';

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
          this.CargoShipsManager = new CargoShipsManager(this);
          this.CargoShipsManager.preload();
        },
        create() {
          this.CargoShipsManager.create();
        },
        update() {
          this.CargoShipsManager.update();
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
