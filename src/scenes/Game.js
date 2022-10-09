import Phaser from '../lib/phaser.js'

// import the carrot class here
import Carrot from '../game/Carrot.js'


export default class Game extends Phaser.Scene {
  constructor(){
    super('game')
  }

  // type - {Phaser.Physics.Arcade.Sprite}
  // declaration of the player property that will be used as this.player
  player

  platforms

  cursors

  // specify images, audio, or other assets to load before starting the scene
  preload(){
    
    // Game Scene has a member called `load` which is inherited from Phaser.Scene
    // load background image
    this.load.image('background', 'assets/bg_layer1.png')

    // load the platform image
    this.load.image('platform', 'assets/ground_grass.png')

    // load the player / bunny
    this.load.image('bunny', 'assets/sprite.png')

    // load the carrot
    this.load.image('carrot', 'assets/carrot.png')

    // load the usage of keyboard arrow keys
    this.cursors = this.input.keyboard.createCursorKeys()
    

  } // preload()

  // create() is called once all the assets for the Scene have been loaded.
  // only assets that have been loaded using preload() can be used in create
  create(){

    this.add.image(240, 320, 'background') // (xPos, yPos, key in preload())
      .setScrollFactor(1, 0) 
      // by setting y scroll factor to 0 we can keep the background from scrolling up and down with the camera
    
    // create a group of static platforms
    this.platforms = this.physics.add.staticGroup()

    // then create 5 platforms from the group
    for (let i = 0; i < 5; i++) {
      
      const x = Phaser.Math.Between(80, 400) // create a random number between 80 to 400
      const y =  150 * i // set 150 pixels apart vertically

      const platform = this.platforms.create(x, y, 'platform')
      platform.scale = 0.5

      const body = platform.body

      // Refresh the physics body based on any changes we made to the GameObject like position and scale
      body.updateFromGameObject() 
      
    }

    this.player = this.physics.add.sprite(240, 320, 'bunny').setScale(0.5)

    // tell the game what things should collide
    this.physics.add.collider(this.platforms, this.player)

    // follow the player as it jumps
    this.cameras.main.startFollow(this.player)   

    // set the horizontal dead zone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5)

    // create a carrot
    this.carrots = this.physics.add.group({
      classType: Carrot
    })

    this.carrots.get(240, 430, 'carrot')

    // create collidor for platform and carrot
    this.physics.add.collider(this.platforms, this.carrots)
    
  } // create()

  // similar to "update loop", this code gets called every frame
  update(){

    const touchingDown = this.player.body.touching.down

    if (touchingDown){
      this.player.setVelocityY(-300)
    }

    // left and right input logic
    if (this.cursors.left.isDown && !touchingDown){
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown && !touchingDown){
      this.player.setVelocityX(200)
    } else {
      this.player.setVelocityX(0)
    }

    // checkCollision is a property where we can set which directions we want collision for
    // so that the bunny can jump to above platforms directly below the platform
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false 

    // takes platforms from the bottom of the screen and moves them to the top
    // iterate through the children in the group
    this.platforms.children.iterate( child => {
      const platform = child

      const scrollY = this.cameras.main.scrollY

      // console.log(scrollY)
      if (platform.y >= scrollY + 700){
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()

        // create a carrot above the platform being reused
        this.addCarrotAbove(platform)
      }
    })

    this.horizontalWrap(this.player)



    //find out from Arcade Physics

    // const cursors = this.input.keyboard.createCursorKeys()
  
    // if (cursors.left.isDown){
  
    //     this.player.setVelocityX(-160);
    //     player.anims.play('left', true)
  
    // } else if (cursors.right.isDown){
  
    //     player.setVelocityX(160);
    //     player.anims.play('right', true)
  
    // } else {
  
    //     player.setVelocityX(0)
    //     player.anims.play('turn')
  
    // }
  
    // if (cursors.up.isDown && player.body.touching.down){
  
    //     player.setVelocityY(-500)
    // }



  } // update()

  // method for screep wrapping
  horizontalWrap(sprite){

    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width

    // console.log(`sprite.x:`, sprite.x)
    // console.log(`sprite.y:`, sprite.y)
    // console.log(`halfWidth:`, halfWidth)
    // console.log(`gameWidth:`, gameWidth)

    // if the sprite goes past the left side more than half its width
    // then teleport to the rightside plus half its width
    // then do the reverse when goes past the right side more than half its width
    if ( sprite.x < -halfWidth ){
      sprite.x = gameWidth + halfWidth
    } else if ( sprite.x > gameWidth + halfWidth){
      sprite.x = -halfWidth
    }

  }

  // method for creating carrot above sprite
  addCarrotAbove(sprite){
    const y = sprite.y - sprite.displayHeight

    // the carrot instance is positioned above the given sprite using its display height as guide
    const carrot = this.carrots.get(sprite.x, y, 'carrot')

    this.add.existing(carrot)

    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height)

    return carrot

  }

}




