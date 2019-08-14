let homeScene = new Phaser.Scene('Home');

homeScene.create = function(){
  let gameW = this.sys.game.config.width
  let gameH = this.sys.game.config.height

  let bg = this.add.sprite(0,0,'backyard').setInteractive();
  bg.setDepth(0)
  bg.setOrigin(0,0);
  let text = this.add.text(this.sys.game.config.width/2,this.sys.game.config.height/2, `VIRTUAL PET`, {
    font: "40px Arial",
    fill: "#ffffff"
  }).setDepth(2)
  let text2 = this.add.text(this.sys.game.config.width/2,this.sys.game.config.height/2+50, `Press mouse button to start!`, {
    font: "26px Arial",
    fill: "#ffffff"
  }).setDepth(2)

  let textBg = this.add.graphics().setDepth(1)
  textBg.fillStyle(0x000000,0.7)
  textBg.fillRect(gameW/2-text.width/2-10,gameH/2-text.height/2-10,text.width+20,text.height+20)

  let textBg2 = this.add.graphics().setDepth(1)
  textBg2.fillStyle(0x000000,0.7)
  textBg2.fillRect(gameW/2-text2.width/2-5,gameH/2-text2.height/2+50,text2.width+10,text2.height+5)

  
  text.setOrigin(0.5,0.5)
  text2.setOrigin(0.5,0.5)

  bg.on('pointerdown', function(){
    homeScene.scene.start('Game')
  })

}