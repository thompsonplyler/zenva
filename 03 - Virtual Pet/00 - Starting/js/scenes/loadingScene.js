let loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function() {
    let gameW = this.sys.game.config.width
    let gameH = this.sys.game.config.height
    let barW = 150
    let barH = 30
    
    this.logo = this.add.sprite(gameW/2,gameH/2-70,'logo').setScale(2)
    
    let bgBar = this.add.graphics().setDepth(0);
    bgBar.setPosition(gameW/2-barW/2, gameH/2-barH/2)
    bgBar.fillStyle(0xF5F5F5,1)
    bgBar.fillRect(0,0,barW,barH)

    let progressBar = this.add.graphics().setDepth(1);
    progressBar.setPosition(gameW/2-barW/2, gameH/2-barH/2)
    
    this.load.on('progress', function(value){
        console.log(value)
        progressBar.clear()
        progressBar.fillStyle(0x9AD98D,1)
        progressBar.fillRect(0,0,value * barW,barH)
    }, this)
  
    // load assets
    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');
  
    this.load.spritesheet('pet', 'assets/images/pet.png', {
      frameWidth: 97,
      frameHeight: 83,
      spacing: 1,
      margin: 1
    });

  };

  loadingScene.create = function(){
    // once animations are declared, they are global, but they must be declared in the create function.
    // placing the animtion here allows future scenes to access the global animation. 
    
    this.anims.create({
        key: 'funnyfaces',
        yoyo: true,
        frameRate: 7,
        repeat: 0,
        frames: this.anims.generateFrameNames('pet', {frames: [1,2,3]})
      })

      this.scene.start('Home');

    //   this.scene.start('Home')
  }