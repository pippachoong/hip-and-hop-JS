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

    const token = localStorage.getItem("token")

    // this is the axios post to update the user's hop score at the database
    axios.post(`${BASE_URL}/submit-hop-score`, {
      score: this.score,
      name: this.playerName
    })
      .then( res => {
        console.log('new score:', res.data)
        // this is the axios get to grab the top 5 user name and their score, and show it in a screen
        axios.get(`${BASE_URL}/hop-scores`, {
        })
          .then( res => {
    
            let textContent;
    
            const results = res.data
    
            if (token){
    
              textContent = ["GAME____OVER", "", "name      score",""]
    
              for (let i = 0; i < results.length; i++) {
                const perLineResults = `${results[i].name}_____${results[i].hopScore}`
      
                textContent.push(perLineResults)
                
              }
            } else {
              textContent = ["GAME____OVER", "", "Sign Up / Log In", "to store your scores!"]
            }
            textContent.push('')
            textContent.push('press SPACEBAR')
            textContent.push('to play again!')
    
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
      })
      .catch( err => {
        console.log('Error posting results:', err)
      })



    this.input.keyboard.once('keydown-SPACE', ()=> {
      this.scene.start('game')
    })
  }

}