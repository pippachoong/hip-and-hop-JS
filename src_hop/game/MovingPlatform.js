import Phaser from '../lib/phaser.js'

export default class MovingPlatform extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y, texture, options){
    super(scene, x, y, texture, 0, options)

    scene.add.existing(this)

    this.setFriction(1, 0, Infinity)

    this.startX = x
    this.startY = y
  }

  moveHorizontally(){
    this.scene.tweens.addCounter({
      from: 0,
      to: -300,
      duration: 1500,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const x = this.startX + target.value
        const dx = x - this.x
        this.x = x
        this.setVelocityX(dx)
      }
    })
  }
}