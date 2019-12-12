import React from 'react'
import {View, TouchableOpacity, Alert} from 'react-native'
import PlayersInfo from '../comps/PlayersInfo'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'
import GameData from '../GameData'
import ScoreBoard from '../comps/ScoreBoard'

export default class EnterFinalResult extends React.PureComponent {

  state = {
    scoreA: 0,
    scoreB: 0
  }

  render() {

    const gameData = GameData.instance()

    return (
      <BaseComponent>
        <Header />
        <PlayersInfo 
          playerA={gameData.playerA}
          playerB={gameData.playerB}
        />
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 24
        }}>
          <ScoreBoard 
            playerAScore={this.state.scoreA}
            playerBScore={this.state.scoreB}
            onPlayerAScoreChanged={(score) => this.setState({scoreA: score})}
            onPlayerBScoreChanged={(score) => this.setState({scoreB: score})}
          />
        </View>
      </BaseComponent>
    )
  }
}