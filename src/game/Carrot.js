import Phaser from '../lib/phaser.js'

export default class Carrot extends Phaser.Physics.Arcade.Sprite {

  // takes in a scene reference, x pos, y pos, and loaded image to use
  constructor(scene, x, y, texture){

    // the line with super() is to call the constructor of the parent class: Phaser.GameObjects.Sprite
    // similar to Ruby's initialize()

    super(scene, x, y, texture)
    this.setScale(0.5)
  }

}