import Phaser from "./lib/phaser.js";

export default class EndScene extends Phaser.Scene {
    constructor() {
        super('end-scene')
    }

    init(data) {
        console.log('data', data)
        this.score = data.score
        this.playerName = data.playerName

    }

    create() {

        let BAgitSE_URL;
        if (location.href.includes('netlify')) {
            BASE_URL = 'https://hipandhop.herokuapp.com';
        } else {
            BASE_URL = 'http://localhost:3000';
        }

        // this is the axios post to update the user's hip score at the database
        axios.post(`${BASE_URL}/submit-hip-score`, {
            score: this.score,
            name: this.playerName
        })
            .then(res => {
                console.log('new score:', res.data)
                // On successfully posting high score, fetch latest score
                axios.get(`${BASE_URL}/hip-scores`)
                    .then(res => {

                        console.log(res.data)
                        const results = res.data
                        let textContent = ["GAME____OVER", "", "name      score", ""]

                        for (let i = 0; i < results.length; i++) {
                            const perLineResults = `${results[i].name}_____${results[i].hipScore}`

                            textContent.push(perLineResults)

                        }
                        console.log('textcontent', textContent)

                        const width = this.scale.width
                        const height = this.scale.height
                        console.log('width and height', width, height);
                        this.add.text(width * 0.5, height * 0.5, textContent, {
                            fontSize: 30
                        })
                            .setOrigin(0.5)

                    })
                    .catch(err => {
                        console.log('error getting scores:', err)
                    })
            })
            .catch(err => {
                console.log('Error posting results:', err)
            })

        // this is the axios get to grab the top 5 user name and their score, and show it in a screen


        // add restart button
        this.restart = this.add.image(500, 500, 'restart').setInteractive();// setInteractive() add event handlers


        this.restart.on('pointerdown', () => {
            // resetting to all initial state
            this.scene.start('PlayScene')

        })


    }
}

