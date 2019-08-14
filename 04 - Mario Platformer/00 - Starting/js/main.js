// create a new scene
let gameScene = new Phaser.Scene('Game');


// some parameters for our scene
gameScene.init = function() {
  this.playerSpeed = 150;
  this.jumpSpeed = -500
};

// load asset files for our game
gameScene.preload = function() {
  this.load.json('levelData', 'assets/levelData.json')
  // load images
  this.load.image('ground', 'assets/images/ground.png');
  this.load.image('platform', 'assets/images/platform.png');
  this.load.image('block', 'assets/images/block.png');
  this.load.image('goal', 'assets/images/gorilla3.png');
  this.load.image('barrel', 'assets/images/barrel.png');

  // load spritesheets
  this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
    frameWidth: 28,
    frameHeight: 30,
    margin: 1,
    spacing: 1
  });

  this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
    frameWidth: 20,
    frameHeight: 21,
    margin: 1,
    spacing: 1
  });

  this.input.on('pointerdown', function(pointer){
    console.log(pointer.x,pointer.y)

    
  })


};



// executed once, after assets were loaded
gameScene.create = function() {

  this.physics.world.bounds.width=360
  this.physics.world.bounds.height=700
  
  
  //fire animation
  // originally, in the tutorial,
  // the animation didn't play because it's declared after 
  // the object is placed on the Canvas element
  this.anims.create({
    key: 'burning',
    frames: this.anims.generateFrameNames('fire',{
      frames: [0,1],
    }),
    frameRate: 4,
    repeat: -1
  })

  this.setupLevel();


  
  this.player = this.physics.add.existing(this.add.sprite(this.levelData.player.x, this.levelData.player.y,'player',3))
  
  this.physics.add.collider([this.player, this.goal], this.platforms);
  // this.physics.add.collider(this.platforms,this.fires)

  // later, this will change to physics groups and static groups for efficiency
  
  //enable cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();

  //walking animation
  this.anims.create({
    key: 'walking',
    frames: this.anims.generateFrameNames('player',{
      frames: [0,1,2],
    }),
    yoyo: true,
    frameRate: 12,
    repeat: -1
  })


  //constrain player to world bounds
  this.player.body.setCollideWorldBounds(true)


  // shorthand declaration for physics object
  // this.goal so everything can see it as gameScene.goal
  // this.physics.add.existing(gameObj) takes a sprite as an argument, 
  // but we can create the sprite in the argument with this.add.sprite.
  // which has a normal declaration
  this.goal = this.physics.add.existing(this.add.sprite(this.levelData.goal.x,this.levelData.goal.y,'goal').setOrigin(0))
  this.physics.add.collider(this.platforms,this.goal)


};

gameScene.update = function() {

  let onGround = this.player.body.blocked.down
  if (!onGround) console.log("I'm off the ground!")
  if(this.cursors.left.isDown){

    // apply negative -10 x to move toward the left
    this.player.body.setVelocityX(-this.playerSpeed)
    // flipX is required for rightward movement. It stays if this isn't there.
    this.player.flipX=false

    // must verify the walking animation hasn't yet started, or else it will get stuck on frame 0
      if(onGround && !this.player.anims.isPlaying){

      this.player.anims.play('walking')}
  } 
  else if (this.cursors.right.isDown) {

    this.player.body.setVelocityX(this.playerSpeed)
    // flipX is required so the sprite isn't always looking in the default
    this.player.flipX=true

    if(onGround && !this.player.anims.isPlaying){
      this.player.anims.play('walking')
  }
}
  else{
    // without this, velocity is preserved from last key press
    this.player.body.setVelocityX(0)
    this.player.anims.stop('walking')

    if (onGround) this.player.setFrame(3)
    // for standing player, default frame is used-- could also become idle animation.
    
  }

  if(onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
    this.player.anims.stop('walking')
    this.player.body.setVelocityY(this.jumpSpeed)
    this.player.setFrame(2)
  }
}

gameScene.setupLevel = function () {

  this.levelData = this.cache.json.get('levelData')
  
  this.platforms = this.physics.add.staticGroup();

  for (let i = 0; i < this.levelData.platforms.length; i++){
    let curr = this.levelData.platforms[i]
    let newObj;
    if(curr.numTiles == 1){
      newObj = this.add.sprite(curr.x,curr.y,curr.key).setOrigin(0)
    }
    else {
      let width = this.textures.get('block').get(0).width;
      let height = this.textures.get('block').get(0).height;
      newObj = this.add.tileSprite(curr.x,curr.y,curr.numTiles*width,height ,curr.key).setOrigin(0)

    }

    this.physics.add.existing(newObj, true);
    this.platforms.add(newObj)
  }

  this.fires = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  for (let i = 0; i < this.levelData.fires.length; i++){
    let curr = this.levelData.fires[i]
    let newObj;
      newObj = this.add.sprite(curr.x,curr.y, 'fire').setOrigin(0)

      newObj.anims.play('burning')


      // If the sprite is not considered a physics object, the below is useful.
      // Since the entire group is a physics object, we get the properties from the group itself.

      // this.physics.add.existing(newObj);
      // this.fires.add(newObj)
      // newObj.body.allowGravity = false
      // newObj.body.immovable = true
    
    //this and the drag function below are to make the fires placeable when editing the level. 
    // newObj.setInteractive()
    // this.input.setDraggable(newObj)
    // this.input.setDraggable(newObj);

  }

  // this.input.on('drag', function(pointer,gameObj,dragX,dragY){
  //   gameObj.x = dragX;
  //   gameObj.y = dragY;

  //   console.log(dragX, dragY)
  // })

  // for level creation 
  // this.input.on('drag', function(pointer){
  //   console.log(pointer)
  // })
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'Monster Kong',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 1000}
      ,
      debug: true
    }
  }
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
