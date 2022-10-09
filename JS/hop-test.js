

let Hop = function(){}
Hop.Play = function(){}

Hop.Play.prototype = {
  
  preload: function(){
    this.load.image('sky', 'assets/sky.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.image('star', 'assets/star.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.spritesheet('sprite', 
        'assets/sprite.png',
        { frameWidth: 32, frameHeight: 55 }
    )

  },
  
  create: function(){
    
    

    let scoreText;
    let score = 0;
    
    // this.add.image(200, 300, 'star')
    // game.stage.backgroundColor = '#6bf'

    // scaling and being responsive
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.maxWidth = this.game.width;
    // this.scale.maxHeight = this.game.height;
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;
    // this.scale.setScreenSize( true );

    this.cameraYMin = 99999
    this.playformYMin = 99999
    
    this.add.image(0, 0, 'sky').setOrigin(0, 0)

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    bombs = this.physics.add.group()
    this.platforms = this.physics.add.staticGroup()
  
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(80, 400)
      const y = 150 * i
      const platform = this.platforms.create(x, y, 'ground')
      platform.scale = 0.4

      const body = platform.body
      body.updateFromGameObject()
      
    }
  
    // this.platforms.create(600, 400, 'ground')
    // this.platforms.create(50, 250, 'ground')
    // this.platforms.create(750, 220, 'ground')
  
    player = this.physics.add.sprite(100, 450, 'sprite')
  
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)
    player.body.setGravityY(300)
    
    this.physics.add.collider(player, this.platforms)
  
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'sprite', frame: 4 } ],
        frameRate: 20
    })
  
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('sprite', { start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    })
  
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11, // already give 1 at default, so 11 + 1 = 12 in total
        setXY: { X: 12, y: 0, stepX: 70 } 
        // placing of stars, this means start at 12-0, and every 70 pixels on X axis one more star 
    })
  
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        // give each children in the group a random Y bounce value, 0 is none, 1 is full bounce
    })
  
    this.physics.add.collider(stars, this.platforms)
  
    // this tells Phaser to check for an overlap between the player and any star in the stars group. If found then they are passed to the 'collectStar' function
    this.physics.add.overlap(player, stars, collectStar, null, this)
  
    function collectStar (player, star){
        star.disableBody(true, true)
  
        score += 10
        scoreText.setText(`Score: ${score}`)
  
        // we use a Group method called countActive
        // see how many stars are left alive.
        // if it's none then the player has collected them all, so we
        // use the iterate function to re-enable all of the stars
        // and reset their y position to zero. This will make all of the
        // stars drop from the top of the screen again
        if (stars.countActive(true) === 0){
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true)
            })
        
            // this part of the code creates a bomb
            // first we pick a random x coordinate for it,
            // always on the opposite side of the screen to the player, 
            // just to give them a chance.
            // then the bomb is created, it's set to collide with the world, bounce
            // and a random velocity
            let x = (player.x < 400) ? 
            Phaser.Math.Between(400, 800) 
            :
            Phaser.Math.Between(0, 400)
  
            let bomb = bombs.create(x, 16, 'bomb')
            bomb.setBounce(1)
            bomb.setCollideWorldBounds(true)
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        }
    }
    
    this.physics.add.collider(bombs, this.platforms)
    this.physics.add.collider(player, bombs, hitBomb, null, this)
  
    function hitBomb(player, bomb){
        this.physics.pause()
  
        player.setTint(0xff0000)
  
        player.anims.play('turn')
  
        gameOver = true
    }
  
  },
  
  update: function(){
    
    const cursors = this.input.keyboard.createCursorKeys()
  
    if (cursors.left.isDown){
  
        player.setVelocityX(-160);
        player.anims.play('left', true)
  
    } else if (cursors.right.isDown){
  
        player.setVelocityX(160);
        player.anims.play('right', true)
  
    } else {
  
        player.setVelocityX(0)
        player.anims.play('turn')
  
    }
  
    if (cursors.up.isDown && player.body.touching.down){
  
        player.setVelocityY(-500)
    }
  
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300},
      debug: false
    }
  },
  scene: {
    preload: Hop.Play.prototype.preload,
    create: Hop.Play.prototype.create,
    update: Hop.Play.prototype.update,
  }
}

const game = new Phaser.Game(config)


