import React from 'react'
import {View, TouchableOpacity, Alert, ScrollView} from 'react-native'
import PlayersInfo from '../comps/PlayersInfo'
import PlayersInfo3 from '../comps/PlayersInfo3'
import PlayersInfo4 from '../comps/PlayersInfo4'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import GameData from '../GameData'
import ScoreBoard from '../comps/ScoreBoard'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'
import SelectItem from '../comps/CircleButton'

const HoleBoard = React.memo(({hole, result, onResultChanged, gameEnded}) => {

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
    backgroundColor: result == 1 ? Theme.buttonPrimary : null
  }} onPress={() => onResultChanged(1)}>
    <DGText style={{color: 'white'}}>WIN</DGText>
  </TouchableOpacity>

  const middleButton = <TouchableOpacity style={{
    height: 40,
    width: '40%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    backgroundColor: result == 0 ? Theme.buttonPrimary : null
  }} onPress={() => onResultChanged(0)}>
    <DGText style={{color: 'white'}}>A/S</DGText>
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
    backgroundColor: result == 2 ? Theme.buttonPrimary : null
  }} onPress={() => onResultChanged(2)}>
    <DGText style={{color: 'white'}}>WIN</DGText>
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
    minWidth: '60%',
    marginTop: 40,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Theme.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  }}>
    <DGText style={{color: 'white', fontSize: 30}}>{hole}</DGText>
  </View>

  return (
    <View style={{
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24
    }}>
      {holeInfo}
      {gameEnded ? undefined : controller}
    </View>
  )
})

export default class EditResult2Player extends React.PureComponent {

  state = {
    scoreA: 0,
    scoreB: 0,
    relation: "&",
    processingHole: 1,
    displayResult: null
  }

  onRequestNext = () => {
    const gameData = GameData.instance()

    const gameResults = gameData.gameResults
    const theScore = gameResults[this.state.processingHole - 1].result

    if (gameData.isTerminated) {
      this.props.navigation.navigate("Overview")
      return
    }

    if (this.state.processingHole == gameData.gameHoles && [0, 1, 2].indexOf(theScore) >= 0) {
      this.props.navigation.navigate("Overview")
      return
    }


    if ([0, 1, 2].indexOf(theScore) >= 0) {
      const result = gameData.getCurrentScore()
      this.setState({
        scoreA: result[0],
        scoreB: result[1],
        relation: result[2],
        processingHole: this.state.processingHole + 1,
        displayResult: null
      })
    }
    else {
      Alert.alert("Oops!", "Please select the winner for hole " + this.state.processingHole)
    }
  }

  onResultChanged = (score) => {
    const gameData = GameData.instance()
    const gameResults = gameData.gameResults

    gameResults[this.state.processingHole - 1].result = score

    this.setState({
      displayResult: score
    })
  }

  renderPlayerInfo() {
    const gameData = GameData.instance()

    if (gameData.playerD && gameData.playerC) {
      return <PlayersInfo4
        playerA={gameData.playerA}
        playerB={gameData.playerB}
        playerC={gameData.playerC}
        playerD={gameData.playerD}
        showPoint
      />
    } else if (gameData.playerC) {
      return <PlayersInfo3
        playerA={gameData.playerA}
        playerB={gameData.playerB}
        playerC={gameData.playerC}
        showPoint
      />
    }
    else {
      return <PlayersInfo 
        playerA={gameData.playerA}
        playerB={gameData.playerB}
        showPoint
      />
    }
  }

  render() {

    const gameData = GameData.instance()
    const gameResults = gameData.gameResults

    return (
      <BaseComponent>
        <Header />
        <ScrollView>
          {this.renderPlayerInfo()}
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12
          }}>
            <ScoreBoard 
              editable={false}
              playerAScore={this.state.scoreA}
              playerBScore={this.state.scoreB}
              gameRelation={this.state.relation}
              onPlayerAScoreChanged={(score) => this.setState({scoreA: score})}
              onPlayerBScoreChanged={(score) => this.setState({scoreB: score})}
              onGameRelationChanged={(relation) => this.setState({relation})}
            />
            <HoleBoard 
              hole={gameData.isTerminated ? "Game Terminated" : ("Hole" + gameResults[this.state.processingHole - 1].hole)} 
              result={this.state.displayResult}
              onResultChanged={this.onResultChanged}  
              gameEnded={gameData.isTerminated}
            />
            <SelectItem 
              value={gameData.isTerminated ? "End" : "Record & Next"} 
              tint={Theme.buttonPrimary} 
              fixSize 
              onPress={this.onRequestNext} 
            />
          </View>
        </ScrollView>
      </BaseComponent>
    )
  }
}