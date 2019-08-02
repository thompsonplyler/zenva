// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {};

this.stats  = {
  health: 100,
  fun: 100
}

// load asset files for our game
gameScene.preload = function() {
  
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

// executed once, after assets were loaded
gameScene.create = function() {

  this.bg = this.add.sprite(0,0,'backyard')
  this.pet = this.add.sprite(100,200,'pet').setInteractive();
  // this sets the pet to be draggable by the pointer.
  // it doesn't work if the above code isn't there; that won't be interactable.
  this.input.setDraggable(this.pet);
  

  // follow the pointer and return the X,Y
  this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
    // make sprite be located at pointer coordinates by dragging
    gameObject.x = dragX;
    gameObject.y = dragY;

  })
  
  this.bg.setOrigin(0,0)

  this.createUi();



};

gameScene.createUi = function () {
  this.appleBtn = this.add.sprite(72,570,'apple').setInteractive();
  this.appleBtn.customStats = {health: 20, fun: 0};
  this.candyBtn = this.add.sprite(144,570,'candy').setInteractive();
  this.candyBtn.customStats = {health: -10, fun: 10};
  this.toyBtn = this.add.sprite(216,570,'toy').setInteractive();
  this.toyBtn.customStats = {health: 0, fun: 15};
  this.rotateBtn = this.add.sprite(288,570,'rotate').setInteractive();

  this.appleBtn.on('pointerdown', this.pickItem);
  this.candyBtn.on('pointerdown', this.pickItem);
  this.toyBtn.on('pointerdown', this.pickItem);
  this.rotateBtn.on('pointerdown', this.rotatePet);

  // add all the buttons to the array
  this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn]

  this.uiBlocked = false;
  this.uiReady()
  
  

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

  setTimeout(function(){
    // set the scene back to ready.
    gameScene.uiReady();
    gameScene.scene.uiBlocked = false
  },2000)

}

gameScene.pickItem = function(){

  // the context of the pickItem (see the buttons above)
  // is the buttons/sprites themselves. We use this.scene
  // in order to make the context of "this" the scene.
  if (this.scene.uiBlocked){
    return
  } 
  gameScene.uiReady();
  
  this.scene.selectedItem = this;
  this.alpha = 0.5;
  

  console.log(`We are picking the ${this.texture.key}.`)

  // set UI to ready
  
}

gameScene.uiReady = function () {

  this.selectedItem = null;
  for (let i = 0; i < this.buttons.length; i++) {
    this.buttons[i].alpha = 1;
  }


}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};

gameScene.update = function(){
  // this.pet.on('')

}

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
