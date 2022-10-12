import Phaser from "../lib/phaser.js";

export default class GameOver extends Phaser.Scene {
  constructor(){
    super('game-over')
  }

  init(data){
    this.score = data.score
    this.playerName = data.playerName
    
  }

  create(){

    let BASE_URL = 'http://localhost:3000'

    // this is the axios post to update the user's hop score at the database
    axios.post(`${BASE_URL}/submit-hop-score`, {
      score: this.score,
      name: this.playerName
    })
      .then( res => {
        console.log('new score:', res.data)
      })
      .catch( err => {
        console.log('Error posting results:', err)
      })

    // this is the axios get to grab the top 5 user name and their score, and show it in a screen
    axios.get(`${BASE_URL}/hop-scores`, {
    })
      .then( res => {

        console.log(res.data)
        const results = res.data
        let textContent = ["GAME____OVER", "", "name      score",""]

        for (let i = 0; i < results.length; i++) {
          const perLineResults = `${results[i].name}_____${results[i].hopScore}`

          textContent.push(perLineResults)
          
        }
        console.log(textContent)

        const width = this.scale.width
        const height = this.scale.height
        this.add.text(width * 0.5, height * 0.5, textContent, {
          fontSize: 30
        })
        .setOrigin(0.5)

      })
      .catch( err => {
        console.log('error getting scores:', err)
      })


    this.input.keyboard.once('keydown-SPACE', ()=> {
      this.scene.start('game')
    })
  }

}