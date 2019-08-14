// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {;

this.stats  = {
  health: 100,
  fun: 100
}

this.healthDecay = 5;
this.funDecay = 2;

this.decayRate ={
  health: -5,
  fun: -2
}

}

// load asset files for our game
// executed once, after assets were loaded
gameScene.create = function() {

    this.bg = this.add.sprite(0,0,'backyard').setInteractive();
    
    this.bg.on('pointerdown', this.placeItem, this);
    
    let startXMin = 97/2
    let startXMax = this.game.config.width-(97)
    let startYMin = 83/2
    let startYMax = this.game.config.height-(150)
    let startX = Math.random() * (startXMax) + startXMin
    let startY = Math.random() * (startYMax) + startYMin
    
    this.pet = this.add.sprite(startX,startY,'pet').setInteractive();
    this.pet.setDepth(1)
    this.pet.on('animationcomplete', function(){
      gameScene.uiReady()
    })
    console.log(this.pet.x)
    console.log(this.pet.y)
  
  // this sets the pet to be draggable by the pointer.
  // it doesn't work if the above code isn't there; that won't be interactable.
  this.input.setDraggable(this.pet);
  console.log(this.stats)

  // follow the pointer and return the X,Y
  this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
    // make sprite be located at pointer coordinates by dragging
    gameObject.x = dragX;
    gameObject.y = dragY;

  })
  
  this.anims.create({
    key: 'funnyfaces',
    yoyo: true,
    frameRate: 7,
    repeat: 0,
    frames: this.anims.generateFrameNames('pet', {frames: [1,2,3]})
  })

  this.bg.setOrigin(0,0)

  this.createUi()

  this.createHud();
  this.refreshHud();

  
  this.timedEventStats = this.time.addEvent({
    delay: 1000,
    repeat: -1, // it will go forever
    callback: function(){
      this.updateStats(this.decayRate)
    },
    callbackScope: this
  })


};

gameScene.createHud = function () {
  this.healthText = this.add.text(20,20,'Health:', {
    font: '20px Arial',
    fill: '#ffffff',
  }).setDepth(2)

  this.funText = this.add.text(20,50,'Fun:', {
    font: '20px Arial',
    fill: '#ffffff',
  }).setDepth(2)

  // below was my first attempt
  // this.wordText = this.add.text(30,20, `Health: ${this.stats.health}\nFun: ${this.stats.fun}`)
}.bind(gameScene)

gameScene.refreshHud = function () {
  this.healthText.setText('Health: ' + this.stats.health)
  this.funText.setText('Fun: ' + this.stats.fun)
}.bind(gameScene)

gameScene.updateStats = function(statDiff) {

  let isGameOver = false
if (gameScene.selectedItem)
{  for (stat in statDiff) {
    if (this.selectedItem.customStats.hasOwnProperty(stat)){
     this.stats[stat] += this.selectedItem.customStats[stat]

     if (this.stats[stat] < 0) {
       isgameOver = true 
       this.stats[stat] = 0}
     }
   }}
   else {
     for (stat in statDiff){
       this.stats[stat] += statDiff[stat]
       if (this.stats[stat] <= 0 ) {
         isGameOver = true
         this.stats[stat] = 0
       }
     }
   }
   this.refreshHud()
   if(isGameOver) this.gameOver();
}

gameScene.gameOver = function(){
  this.uiBlocked = true
  this.pet.setFrame(4);
  console.log("Game Over")

  this.time.addEvent({
    delay: 2000,
    repeat: 0, // it will go forever
    callback: function(){
      this.scene.start('GameOver')
    },
    callbackScope: this
  })

}

gameScene.createUi = function () {
  this.appleBtn = this.add.sprite(72,570,'apple').setInteractive();
  this.appleBtn.customStats = {health: 20, fun: 0};
  this.candyBtn = this.add.sprite(144,570,'candy').setInteractive();
  this.candyBtn.customStats = {health: -10, fun: 10};
  this.toyBtn = this.add.sprite(216,570,'toy').setInteractive();
  this.toyBtn.customStats = {health: 0, fun: 15};
  this.rotateBtn = this.add.sprite(288,570,'rotate').setInteractive();
  this.rotateBtn.customStats = {health: 0, fun: 5};

  this.appleBtn.on('pointerdown', this.pickItem);
  this.candyBtn.on('pointerdown', this.pickItem);
  this.toyBtn.on('pointerdown', this.pickItem);
  this.rotateBtn.on('pointerdown', this.rotatePet);

  // add all the buttons to the array
  this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn]
  
  this.uiBlocked = false;
  this.uiReady()
  console.log(this)
  
  //decay of fun and health over time

  

}

// rotate pet
gameScene.rotatePet = function(){
  console.log("We are rotating the pet.")
  if (gameScene.scene.uiBlocked){
    return
  }

  this.scene.uiReady();

  //block the UI
  this.scene.uiBlocked = true;
  this.alpha = 0.5;
  // console.log(this.scene)

  let rotateTween = gameScene.tweens.add({
    targets: gameScene.pet,
    duration: 600,
    angle: 1080,
    pause: false,
    callbackScope: this,
    onComplete: function(tween, sprites) {
      this.scene.updateStats({fun: 5});
      console.log(gameScene.stats)
      gameScene.refreshHud();
      this.scene.uiReady();
    }
  })


  // The below was a tool to implement a timeout function and to 
  // demo the locking in and out of the ui state.
  // setTimeout(function(){
  //   // set the scene back to ready.
  //   gameScene.uiReady();
  //   gameScene.uiBlocked = false
  // },2000)

}

gameScene.pickItem = function(){

  // the context of the pickItem (see the buttons above)
  // is the buttons/sprites themselves. We use this.scene
  // in order to make the context of "this" the scene.
  if (gameScene.uiBlocked){
    console.log("This UI is blocked!")
    return
  } 
  console.log("Function fired.")
  gameScene.uiReady();
  
  this.scene.selectedItem = this;
  this.alpha = 0.5;
  

  console.log(`We are picking the ${this.texture.key}.`)
  console.log(gameScene.selectedItem.texture.key)

  // set UI to ready
  
}

gameScene.uiReady = function () {

  this.selectedItem = null;
  for (let i = 0; i < this.buttons.length; i++) {
    this.buttons[i].alpha = 1;
  }
  this.uiBlocked = false

}

gameScene.placeItem = function(pointer,localX,localY){
  
  if(!this.selectedItem) return;
  if(this.uiBlocked) return;

  let newItem = this.add.sprite(localX,localY,this.selectedItem.texture.key)

  
  this.uiBlocked = true;
  
  let petTween = this.tweens.add({
    targets: this.pet,
    duration: 500, 
    x: localX,
    y:  localY,
    paused: false,
    callbackScope: this,
    onComplete: function(){
      newItem.destroy()
      this.pet.play('funnyfaces')
      if(this.selectedItem){
      this.updateStats(this.selectedItem.customStats)}
      console.log(this.stats)
      gameScene.refreshHud();
      this.uiReady();
    }
    
  })

  
  // for (stat in this.selectedItem.customStats) {
  //   if (this.selectedItem.customStats.hasOwnProperty(stat)){
  //     this.stats[stat] += this.selectedItem.customStats[stat]
  //   }
  // }

  // this.wordText.setText("")
  // this.wordText = this.add.text(30,20, `Health: ${this.stats.health}\nFun: ${this.stats.fun}`)
}



// our game's configuration

gameScene.update = function(){
  // this.pet.on('')


}

// create the game, and pass it the configuration
