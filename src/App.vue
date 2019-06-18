<template>
  <game />
</template>

<script>
import Game from './app/Game';

export default {
  name: 'app',
  components: {
    Game,
  },
};
</script>
<style src="./styles/fonts.sass" lang="sass"></style>
<style lang="sass">
  body,
  html
    padding: 0px
    margin: 0px
    width: 100%
    height: 100%
</style>
