let gameScene = new Phaser.Scene('Game');

gameScene.preload = function(){
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
    this.load.image('treasure', 'assets/treasure.png');
}

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
};

gameScene.init = function (){
    this.playerSpeed = 2;
    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 4;
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
    
}

gameScene.create = function(){
    let gameW = this.sys.game.config.width
    let gameH = this.sys.game.config.height
    
    this.score = 0 

    this.player = this.add.sprite(50,gameH/2, 'player')
    this.player.depth = 1
    // move the player 50 right, 60 down, i.e. away from the origin
    // player.setPosition(100,240)

    // scale the player up 50% on X and down 50% on Y
    // player.setScale(.5,2)
    // below sets the X and Y to 50% size: 
    this.player.setScale(.5)

    let bg = this.add.sprite(0,0,'background')
    

    bg.setPosition(gameW/2,gameH/2)

    this.enemy = this.add.sprite(290,gameH/2, 'enemy')
    let enemy = this.enemy
    enemy.flipX = true;
    enemy.scale = .5
    let dir = Math.random() < 0.5 ? 1 : -1;
    let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)
    enemy.speed = dir * speed;

    // enemy.flipX = enemy.setScale(-1,1)
    // enemy.flipY = enemy.setScale(1,-1)
    // to expand the WIDTH but not the HEIGHT of the sprite, 
    // enemy.displayWidth = 300 
    
    // to rotate the enemy 45 degrees either
    // enemy.angle = 45 
    // or 
    // enemy.setAngle(45)
    // or 
    // enemy.rotation = Math.PI / 4 (for radians)
    // or 
    // enemy.setRotation(Math.PI / 4) (for radians)

    this.treasure = this.add.sprite(gameW-80,gameH/2, 'treasure')
    this.treasure.scale = .5
    
}

gameScene.update = function(){
    let player = this.player
    let treasure = this.treasure
    let playerRect = player.getBounds();
    let treasureRect = treasure.getBounds();
    let score = this.score
    let enemy = this.enemy
    // this doesn't work because it becomes a new reserved place in memory. The speed doesn't actually change below.
    // it must be: this.enemySpeed
    let enemySpeed = this.enemy.speed
    let enemyMaxY = this.enemyMaxY
    let enemyMinY = this.enemyMinY
    

 if(this.input.activePointer.isDown) {
     player.x += this.playerSpeed
 }

 enemy.y += enemySpeed

 let conditionDown = enemySpeed > 0 && enemy.y >= enemyMaxY
 let conditionUp = enemySpeed < 0 && enemy.y <= enemyMinY
 
 if (conditionDown || conditionUp) {
    this.enemy.speed *= -1
}

 if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,treasureRect)) {
     score =+ 1
     console.log(`You got the treasure! Your score is ${score}`)
     this.scene.restart();   
     return
 }


}

let game = new Phaser.Game(config);