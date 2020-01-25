import React from 'react'
import {View, TouchableOpacity, Alert, ScrollView, Dimensions} from 'react-native'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import GameData from '../GameData'
import ScoreBoard3 from '../comps/ScoreBoard3'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'
import SelectItem from '../comps/CircleButton'
import PlayersInfo3 from '../comps/PlayersInfo3'

const HoleBoard3 = React.memo(({hole, result, onResultChanged, gameEnded}) => {

  const buttonWidth = Dimensions.get('window').width / 4

  const renderButton = (text, marginH, marginV, tag, player) => {
    return (
      <TouchableOpacity style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        height: 40,
        width: buttonWidth,
        borderRadius: 20,
        marginHorizontal: marginH,
        marginVertical: marginV,
        backgroundColor: result[player] === tag ? Theme.buttonPrimary : null
      }} onPress={() => {
        result[player] = tag
        onResultChanged({...result})
      }}>
        <DGText style={{color: 'white'}}>{text}</DGText>
      </TouchableOpacity>
    )
  }

  const left = (
    <View>
      {renderButton("1st", 0, 4, 1, "a")}
      {renderButton("2nd", 0, 4, 2, "a")}
      {renderButton("3rd", 0, 4, 3, "a")}
    </View>
  )

  const middle = (
    <View>
      {renderButton("1st", 20, 4, 1, "b")}
      {renderButton("2nd", 20, 4, 2, "b")}
      {renderButton("3rd", 20, 4, 3, "b")}
    </View>
  )

  const right = (
    <View>
      {renderButton("1st", 0, 4, 1, "c")}
      {renderButton("2nd", 0, 4, 2, "c")}
      {renderButton("3rd", 0, 4, 3, "c")}
    </View>
  )

  const controller = <View style={{
      flexDirection: 'row',
      width: '100%',
      marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24
    }}>
    {left}
    {middle}
    {right}
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
        <ScrollView showsVerticalScrollIndicator={false}>
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