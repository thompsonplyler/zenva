let gameScene = new Phaser.Scene('Game');

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
    title: 'Spanish Learning Game',
    pixelArt: false
};


gameScene.preload = function () {
    this.load.image('background', 'assets/images/background-city.png')
    this.load.image('building', 'assets/images/building.png')
    this.load.image('car', 'assets/images/car.png')
    this.load.image('house', 'assets/images/house.png')
    this.load.image('tree', 'assets/images/tree.png')
    this.load.audio('treeAudio', 'assets/audio/arbol.mp3')
    this.load.audio('carAudio', 'assets/audio/auto.mp3')
    this.load.audio('houseAudio', 'assets/audio/casa.mp3')
    this.load.audio('buildingAudio', 'assets/audio/edificio.mp3')
    this.load.audio('correct', 'assets/audio/correct.mp3')
    this.load.audio('wrong', 'assets/audio/wrong.mp3')
}

gameScene.init = function () {
    // word database
    this.words = [{
            key: 'building',
            setXY: {
                x: 100,
                y: 220
            },
            spanish: 'edificio'
        },

        {
            key: 'house',
            setXY: {
                x: 500,
                y: 255
            },
            setScale: {
                x: 0.8,
                y: 0.8
            },
            spanish: 'casa'
        },
        {
            key: 'car',
            setXY: {
                x: 250,
                y: 300
            },
            spanish: 'automóvil'
        },
        {
            key: 'tree',
            setXY: {
                x: 350,
                y: 230,
            },
            spanish: 'árbol'
        }
    ];

}

gameScene.showNextQuestion = function () {
    gameScene.nextWord = Phaser.Math.RND.pick(this.words)
    gameScene.nextWord.sound.play();
    gameScene.wordText.setText(this.nextWord.spanish)
}

gameScene.processAnswer = function (userResponse) {
    if (userResponse.key == this.nextWord.key) {
        this.correctSound.play()
        console.log("This is the correct answer.")

        return true
    } else {
        this.wrongSound.play()
        return false
    }

}

gameScene.create = function () {
    let gameW = this.sys.game.config.width
    let gameH = this.sys.game.config.height

    this.correctSound = this.sound.add('correct')
    this.wrongSound = this.sound.add('wrong')


    let bg = this.add.sprite(gameW / 2, gameH / 2, 'background')
    bg.setDepth(0)
    // we can add an event listener with
    // bg.setInteractive();

    bg.on('pointerdown', function (pointer) {
        console.log('click')
        console.log(pointer)
        // soundSample.play()
    })

    // below is how you add individual elements 
    // video from Zenva showed how to add them to a group/array

    // let building = this.add.sprite(100, 220, 'building')
    // let house = this.add.sprite(500, 240, 'house')
    // let car = this.add.sprite(250, 300, 'car')
    // let tree = this.add.sprite(350, 230, 'tree')

    // this is how to add a group of sprites with different keys.
    // each item in the group can be acted on with Phaser.Actions.Call, or acted on with conditional statements looking for the key.

    this.items = this.add.group([{
            key: 'building',
            setXY: {
                x: 100,
                y: 220
            },
            index: 0,
            name: 'building'
        },
        {
            key: 'house',
            setXY: {
                x: 500,
                y: 255
            },
            setScale: {
                x: 0.8,
                y: 0.8
            }
        },
        {
            key: 'car',
            setXY: {
                x: 250,
                y: 300
            }
        },
        {
            key: 'tree',
            setXY: {
                x: 350,
                y: 230,
            }
        }
    ]);

    this.items.setDepth(1)

    Phaser.Actions.Call(this.items.getChildren(), function (item) {
        let wordArr = item.scene.words

        for (let i = 0; i < wordArr.length; i++) {
            if (wordArr[i].key === item.texture.key) {
                this.words[i].sound = this.sound.add(`${item.texture.key}Audio`)

            }
        }

        // without item.setInteractive, the items can't respond to clicks
        item.setInteractive();

        item.resizeTween = this.tweens.add({
            targets: item,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            paused: true,
            yoyo: true
        })

        item.wrongTween = this.tweens.add({
            targets: item,
            angle: 90,
            duration: 300,
            paused: true,
            yoyo: true
        })

        item.alphaTween = this.tweens.add({
            targets: item,
            alpha: 0.7,
            duration: 200,
            paused: true,
            ease: 'Circular.InOut'
        })

        item.on('pointerover', function (pointer) {
                // console.log(item.alphaTween.data[0])
                item.alphaTween.resume();
            }

        )

        item.on('pointerout', function (pointer) {
            // if we don't stop the tween, it will wait to finish the tween if we leave the mouse very quickly.
            item.alphaTween.stop();
            item.alpha = 1;
        })


        item.on('pointerdown', function (pointer) {

            for (let i = 0; i < wordArr.length; i++) {
                if (wordArr[i].key === item.texture.key) {
                    console.log(wordArr[i].spanish)
                    let result = this.processAnswer(this.words[i]);
                    if (result) {
                        item.resizeTween.play()

                    } else {
                        item.wrongTween.play()
                    }

                    // this lets you hear the sound of the Spanish on a mouse click.
                    // this.sound.add(`${item.texture.key}Audio`).play()
                }
            }


            // in order to return the name of the clicked object for enumerated items called 'item'
            // use item.texture.key
            // console.log(`You clicked on the ${item.texture.key}`)
            // console.log(pointer)
            // soundSample.play()

            // this makes the tween above start

            this.showNextQuestion();

        }, this)

        this.wordText = this.add.text(30, 20, ``, {
            font: '28px Open Sans',
            fill: '#ffffff'
        }, this)

    }, this)

    this.showNextQuestion();

}

gameScene.update = function () {

    if (this.input.activePointer.isDown) {
        // this.soundSample.play();
    }



}

gameScene.gameOver = function () {

}


let game = new Phaser.Game(config);