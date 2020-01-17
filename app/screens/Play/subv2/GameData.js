
const GameHoles = [
  0,
  9,
  9,
  9,
  9
]

export default class GameData {
  static _instance = null
  static instance() {
      if (this._instance == null) {
          this._instance = new GameData()
      }
      
      return this._instance
  } 

  playerA = {
    avatar: "https://ideapod.com/wp-content/uploads/2017/06/stencil.facebook-post-20.jpg",
    name: "Alexandre M",
    userId: "1"
  }
  
  playerB = {
    avatar: "https://www.midlandsderm.com/wp-content/uploads/2019/04/Rachel-R.-Person.jpg",
    name: "Frencois B",
    userId: "2"
  }

  playerC = null
  playerD = null

  challengeId = null

  gameType = null
  gameId = null
  gameHoles = 0

  gameResults = []

  reset() {
    this.gameType = null
    this.gameHoles = 0

    this.gameResults = []

    this.playerC = null
    this.playerD = null
  }

  setGameType(type) {
    this.gameType = type
    this.gameHoles = GameHoles[type]
    this.gameResults = []

    for (let i = 0; i < this.gameHoles; i++) {
      this.gameResults.push({hole: i + 1, result: -1})
    }
  }

  getCurrentScore() {
    let sA = 0
    let tA = 0

    let tH = 0

    let sB = 0
    let tB = 0

    this.gameResults.forEach(g => {
      if (g.result == 1) {
        sA++
        tA++
        sB--
      }
      else if (g.result == 2) {
        sB++
        tB++
        sA--
      }
      else if (g.result == 0) {
        tH++
      }
    });
    
    const fA = tA - tB
    const fB = (tA + tB + tH) === this.gameResults.length ? "UP" : "&"

    
    const finalA = Math.abs(fA)
    const finalB = this.gameResults.length - (tA + tB + tH)

    return [finalA, finalB, fB]
  }
}