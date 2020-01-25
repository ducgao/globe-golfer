
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

  getCurrentScore3() {
    let aScore = 0
    let bScore = 0
    let cScore = 0

    let holeLeft = 0

    this.gameResults.forEach(g => {
      if (g.a == 1) {
        aScore++
      }
      else if (g.b == 1) {
        bScore++
      }
      else if (g.c == 1) {
        cScore++
      }
      else if (g.result == -1) {
        holeLeft++
      }
    });

    const lowest = Math.min(aScore, bScore, cScore)
    const highest = Math.max(aScore, bScore, cScore)
    let middle = lowest

    [aScore, bScore, cScore].forEach(t => {
      if (middle != lowest && middle != highest) {
        middle = t
      }
    })

    if ((middle + holeLeft) < highest) {
      this.isTerminated = true
    }

    return [aScore - lowest, bScore - lowest, cScore - lowest]
  }
}