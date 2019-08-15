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



// executed once, after assets are loaded
gameScene.create = function() {
  this.anims.create({
    key: 'burning',
    frames: this.anims.generateFrameNames('fire',{
      frames: [0,1],
    }),
    frameRate: 4,
    repeat: -1
  })

  // I tried placing the above in the preload function, but it breaks the game.
  //  It turns out that once animations are declared, they are global, but they must be declared in the create function.
  // compare this with the loading scene in the Pet Trainer game above. 
  // placing the animtion here allows future scenes to access the global animation. 

  this.setupLevel();
  
  //fire animation
  // originally, in the tutorial,
  // the animation didn't play because it's declared after 
  // the object is placed on the Canvas element


 
  
  
  


  // the first argument is one thing, and it checks to see if collision is possible for the second argument.
  // note that the arguments can contain multiple items with an array.
  
  
  // originally we had 
  // this.physics.add.collider(this.platforms,this.fires)
  // but it was changed because we only wanted overlap to show they are, indeed, things. For final product,
  // switched to:
  
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
  this.physics.add.collider([this.player, this.goal, this.barrels], this.platforms);

  this.physics.add.overlap(this.player, [this.fires, this.goal, this.barrels], this.restartGame, null, this)
  // the third argument, this.restartGame, is a callback function called when the overlap occurs.
  // there is a fourth argument that checks to see if the callback should be called based on specifics of one of the
  // first two arguments
  // In docs: 
  // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.ArcadePhysics.html
  // Find: "overlap(object1 "
  // note the array syntax doesn't work with normal groups as of Phaser 3.8. 

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
  // important command to acquire data from an accessible json file
  this.levelData = this.cache.json.get('levelData')
  this.physics.world.bounds.width=this.levelData.world.width
  this.physics.world.bounds.height=this.levelData.world.height
  this.player = this.physics.add.existing(this.add.sprite(this.levelData.player.x, this.levelData.player.y,'player',3))
  this.cameras.main.setBounds(0,0,this.levelData.world.width,this.levelData.world.height)
  this.cameras.main.startFollow(this.player)
  this.setupSpawnerTwo()
  
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

      // another option for the above is: 
      // this.fires.create(curr.x,curr.y, 'fire')
      // this changes the effects of the .setOrigin(0)
      // if .setOrigin is weird, you can use .setOffset(x,y)
      // this looks into the group and adds whatever we have added. 


      newObj.anims.play('burning')


      this.fires.add(newObj)
      // If the sprite is not considered a physics object, the below is useful.
      // Since the entire group is a physics object, we get the properties from the group itself.
      // as long as the sprite is in the group (per the line above these comments)
      // it will inherit the physics properties of the physics group. 

        // this.physics.add.existing(newObj);
      
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

gameScene.restartGame = function(){
  this.cameras.main.fade(500);
  this.cameras.main.on('camerafadeoutcomplete', function(){
    gameScene.scene.restart()
  }, this)
  console.log("Overlap detected!")
}

gameScene.setupSpawner = function() {
this.barrels = this.physics.add.group({
  bounceY: 0.1,
  bounceX: 1,
  collideWorldBounds: true
})

// documentation for Phaser Clock
// https://photonstorm.github.io/phaser3-docs/Phaser.Time.Clock.html

// documentation for time.addEvent: 
// https://photonstorm.github.io/phaser3-docs/Phaser.Types.Time.html#.TimerEventConfig

// Also: fuck Phaser documentation.
// creates spawning event that uses information from levelData
let spawningEvent = this.time.addEvent({
  // how often the barrels spawn
  delay: this.levelData.spawner.interval,
  // keep spawning them
  loop: true,
  callbackScope: this,
  callback: function(){
    // add a new item, barrel, to the barrels group at the goal, with the sprite barrel
    let barrel = this.barrels.create(this.goal.x,this.goal.y,'barrel')
    // its speed on the X axis is
    barrel.setVelocityX(this.levelData.spawner.speed)

    // give the barrels a TTL
    this.time.addEvent({
      // set in levelData, determines how long they live
      delay: this.levelData.spawner.duration,
      // it's only applied to a single barrel
      repeat: false,
      callbackScope: this,
      callback: function(){
        // kill it
        barrel.destroy()
      }
    })
  }
})
// end setupSpawner function 
}

// The above works, but it continues to create and destroy objects, which is processor intensive over time.
// JS has garbage collection that we as developers don't have access to. As a result, when JS decides to 
// engage in garbage collection, the game might slow down (considerably). 

// The method below is a more efficient implementation of the spawner that creates POOLS OF OBJECTS
gameScene.setupSpawnerTwo = function() {
  this.barrels = this.physics.add.group({
    bounceY: 0.1,
    bounceX: 1,
    collideWorldBounds: true
  })
  
  // documentation for Phaser Clock
  // https://photonstorm.github.io/phaser3-docs/Phaser.Time.Clock.html
  
  // documentation for time.addEvent: 
  // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Time.html#.TimerEventConfig
  
  // Also: fuck Phaser documentation.
  // creates spawning event that uses information from levelData
  let spawningEvent = this.time.addEvent({
    // how often the barrels spawn
    delay: this.levelData.spawner.interval,
    // keep spawning them
    loop: true,
    callbackScope: this,
    callback: function(){
      // add a new item, barrel, to the barrels group at the goal, with the sprite barrel
      // in old version, we used
      //let barrel = this.barrels.create(this.goal.x,this.goal.y,'barrel')
      let barrel = this.barrels.get(this.goal.x,this.goal.y,'barrel')

      // require these three flags in order to make this.barrels.killAndHide(barrel) not make the game stagnate
      barrel.setActive(true)
      barrel.setVisible(true)
      barrel.body.enable = true
      // its speed on the X axis is
      barrel.setVelocityX(this.levelData.spawner.speed)
  
      // give the barrels a TTL
      this.time.addEvent({
        // set in levelData, determines how long they live
        delay: this.levelData.spawner.duration,
        // it's only applied to a single barrel
        repeat: false,
        callbackScope: this,
        callback: function(){
          // kill it
          // initially we used: 
          // barrel.destroy()
          // With Object Pooling, we used:
          this.barrels.killAndHide(barrel)
          barrel.body.enable = false
          // 
        }
      })
    }
  })
  // end setupSpawner function 
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
