let bootScene = new Phaser.Scene('BootScene');

bootScene.preload = function() {
    this.load.image('logo', 'assets/images/rubber_duck.png');
}

bootScene.create = function() {
   
    bootScene.scene.start('Loading')
}