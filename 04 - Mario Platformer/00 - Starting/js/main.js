// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  this.playerSpeed = 150;
  this.jumpSpeed = -450

  this.levelData = {
    platforms: [
      {
         "x": 72,
         "y": 450,
         "numTiles": 6,
         "key": "block"
      },
      {
         "x": 0,
         "y": 330,
         "numTiles": 8,
         "key": "block"
      },
      {
         "x": 72,
         "y": 210,
         "numTiles": 8,
         "key": "block"
      },
      {
         "x": 0,
         "y": 90,
         "numTiles": 7,
         "key": "block"
      },
      {
         "x": 0,
         "y": 560,
         "numTiles": 1,
         "key": "ground"
      }
   ]
  }



};

// load asset files for our game
gameScene.preload = function() {

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
  
  //these next two declarations do the same thing
  // 1. Declare a sprite with this.add.sprite
  // let ground = this.add.sprite(180,400, 'ground')
  // this.physics.add.existing(ground)

  // 2. Declare a sprite as a physics object. 
  // let ground2 = this.physics.add.sprite(180,200,'ground')

  this.platforms = this.add.group();

  let ground = this.add.sprite(180,604, 'ground')
  this.physics.add.existing(ground,true)

  // by saying this.physics.add.existing(gameObject,true), you perform a similar function to 
  // the two properties below-- it won't move, and it won't react to the momentum of other
  // objects in the physics of the world

  // ground.body.allowGravity = false
  // ground.body.immovable = true

  // this also turns ground into a StaticBody, which acquires a lot less overhead than the
  // DynamicBody that comes from a normal physics object in Phaser.
  
  let platform = this.add.tileSprite(180,500,3*36,1*30,'block')
  this.physics.add.existing(platform,true)

  this.platforms.add(ground)
  this.platforms.add(platform)

  this.player = this.add.sprite(20, 557,'player',3)
  this.physics.add.existing(this.player)
  this.physics.add.collider(this.player,this.platforms)

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
