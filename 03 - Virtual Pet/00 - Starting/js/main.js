
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: [bootScene,loadingScene,homeScene,gameScene, gameOverScene],
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};

let game = new Phaser.Game(config);
