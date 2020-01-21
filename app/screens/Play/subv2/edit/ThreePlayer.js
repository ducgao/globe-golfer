import React from 'react'
import {View, TouchableOpacity, Alert} from 'react-native'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import GameData from '../GameData'
import ScoreBoard3 from '../comps/ScoreBoard3'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'
import SelectItem from '../comps/CircleButton'
import PlayersInfo3 from '../comps/PlayersInfo3'

const HoleBoard3 = React.memo(({hole, result, onResultChanged}) => {

  const display = (score) => {
    switch (score) {
      case 1:
        return "1st"
      case 2:
        return "2nd"
      case 3:
        return "3rd"
      default:
        return "---"
    }
  }

  const onRequestChange = (player) => {
    Alert.alert("Select Finish Position", null, [
      {
        text: "1st",
        onPress: () => {
          result[player] = 1
          onResultChanged({...result})
        }
      },
      {
        text: "2nd",
        onPress: () => {
          result[player] = 2
          onResultChanged({...result})
        }
      },
      {
        text: "3rd",
        onPress: () => {
          result[player] = 3
          onResultChanged({...result})
        }
      },
    ])
  }

  const leftButton = <TouchableOpacity style={{
    height: 40,
    width: '40%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    backgroundColor: result.a > 0 ? Theme.buttonPrimary : null
  }} onPress={() => onRequestChange("a")}>
    <DGText style={{color: 'white'}}>{
      result.a > 0 ? display(result.a) : "---"
    }</DGText>
  </TouchableOpacity>

  const middleButton = <TouchableOpacity style={{
    height: 40,
    width: '40%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    backgroundColor: result.b > 0 ? Theme.buttonPrimary : null
  }} onPress={() => onRequestChange("b")}>
    <DGText style={{color: 'white'}}>{
      result.b > 0 ? display(result.b) : "---"
    }</DGText>
  </TouchableOpacity>

  const rightButton = <TouchableOpacity style={{
    height: 40,
    width: '40%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    backgroundColor: result.c > 2 ? Theme.buttonPrimary : null
  }} onPress={() => onRequestChange("c")}>
    <DGText style={{color: 'white'}}>{
      result.c > 0 ? display(result.c) : "---"
    }</DGText>
  </TouchableOpacity> 

  const controller = <View style={{
      flexDirection: 'row',
      width: '100%',
      marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24
    }}>
    {leftButton}
    {middleButton}
    {rightButton}
  </View>

  const holeInfo = <View style={{
    width: '60%',
    marginTop: 40,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Theme.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <DGText style={{color: 'white', fontSize: 30}}>{"Hole " + hole}</DGText>
  </View>

  return (
    <View style={{
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24
    }}>
      {holeInfo}
      {controller}
    </View>
  )
})

export default class EditResult3Player extends React.PureComponent {

  state = {
    scoreA: 0,
    scoreB: 0,
    scoreC: 0,
    processingHole: 1,
    displayResult: {}
  }

  onRequestNext = () => {
    const gameData = GameData.instance()

    if (this.state.processingHole == gameData.gameHoles) {
      this.props.navigation.navigate("Overview")
      return
    }

    const gameResults = gameData.gameResults
    const theScore = gameResults[this.state.processingHole - 1].result

    if (theScore.a > 0 && theScore.b >0 && theScore.c > 0) {
      const result = gameData.getCurrentScore3()
      this.setState({
        scoreA: result[0],
        scoreB: result[1],
        scoreC: result[2],
        processingHole: this.state.processingHole + 1,
        displayResult: {}
      })
    }
    else {
      Alert.alert("Oops!", "Please select player's position for hole " + this.state.processingHole)
    }
  }

  onResultChanged = (newResult) => {
    const gameData = GameData.instance()
    const gameResults = gameData.gameResults

    gameResults[this.state.processingHole - 1].result = newResult
    this.setState({displayResult: newResult})
  }

  render() {

    const gameData = GameData.instance()
    const gameResults = gameData.gameResults

    return (
      <BaseComponent>
        <Header />
        <PlayersInfo3
          playerA={gameData.playerA}
          playerB={gameData.playerB}
          playerC={gameData.playerC}
          showPoint
        />
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 12
        }}>
          <ScoreBoard3
            editable={false}
            playerAScore={this.state.scoreA}
            playerBScore={this.state.scoreB}
            playerCScore={this.state.scoreB}
            gameRelation={this.state.relation}
          />
          <HoleBoard3
            hole={gameResults[this.state.processingHole - 1].hole} 
            result={this.state.displayResult}
            onResultChanged={this.onResultChanged}  
          />
          <SelectItem 
            value={gameData.isTerminated ? "End" : "Record & Next"} 
            tint={Theme.buttonPrimary} 
            fixSize 
            onPress={this.onRequestNext} 
          />
        </View>
      </BaseComponent>
    )
  }
}