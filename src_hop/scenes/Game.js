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

  playerName

  playerHopScore

  platforms

  cursors

  carrotsCollected = 0

  carrotsCollectedText

  // debugging text to display
  debugText
  secondDebugText


  // init() method is called by Phaser before preload().
  init(){
    
    this.carrotsCollected = 0
  }

  // specify images, audio, or other assets to load before starting the scene
  preload(){
    
    // Game Scene has a member called `load` which is inherited from Phaser.Scene
    // load background image
    this.load.image('background', 'assets/bg_layer1.png')

    this.load.image('foreground', 'assets/bg_layer2.png')

    // load the platform image
    this.load.image('platform', 'assets/ground_grass.png')

    // load the player / bunny
    this.load.spritesheet('bunny', 'assets/sprite.png', { frameWidth: 150, frameHeight: 207 })

    // load the carrot
    this.load.image('carrot', 'assets/carrot.png')

    this.load.image('slippery_platform', 'assets/ground_snow.png')

    // load the usage of keyboard arrow keys
    this.cursors = this.input.keyboard.createCursorKeys()

    this.load.image('cloud1', 'assets/cloud1.png')

    this.load.image('cloud2', 'assets/cloud1.png')

    this.load.audio('jump', 'assets/jump.m4a');
    this.load.audio('eatCarrot', 'assets/eat_carrot.ogg');
    this.load.audio('gameOver', 'assets/Level_failed1.ogg');
    

  } // preload()

  // create() is called once all the assets for the Scene have been loaded.
  // only assets that have been loaded using preload() can be used in create
  create(){
    
    let BASE_URL;
    if( location.href.includes('netlify') ){
      BASE_URL = 'https://hipandhop.herokuapp.com';
    } else {
      BASE_URL = 'http://localhost:3000';
    }
    
    const token = localStorage.getItem("token")
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    // this is the axios get to get the logged in user name
    axios.get(`${BASE_URL}/current_user`)
      .then( res => {
        console.log(res)
        this.playerName = res.data.name
        // this.playerHopScore = res.data.hopScore
        console.log(this.playerName)
      })
      .catch( err => {
        console.log('error getting user name:', err)
      })

    window.game = this

    this.background = this.add.image(240, 320, 'background') // (xPos, yPos, key in preload())
      .setScrollFactor(1, 0) 
      // by setting y scroll factor to 0 we can keep the background from scrolling up and down with the camera

    this.foreground = this.add.image(240, 320, 'foreground') // (xPos, yPos, key in preload())
      .setScrollFactor(1, 0) 
      // by setting y scroll factor to 0 we can keep the background from scrolling up and down with the camera


    this.cloud1 = this.add.image(150, 240, 'cloud1')
      .setScrollFactor(1, 0)
      .setAlpha(0.5)

    this.cloud2 = this.add.image(350, 500, 'cloud2')
      .setScrollFactor(1, 0)
      .setAlpha(0.5)

    this.jumpSound = this.sound.add('jump', { volume: 0.2 });
    this.eatCarrot = this.sound.add('eatCarrot', { volume: 0.2 });
    this.gameOver = this.sound.add('gameOver', { volume: 0.2 });

    
    // create a group of dynamic platforms
    this.platforms = this.physics.add.group()

    // add player
    this.player = this.physics.add.sprite(240, 0, 'bunny').setScale(0.5)
    
    // create base platform
    this.basePlatform = this.physics.add.staticGroup()
    this.base = this.basePlatform.create(240, 200, 'platform').setScale(2).refreshBody()

    // debugging text
    // only show debug text in local host mode

    this.debugText = this.add.text(10, 10, 'debugging text', {font: '12px Courier', fill: '#000000'})
    this.debugText.setScrollFactor(0)

    this.secondDebugText = this.add.text(10, 60, 'debugging text', {font: '12px Courier', fill: '#000000'})
    this.secondDebugText.setScrollFactor(0)

    // create a carrot
    this.carrots = this.physics.add.group({
      classType: Carrot
    })

    const slipperyIcePlatform = (platform, sprite) => {
      if (platform.body.touching.up && sprite.body.touching.down) {
        // console.log('touched', platform.slideAmount)
        sprite.body.x += platform.slideAmount
        
        // sprite.body.useDamping
        // -sprite.body.velocity.x * (1 - sprite.body.drag.x)
        sprite.body.friction.x=0
        // console.log(sprite.body.velocity.x)
        // console.log(sprite.body.drag.x)
      }
    }


    // then create 10 platforms from the group
    for (let i = 0; i < 10; i++) {
      
      const middlePoint = this.scale.width / 2

      const x = Phaser.Math.Between(middlePoint * 0.2, middlePoint * 1.8)

      const y =  -200 * i // set 150 pixels apart vertically

      const scaleArray = [0.5, 0.35, 0.35, 0.3, 0.25, 0.2]

      const randomScaleValue = scaleArray[parseInt(Math.random() * scaleArray.length)]

      if ( i < 7 ){
  
        const platform = this.platforms.create(x, y, 'platform')
          .setImmovable(true)
          .setVelocity(0, 0);
  
        platform.body.setAllowGravity(false);
      
        platform.scale = randomScaleValue
  
        this.addCarrotAbove(platform)
  
        // const body = platform.body
  
        // Refresh the physics body based on any changes we made to the GameObject like position and scale
        // body.updateFromGameObject() 
  
        if ( i > 3 && i < 7 ){
  
          const randomNum = Phaser.Math.Between(-400, 400)
  
          const time = 1000
  
          this.tweens.timeline({
            targets: platform.body.velocity,
            loop: -1,
            tweens: [
              { x: randomNum, duration: time, ease: 'Stepped' },
              { x: 0, duration: time, ease: 'Stepped' },
              { x: -randomNum, duration: time, ease: 'Stepped' },
              { x: 0, duration: time, ease: 'Stepped' },
            ]
          }); 
  
          platform.scale = randomScaleValue
        }

      } else {

        const slipperyPlatform = this.platforms.create(x, y, 'slippery_platform')
          .setImmovable(true)
          .setVelocity(0, 0)
     
        slipperyPlatform.body.setAllowGravity(false);
      
        slipperyPlatform.scale = randomScaleValue

        const slide = Phaser.Math.Between(3, 6) * (Math.random() > 0.5 ? 1 : -1)

        slipperyPlatform.slideAmount = slide
  
        this.addCarrotAbove(slipperyPlatform)

        this.physics.add.collider(slipperyPlatform, this.player, slipperyIcePlatform)

      }
      
    }

    // add weight (gravity) to player
    this.player.body.setGravityY(250)


    const collisionMovingPlatform = (platform, sprite) => {

      if (platform.body.touching.up && sprite.body.touching.down) {
       
        sprite.isOnPlatform = true;
        sprite.currentPlatform = platform;
      }
    };

    

    // tell the game what things should collide
    this.physics.add.collider(this.platforms, this.player, collisionMovingPlatform)
    this.physics.add.collider(this.basePlatform, this.player)
    
    // this.physics.add.collider(this.movingPlatform, this.player, collisionMovingPlatform )
    
    // follow the player as it jumps
    this.cameras.main.startFollow(this.player)

    // set the horizontal dead zone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5)

    

    // create collidor for platform and carrot
    this.physics.add.collider(this.platforms, this.carrots, collisionMovingPlatform)

    // overlap is used to check to see if the target body, or an array of target bodies,
    // intersects with any of the given bodies.
    // if intersection occurs in this method will return `true`, and if provided, invoke the callbacks.
    // overlap(target, [bodies], [overlapCallBack], [processCallback], [callbackContext])
    this.physics.add.overlap(
      this.player, // target
      this.carrots, // [bodies]
      this.handleCollectCarrot, // called on overlap
      undefined, // don't need process callback
      this // `this` is the Game Scene instance when handleCollectCarrot() method is called
    )

    // Add carrot score to scene
    const style = { color: '#000', fontSize: 24}
    this.carrotsCollectedText = this.add.text( 240, 10, 'Carrots: 0', style)
      .setScrollFactor(0) // to scroll along with camera
      .setOrigin(0.5, 0) // keep the text centered


    // Create anims for sprite ----------------------------------------
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('bunny', { start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'bunny', frame: 4 } ],
      frameRate: 20
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('bunny', { start: 5, end: 8}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'jump',
      frames: [ { key: 'bunny', frame: 9 } ],
      frameRate: 20
    })

    // console.log(this.anims)
    
  } // create()

  // similar to "update loop", this code gets called every frame
  update(){

    const touchingDown = this.player.body.touching.down

    // if (touchingDown){
    //   this.player.setVelocityY(-300)
    // }

    // left and right input logic
    if (this.cursors.left.isDown){

      this.player.setVelocityX(-200)
      this.player.anims.play('left', true)

    } else if (this.cursors.right.isDown){

      this.player.setVelocityX(200)
      this.player.anims.play('right', true)

    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn')
    }

    // jump logic
    if (this.cursors.up.isDown && touchingDown){
      this.player.setVelocityY(-450)
      this.jumpSound.play();

    } else if (!touchingDown){
      this.player.anims.play('jump')
    }

    // checkCollision is a property where we can set which directions we want collision for
    // so that the bunny can jump to above platforms directly below the platform
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false
    

    // disable base platform when player traverse far enough
    if (this.player.y < 0){
      this.basePlatform.killAndHide(this.base)
      this.physics.world.disableBody(this.base.body)
    }

    // takes platforms from the bottom of the screen and moves them to the top
    // iterate through the children in the group
    this.platforms.children.iterate( child => {
      const platform = child
      // console.log(platform.y)
      const scrollY = this.cameras.main.scrollY

      const middlePoint = this.scale.width / 2

      // console.log(scrollY)
      if (platform.y >= scrollY + 800){
        platform.y = scrollY - 1000 - Phaser.Math.Between(100, 120)
        platform.x = Phaser.Math.Between(middlePoint * 0.2, middlePoint * 1.8)
        
        // platform.body.updateFromGameObject()
        // create a carrot above the platform being reused
        this.addCarrotAbove(platform)
      }
    })

    // calling horizontalWrap method
    this.horizontalWrap(this.player)

    // for game over
    const bottomPlatform = this.findBottomMostPlatform()
    
    // if player is past 200 pixels than the bottom most platform, it will be game over
    if (this.player.y > bottomPlatform.y + 300){
      this.gameOver.play()
      this.scene.start('game-over', {
        score: this.carrotsCollected,
        playerName: this.playerName
      })
    }


    this.debugText.setText([
      `object: ${this.player}`,
      `body.velocity.x: ${this.player.body.velocity.x}`,
      // `y: ${this.player.y}`,
    ])

    this.secondDebugText.setText([
      `object: drag.x`,
      `drag.x ${this.player.body.drag.x}`,
    ])


  } // update()

  // method for screep wrapping
  horizontalWrap(sprite){

    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width

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

    // set active and visible
    carrot.setActive(true)
    carrot.setVisible(true)

    this.add.existing(carrot)

    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height)

    // make sure body is enabled in the physics world
    this.physics.world.enable(carrot)

    return carrot

  } // addCarrotAbove()

  handleCollectCarrot(player, carrot){

    // the carrot will disappear once the player touches the carrot
    this.carrots.killAndHide(carrot)

    // disable from physics world
    this.physics.world.disableBody(carrot.body)

    // increment by 1 when carrot is picked up
    this.carrotsCollected++

    this.eatCarrot.play()

    console.log(this.carrotsCollected)
    // create new text value and set it
    const value = `Carrots: ${this.carrotsCollected}`
    this.carrotsCollectedText.text = value

  } // handleCollectCarrot()

  // method for identifying which playform in the platforms group is the last one visually
  findBottomMostPlatform(){

    // start by getting all the platforms as an Array with this.platforms.getChildren()
    const platforms = this.platforms.getChildren()

    // pick first one in the Array as the current bottom most platform
    let bottomPlatform = platforms[0]

    for (let i = 0; i < platforms.length; i++) {
      
      // iterate over the Array and compare each platform against the curent bottomPlatform.
      // if a platform's y position is greater than the bottomPlatform then we set it as the new bottomPlatform
      const platform = platforms[i]
      if (platform.y < bottomPlatform.y){
        continue
      }

      // once the entire array was iterated, the last platform is the bottom most platform
      bottomPlatform = platform
      
    }
    // and it gets returned
    return bottomPlatform
  } // findBottomMostPlatform()

  
}


