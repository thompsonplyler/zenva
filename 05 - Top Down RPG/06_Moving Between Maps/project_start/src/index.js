import 'phaser';
import config from './config';
import GameScene from './Scenes/Game';
import BootScene from './Scenes/Boot';

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Game', GameScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
window.addEventListener('resize', (event) => {

  // updated to 3.16
  game.scale.resize(window.innerWidth, window.innerHeight);
});