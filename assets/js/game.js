// two new variables: game and scores
// game will be set to the Phase Game instance that will be created. scores will be the array of score values that is returned from the /scores endpoint.
let game, scores;


class Highscore extends Phaser.Scene {
    constructor() {
        super({
            key: 'Highscore',
            active: true
        });
        this.scores = [];
    }
    // preload(), loaded in a new bitmap font, and then in the create method, added new bitmap text to the scene. 
    // This bitmap text will serve has the header row of the leaderboard.
    preload() {
        this.load.bitmapFont('arcade', 'assets/arcade.png', 'assets/arcade.xml');
    }
    create() {
        // oop through the scores array and add a new bitmap text row to the leaderboard. 
        this.add.bitmapText(100, 110, 'arcade', 'RANK  SCORE   NAME').setTint(0xffffff);
        for (let i = 1; i < 6; i++) {
            if (scores[i - 1]) {
                this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      ${scores[i - 1].highScore}    ${scores[i - 1].name}`).setTint(0xffffff);
            } else {
                this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      0    ---`).setTint(0xffffff);
            }
        }
    }
}

// Phaser config object and used ajax to send a GET request to the /scores endpoint. 
// Once received a success response from the endpoint, store the results into the score variable and create the Phaser Game instance.
let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [Highscore]
};
$.ajax({
    type: 'GET',
    url: '/scores',
    success: function (data) {
        game = new Phaser.Game(config);
        scores = data;
    },
    error: function (xhr) {
        console.log(xhr);
    }
});