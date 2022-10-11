import Phaser from './lib/phaser.js'
import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({

  // Phaser.AUTO meaning Phaser will decide to use Canvas or WebGL mode depending on the browser and devide.
  
  type: Phaser.AUTO,
  width: 1080,
  height: 640,
  scene: [Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      // debug: true //enables collision boxes
    }
  }
})