import BaseScene from "./BaseScene";

export default class AppController extends BaseScene {
  constructor() {
    super('AppController');
  }
  goToMainMenu() {
    this.scene.launch('MainMenu');
  }
  create() {
    super.create();
    this.goToMainMenu();
  }
}
