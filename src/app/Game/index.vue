<template>
  <div class="hello" ref="gameCanvasContainer">
  </div>
</template>

<script>
import Phaser from 'phaser/dist/phaser.min';
import GameScene from './Scenes/Game/GameScene';
import MainMenuScene from './Scenes/MainMenu/MainMenuScene';

export default {
  mounted() {
    const config = {
      parent: this.$refs.gameCanvasContainer,
      type: Phaser.AUTO,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
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
      scene: [
        MainMenuScene,
        GameScene,
      ],
    };
    this.game = new Phaser.Game(config);
    window.addEventListener('resize', () => {
      // this.game.resize(window.innerWidth, window.innerHeight);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 100%;
  height: 100%;
  display: flex
}
</style>
