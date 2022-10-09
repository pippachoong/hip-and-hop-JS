
import Phaser from './lib/phaser.js'

class PreloadScene extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
        console.log('preload constructor done');
    }

    preload() {
        console.log('preload begin');
        this.load.audio('jump', 'assets/jump.m4a');
        this.load.audio('hit', 'assets/hit.m4a');
        this.load.audio('reach', 'assets/reach.m4a');

        this.load.image('ground', 'assets/groundLayer2.png');
        this.load.image('bunny-idle', 'assets/bunny2_ready.png');
        this.load.image('bunny-hurt', 'assets/bunny2_hurt.png');
        this.load.image('restart', 'assets/restart.png');
        this.load.image('game-over', 'assets/game-over.png');
        this.load.image('cloud', 'assets/cloud1.png');
        this.load.image('cloud2', 'assets/cloud2.png');

        this.load.spritesheet('star', 'assets/stars.png', {
            frameWidth: 9, frameHeight: 9
        });

        this.load.spritesheet('moon', 'assets/moon.png', {
            frameWidth: 20, frameHeight: 40
        });

        this.load.spritesheet('bunny', 'assets/bunny-updated.png', {
            frameWidth: 88,
            frameHeight: 151
        })

        this.load.spritesheet('bunny-down', 'assets/dino-down.png', {
            frameWidth: 118,
            frameHeight: 94
        })

        this.load.spritesheet('enemy-bird', 'assets/enemy-bird.png', {
            frameWidth: 92,
            frameHeight: 77
        })

        // obstacles
        this.load.image('obstacle-1', 'assets/cherry.png')
        this.load.image('obstacle-2', 'assets/tallShroom_tan_red.png')
        this.load.image('obstacle-3', 'assets/gummyWormRedMid2.png')
        this.load.image('obstacle-4', 'assets/tallShroom_brown.png')
        this.load.image('obstacle-5', 'assets/tallShroom_red.png')
        this.load.image('obstacle-6', 'assets/tallShroom_red_brown.png')
        console.log('preload end');
    }

    create() {
        this.scene.start('PlayScene');
        console.log('preload create?');
    }
}

export default PreloadScene;
