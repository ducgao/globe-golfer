import React from 'react'
import {View, ScrollView, TouchableOpacity, Alert} from 'react-native'
import PlayersInfo from '../comps/PlayersInfo'
import PlayersInfo3 from '../comps/PlayersInfo3'
import PlayersInfo4 from '../comps/PlayersInfo4'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import Theme from '../../../../res/Theme'
import GameData from '../GameData'
import DGText from '../../../../components/DGText'
import SelectItem from '../comps/CircleButton'
import ScoreBoard from '../comps/ScoreBoard'
import { connect } from 'react-redux'
import Api from '../../../../api'
import { getPendingMatches } from '../../../../actions/getPendingMatches'
import { getPlayedMatches } from '../../../../actions/getPlayedMatches'

const ResultRow = React.memo(({result, requestChangeResult}) => {

  const [localState, setLocalState] = React.useState(result)

  const requestChangeResultTo = (newResult) => {
    if (newResult == localState.result) {
      return
    }

    setLocalState({result: newResult})
    requestChangeResult(result.hole, newResult)
  }

  return (
    <View style={{width: '80%', height: 30, marginBottom: 8, flexDirection: 'row'}}>
      <TouchableOpacity style={{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        height: 30,
        width: '30%',
        borderColor: 'white',
        backgroundColor: localState.result == 1 ? Theme.buttonPrimary : null
      }} onPress={() => requestChangeResultTo(1)} />
      <TouchableOpacity style={{
        borderWidth: 1,
        borderColor: 'white',
        height: 30,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: localState.result == 0 ? Theme.buttonPrimary : null
      }} onPress={() => requestChangeResultTo(0)}>
        <DGText style={{color: 'white'}}>{result.hole}</DGText>
      </TouchableOpacity>
      <TouchableOpacity style={{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        height: 30,
        width: '30%',
        borderColor: 'white',
        backgroundColor: localState.result == 2 ? Theme.buttonPrimary : null
      }} onPress={() => requestChangeResultTo(2)} />
    </View>
  )
})

class Overview extends React.Component {

  state = {
    mode: "view",
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextState.version != this.state.version) {
      return true
    }

    if (nextState.mode != this.state.mode) {
      return true
    }

    return false
  };

  onRequestRecord = () => {
    if (this.state.mode == "view") {
      const gameData = GameData.instance()

      const playerA = gameData.playerA
      const playerB = gameData.playerB

      const id = gameData.gameId
      const detail = []

      gameData.gameResults.forEach(o => {
        if (o.result == 0) {
          detail.push({
            userId: playerA.id,
            hole: o.hole,
            score: 2
          })
          detail.push({
            userId: playerB.id,
            hole: o.hole,
            score: 2
          })
        } else if (o.result == 1) {
          detail.push({
            userId: playerA.id,
            hole: o.hole,
            score: 1
          })
          detail.push({
            userId: playerB.id,
            hole: o.hole,
            score: 2
          })
        } else if (o.result == 2) {
          detail.push({
            userId: playerA.id,
            hole: o.hole,
            score: 2
          })
          detail.push({
            userId: playerB.id,
            hole: o.hole,
            score: 1
          })
        }
      })

      Api.instance().updateMatchResultDetail(id, detail).then(_ => {
        this.props.getPendingMatches()
        this.props.getPlayedMatches()

        Alert.alert("Submit successfully!", "Your request has been submitted. Wait for the approval from your competitor.", [
          {
            text: "OK",
            onPress: () => this.props.navigation.popToTop()
          }
        ])
      })
    }
    else {
      this.setState({mode: 'view'})
    }
  }

  requestChangeResult = (hole, newResult) => {
    const gameData = GameData.instance()
    const gameResults = gameData.gameResults

    gameResults[hole - 1].result = newResult
  }

  renderContent() {
    const gameData = GameData.instance()
    const gameResults = gameData.gameResults

    if (this.state.mode == "view") {

      const result = gameData.getCurrentScore()

      return (
        <ScoreBoard
          playerAScore={result[0]}
          playerBScore={result[1]}
          gameRelation={"&"}
        />
      )
    }
    else {
      return gameResults.map(g => <ResultRow 
        key={g.hole} 
        result={g} 
        requestChangeResult={this.requestChangeResult}
      />)
    }
  }

  renderPlayerInfo() {
    const gameData = GameData.instance()
    const result = gameData.getCurrentScore()
    
    if (gameData.playerD && gameData.playerC) {
      return <PlayersInfo4
        playerA={gameData.playerA}
        playerB={gameData.playerB}
        playerC={gameData.playerC}
        playerD={gameData.playerD}
        winner={result[0] > result[1] ? gameData.playerA : gameData.playerB}
      />
    } else if (gameData.playerC) {
      return <PlayersInfo3
        playerA={gameData.playerA}
        playerB={gameData.playerB}
        playerC={gameData.playerC}
      />
    }
    else {
      return <PlayersInfo 
        playerA={gameData.playerA}
        playerB={gameData.playerB}
        winner={result[0] > result[1] ? gameData.playerA : gameData.playerB}
      />
    }
  }

  render() {
    return (
      <BaseComponent>
        <Header />
        {this.renderPlayerInfo()}
        <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
          {this.renderContent()}
          <View style={{height: 20}}/>
          <SelectItem 
            value={this.state.mode == "view" ? "Sign" : "Record"} 
            tint={Theme.buttonPrimary} 
            fixSize 
            onPress={this.onRequestRecord} 
          />
          {this.state.mode == "view" ? (<View style={{marginVertical: 4}}>
            <SelectItem 
              value={"Edit full scorecard"} 
              tint={Theme.buttonPrimary} 
              onPress={() => this.setState({mode: "edit"})} 
            />
          </View>) : undefined}
        </ScrollView>
      </BaseComponent>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({
  getPendingMatches: () => dispatch(getPendingMatches()),
  getPlayedMatches: () => dispatch(getPlayedMatches())
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview)