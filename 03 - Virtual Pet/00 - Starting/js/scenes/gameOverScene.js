let gameOverScene = new Phaser.Scene('GameOver');

gameOverScene.create = function(){

  let bg = this.add.sprite(0,0,'backyard').setInteractive();
  bg.setOrigin(0,0);
  let text = this.add.text(this.sys.game.config.width/2,this.sys.game.config.height/2, `GAME OVER!`, {
    font: "40px Arial",
    fill: "#ffffff"
  }).setOrigin(0.5,0.5)

  bg.on('pointerdown', function(){
    gameOverScene.scene.start('Home')
  })

}