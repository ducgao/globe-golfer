
const GameHoles = [
  0,
  9,
  9,
  9,
  18
]

export default class GameData {
  static _instance = null
  static instance() {
      if (this._instance == null) {
          this._instance = new GameData()
      }
      
      return this._instance
  } 

  root1 = null
  root2 = null

  playerA = null  
  playerB = null

  playerC = null
  playerD = null

  challengeId = null

  gameType = null
  gameId = null
  gameHoles = 0

  gameResults = []

  isTerminated = false

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
    this.isTerminated = false

    for (let i = 0; i < this.gameHoles; i++) {
      this.gameResults.push({hole: i + 1, result: -1})
    }
  }

  getCurrentScore() {
    let tA = 0
    let tB = 0
    
    let holeLeft = 0

    this.gameResults.forEach(g => {
      if (g.result == 1) {
        tA++
      }
      else if (g.result == 2) {
        tB++
      }
      else if (g.result == -1) {
        holeLeft++
      }
    });
    
    let finalA = tA > tB ? (tA - tB) : 0
    let finalB = tB > tA ? (tB - tA) : 0

    if (finalA > holeLeft || finalB > holeLeft) {
      this.isTerminated = true
      if (finalA > finalB) {
        finalB = holeLeft
      }
      else {
        finalA = holeLeft
      }
    }

    return [finalA, finalB, finalA === finalB ? "A/S" : "UP"]
  }
}