import EndScene from './EndScene.js';
import Phaser from './lib/phaser.js'
import PlayScene from './PlayScene.js';
import PreloadScene from './PreloadScene.js';


const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    pixelArt: true,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [PreloadScene, PlayScene, EndScene]
};

new Phaser.Game(config);
