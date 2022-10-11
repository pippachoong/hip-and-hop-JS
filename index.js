
import Phaser from './lib/phaser.js';

import PlayScene from './PlayScene';
import PreloadScene from './PreloadScene';

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 700,
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true // this is to show border box when debugging
    }
  },
  scene: [PreloadScene, PlayScene],

};

new Phaser.Game(config);
