import Phaser from './lib/phaser.js'

class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
    }

    create() {
        const { height, width } = this.game.config;

        this.gameSpeed = 10; // control 
        this.isGameRunning = false;
        this.respawnTime = 0;
        this.score = 0;

        this.jumpSound = this.sound.add('jump', { volume: 0.2 });
        this.hitSound = this.sound.add('hit', { volume: 0.2 });
        this.reachSound = this.sound.add('reach', { volume: 0.2 });
        this.hitRewardSound = this.sound.add('hit-reward', { volume: 0.2 });




        this.startTrigger = this.physics.add.sprite(0, height - 200, 'bunny-idle').setOrigin(-0.5, 1).setImmovable();// wont move. also 'bunny-ilde is a plcaeholder for triggering start'
        // ^^ this is to start sprite to move. y position, 0 starts from top not bottom!
        this.background = this.add.tileSprite(0, height, width, 0, 'background').setOrigin(0, 1)
        this.ground = this.add.tileSprite(0, height, width, 40, 'ground').setOrigin(0, 1)
        //                       ^^( xpos, ypos, width, height, texture(image) )
        this.bunny = this.physics.add.sprite(0, height, 'bunny-idle')
            //                          ^^ ( xpos, y pos, key, frame(optional) )
            .setCollideWorldBounds(true)//  stop from being able to run off screen's edges or jump through the top
            .setGravityY(5000) // 5000 pixels per second
            .setDepth(1) // main character is always shown front of the canvas
            .setOrigin(-0.5, 1);

        this.bunny.setBounce(0.2) // slight bounce for bunny


        // display of score 
        this.scoreText = this.add.text(width, 0, "00000", { fill: "#535353", font: '900 35px Courier', resolution: 5 })
            .setOrigin(1, 0)
            .setAlpha(0);// wont display by default

        // display of score if it's highest 
        this.highScoreText = this.add.text(0, 0, "00000", { fill: "#535353", font: '900 35px Courier', resolution: 5 })
            .setOrigin(1, 0)
            .setAlpha(0); // wont display by default

        // adding clouds in the background 
        this.environment = this.add.group();
        this.environment.addMultiple([
            this.add.image(width / 2, 170, 'cloud'),
            this.add.image(width - 80, 80, 'cloud2'),
            this.add.image((width / 1.3), 100, 'cloud')
        ]);
        this.environment.setAlpha(0);// display them only when the game starts

        this.welcomeScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(1) // setAlpha(0) to be hidden
        this.welcome = this.add.image(0, 0, 'welcome');
        this.welcomeScreen.add([
            this.welcome
        ])

        this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0) // setAlpha(0) to be hidden
        this.gameOverText = this.add.image(0, 0, 'game-over');
        this.restart = this.add.image(0, 80, 'restart').setInteractive();// setInteractive() add event handlers
        this.gameOverScreen.add([
            this.gameOverText, this.restart
        ])

        this.obstacles = this.physics.add.group();

        this.rewards = this.physics.add.group();


        this.initAnims();
        this.initStartTrigger();
        this.initColliders();
        this.handleInputs();
        this.handleScore(); // function to handle scores
    }

    // whenever it hits the obstacles
    initColliders() {
        // bunny and obstacles
        this.physics.add.collider(this.bunny, this.obstacles, () => {
            this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20; // position of score

            const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 5);
            const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

            this.highScoreText.setText('HI ' + newScore);// this is to collect prev high score
            this.highScoreText.setAlpha(1);

            this.physics.pause();
            this.isGameRunning = false;
            this.anims.pauseAll();
            this.bunny.setTexture('bunny-hurt');
            this.respawnTime = 0;
            this.gameSpeed = 10; // controller for gamespeed 10 pixels per second
            this.gameOverScreen.setAlpha(1); // setAlpha(1) to show game over image
            this.score = 0; // this is to restart the score 
            this.hitSound.play();
        }, null, this);

        // bunny and rewards
        this.physics.add.overlap(this.bunny, this.rewards, (bunny, collidedReward) => {
            this.score += 50;
            this.gameSpeed = 10; // controller for gamespeed 10 pixels per second
            this.hitRewardSound.play();
            collidedReward.disableBody(true, true);
        }, null, this);


    }



    initStartTrigger() {
        const { width, height } = this.game.config;
        this.physics.add.overlap(this.startTrigger, this.bunny, () => {
            console.log('trigger & bunny collided!');
            this.welcomeScreen.setAlpha(0)
            if (this.startTrigger.y === 10) {
                this.startTrigger.body.reset(0, 0);
                console.log('returned');
                return;
            }
            // as soon as it jumps and hits
            this.startTrigger.disableBody(true, true);
            // console.log('ceiling's hit')
            const startEvent = this.time.addEvent({
                delay: 1000 / 60,
                loop: true,
                callbackScope: this,
                callback: () => {
                    this.bunny.setVelocityX(80);// 80 pixels     
                    this.bunny.play('bunny-run', 1); // 
                    if (this.ground.width < width) {
                        this.ground.width += 17 * 2;
                    }
                    if (this.ground.width >= 1000) {
                        this.ground.width = width;
                        this.isGameRunning = true;
                        this.bunny.setVelocityX(0);// it's not running any longer
                        this.scoreText.setAlpha(1);
                        this.environment.setAlpha(1);// display some clouds
                        startEvent.remove();
                    }
                }
            });
        }, null, this)
    }

    initAnims() {

        this.anims.create({
            key: 'bunny-run',
            frames: this.anims.generateFrameNumbers('bunny', { start: 0, end: 3 }),
            //                                      ^^image, {animation frames start , end }
            frameRate: 10,// 10 times per second
            repeat: -1  // number to repeat
        })



        this.anims.create({
            key: 'bunny-down-anim',
            frames: this.anims.generateFrameNumbers('bunny-down', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'enemy-bunny-fly',
            frames: this.anims.generateFrameNumbers('enemy-bird', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })

        this.anims.create({
            key: 'reward-carrot-bunny',
            frames: this.anims.generateFrameNumbers('reward-1', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'reward-coin-bunny',
            frames: this.anims.generateFrameNumbers('reward-2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })


    }

    handleScore() {

        this.time.addEvent({
            delay: 1000 / 10,
            loop: true,
            callbackScope: this,
            callback: () => {
                if (!this.isGameRunning) { return; }

                this.score++;
                this.gameSpeed += 0.01 // increase the game speed gradually

                if (this.score % 100 === 0) {
                    this.reachSound.play();

                    this.tweens.add({
                        targets: this.scoreText,
                        duration: 100,
                        repeat: 3,
                        alpha: 0,
                        yoyo: true
                    })
                }
                // score is just a string. score to transfer into an array
                const score = Array.from(String(this.score), Number);
                for (let i = 0; i < 5 - String(this.score).length; i++) {
                    score.unshift(0);
                }

                this.scoreText.setText(score.join(''));
            }
        })
    }

    handleInputs() {
        this.restart.on('pointerdown', () => {
            // resetting to all initial state

            this.bunny.setVelocityY(60); //previous (0)
            this.bunny.body.height = 92;
            this.bunny.body.offset.y = 60;
            this.physics.resume();
            this.obstacles.clear(true, true);// removing all obstacles
            this.rewards.clear(true, true);// removing all rewards
            this.isGameRunning = true;
            this.gameOverScreen.setAlpha(0); //setAlpha(0) to be hidden
            this.anims.resumeAll();
        })

        this.input.keyboard.on('keydown_UP', () => {
            // if it's not touching the floor 
            if (this.bunny.body.velocity.x > 0) { return; }

            this.jumpSound.play();
            this.bunny.body.height = 92;
            this.bunny.body.offset.y = 60;
            this.bunny.setVelocityY(-1500);
            // this.bunny.setTexture('bunny', 0);
        })


        this.input.keyboard.on('keydown_RIGHT', () => {
            if (!this.isGameRunning) { return; }

            this.bunny.body.height = 92;
            this.bunny.body.offset.y = 60;
            this.bunny.setVelocityX(160);
        })

        // when not pressing right key
        this.input.keyboard.on('keyup_RIGHT', () => {
            // wont move until the game is running
            if (!this.isGameRunning) { return; }
            this.bunny.body.height = 92;
            this.bunny.body.offset.y = 60;
            this.bunny.setVelocityX(0);

        })

        // when not pressing right key
        this.input.keyboard.on('keyup_LEFT', () => {
            // wont move until the game is running
            if (!this.isGameRunning) { return; }

            this.bunny.body.height = 92;
            this.bunny.body.offset.y = 60;
            this.bunny.setVelocityX(0);

        })

        this.input.keyboard.on('keydown_LEFT', () => {

            if (!this.isGameRunning) { return; }

            this.bunny.body.height = 92;
            this.bunny.body.offset.y = 60;
            this.bunny.setVelocityX(-160);

        })



    }

    placeObstacle() {
        const obstacleNum = Math.floor(Math.random() * 7) + 1;// (total of 7 obstacles)
        const distance = Phaser.Math.Between(900, 1500);// the distance between obstacles in pixels
        // console.log('obstacleNum',obstacleNum)
        // console.log('distance',distance)

        let obstacle;
        if (obstacleNum > 6) {
            const enemyHeight = [40, 100]; // 20,50 pixels from the ground 
            obstacle = this.obstacles
                .create(this.game.config.width + distance, this.game.config.height - enemyHeight[Math.floor(Math.random() * 2)], `enemy-bird`)
                .setOrigin(0, 1)
            obstacle.play('enemy-bunny-fly', 1);
            obstacle.body.height = obstacle.body.height / 1.5;
        } else {
            obstacle = this.obstacles
                .create(this.game.config.width + distance, this.game.config.height, `obstacle-${obstacleNum}`)
                //                                                                              ^^ randomly generate obstacles
                .setOrigin(0, 1); // setting the obstacle position

            obstacle.body.offset.y = +10;
        }

        obstacle.setImmovable(); // wont move
    }

    placeReward() {
        const distance = Phaser.Math.Between(200, 700);// the distance between rewards in pixels
        // console.log('rewardNum',obstacleNum)
        // console.log('distance',distance)


        // reward = this.rewards
        //     .create(this.game.config.width + distance, this.game.config.height, `reward-${rewardNum}`)
        //     //                                                                              ^^ randomly generate rewards
        //     .setOrigin(0, 1); // setting the reward position


        let reward;
        let rewardAssets = [
            {
                fileName: "reward-1",
                animationName: "reward-carrot-bunny"
            },
            {
                fileName: "reward-2",
                animationName: "reward-coin-bunny"
            }
        ]
        const rewardNum = Math.floor(Math.random() * rewardAssets.length)

        const rewardHeight = [40, 150]; // 20,50 pixels from the ground 
        reward = this.rewards
            .create(this.game.config.width + distance, this.game.config.height - rewardHeight[Math.floor(Math.random() * 2)], rewardAssets[rewardNum].fileName)
        reward.play(rewardAssets[rewardNum].animationName, 1);
        reward.body.height = reward.body.height / 1.5;



        reward.setImmovable(); // wont move
    }



    // 60 fps
    update(time, delta) {
        if (!this.isGameRunning) { return }

        this.background.tilePositionX += 2// every updateground will move 2 pixel per sec
        // create a moving ground
        this.ground.tilePositionX += this.gameSpeed;// every update(sec) as per gameSpeed
        // .getChildren() - method to get all the obstacles as an array
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);

        Phaser.Actions.IncX(this.rewards.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.environment.getChildren(), - 0.5); // the speed of clouds moving 0.5 pixels per sec

        this.respawnTime += delta * this.gameSpeed * 0.08;
        // if respawnTime is equal or more tahn 1.5secs
        if (this.respawnTime >= 800) {
            this.placeObstacle();
            this.placeReward();
            this.respawnTime = 0;
        }

        this.obstacles.getChildren().forEach(obstacle => {
            // if it's not hitting the obstacles
            if (obstacle.getBounds().right < 0) {
                // console.log('miss hitting obstacle!');
                this.obstacles.killAndHide(obstacle);
            }
        })

        this.rewards.getChildren().forEach(reward => {
            // if it's not hitting the rewards
            if (reward.getBounds().right < 0) {
                // console.log('miss hitting reward!');
                this.rewards.killAndHide(reward);
            }
        })



        this.environment.getChildren().forEach(env => {
            if (env.getBounds().right < 0) {
                env.x = this.game.config.width + 30;
            }
        })

        // if bunny is jumping
        if (this.bunny.body.deltaAbsY() > 0) {
            this.bunny.anims.stop();
            this.bunny.setTexture('bunny', 0); // set the image that it's no moving
        } else {
            // if bunny's height is less than 58 - insert this image else other image
            this.bunny.body.height <= 60 ? this.bunny.play('bunny-down-anim', true) : this.bunny.play('bunny-run', true);
        }
    }
}

export default PlayScene;
