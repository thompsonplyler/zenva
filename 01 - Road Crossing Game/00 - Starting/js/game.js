let gameScene = new Phaser.Scene('Game');

gameScene.preload = function () {
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

gameScene.init = function () {
    this.playerSpeed = 2.5;
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 5;
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
    this.isTerminating = false;

}

gameScene.create = function () {
    let gameW = this.sys.game.config.width
    let gameH = this.sys.game.config.height

    this.score = 0

    this.player = this.add.sprite(50, gameH / 2, 'player')
    this.player.depth = 1
    // move the player 50 right, 60 down, i.e. away from the origin
    // player.setPosition(100,240)

    // scale the player up 50% on X and down 50% on Y
    // player.setScale(.5,2)
    // below sets the X and Y to 50% size: 
    this.player.setScale(.5)

    let bg = this.add.sprite(0, 0, 'background')


    bg.setPosition(gameW / 2, gameH / 2)

    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: {
            x: 110,
            y: 100,
            stepX: 82,
            stepY: 20
        },
    });
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.6, -0.6)

    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {

        enemy.flipX = true
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)
        enemy.speed = dir * speed




    }, this)

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

    this.treasure = this.add.sprite(gameW - 80, gameH / 2, 'treasure')
    this.treasure.scale = .5

}

gameScene.update = function () {
    let player = this.player
    let treasure = this.treasure
    let playerRect = player.getBounds();
    let treasureRect = treasure.getBounds();
    let enemyMaxY = this.enemyMaxY
    let enemyMinY = this.enemyMinY
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    if (this.isTerminating) {
        return
    }

    for (let i = 0; i < numEnemies; i++) {
        let enemyRect = enemies[i].getBounds();
        enemies[i].y += enemies[i].speed
        let conditionDown = enemies[i].speed > 0 && enemies[i].y >= enemyMaxY
        let conditionUp = enemies[i].speed < 0 && enemies[i].y <= enemyMinY

        if (conditionDown || conditionUp) {
            enemies[i].speed *= -1
        }

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            console.log(`You got touched by an enemy! You lose!`)
            this.gameOver();

        }
    }

    // for (let i = 0; i < numEnemies; i++) {
    //     enemies[i].y += this.enemySpeed
    // }


    if (this.input.activePointer.isDown) {
        player.x += this.playerSpeed
    }




    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
        score = +1
        console.log(`You got the treasure! Your score is ${score}`)
        this.gameOver()
    }


}

gameScene.gameOver = function () {
    this.isTerminating = true
    this.cameras.main.shake(100);
    this.cameras.main.on('camerashakecomplete', function () {
        this.cameras.main.fade(250);
        this.cameras.main.on('camerafadeoutcomplete', function () {
            this.scene.restart()
        }, this)
    }, this)
    return
}


let game = new Phaser.Game(config);