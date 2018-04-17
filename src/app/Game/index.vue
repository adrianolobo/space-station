<template>
  <div class="hello" ref="gameCanvasContainer">
  </div>
</template>

<script>
import Phaser from 'phaser/dist/phaser.min';
import CargoShipsManager from './CargoShipsManager';
import SpaceStationManager from './SpaceStationManager';
import CollisionManager from './CollisionManager';

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
          debug: false,
        },
      },
      scene: {
        preload() {
          this.CargoShipsManager = new CargoShipsManager(this);
          this.SpaceStationManager = new SpaceStationManager(this);
          this.CollisionManager = new CollisionManager(this);

          this.CargoShipsManager.preload();
          this.SpaceStationManager.preload();
        },
        create() {
          this.CargoShipsManager.create();
          this.SpaceStationManager.create();
          this.CollisionManager.create();
        },
        update() {
          this.CargoShipsManager.update();
          this.SpaceStationManager.update();
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
