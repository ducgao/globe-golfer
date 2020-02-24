import React from 'react'
import {View, ScrollView, Alert} from 'react-native'
import PlayersInfo from '../comps/PlayersInfo'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import Theme from '../../../../res/Theme'
import GameData from '../GameData'
import SelectItem from '../comps/CircleButton'
import PlayersInfo3 from '../comps/PlayersInfo3'
import PlayersInfo4 from '../comps/PlayersInfo4'
import Api from '../../../../api'
import Ads from '../../../../components/Ads'

const gameTypes = [
  "Select the game type",
  "Putting green",
  "Chipping green",
  "Course 9 holes",
  "Course 18 holes"
]

export default class SelectType extends React.PureComponent {

  constructor(props) {
    super(props)

    const gameData = GameData.instance()

    this.state = {
      type: gameData.gameType ? gameData.gameType : 0
    }
  }

  updateGameType(type) {
    const gameData = GameData.instance()
    gameData.setGameType(type)
  
    this.setState({type})
  }

  onRequestChangeGameType = () => {
    Alert.alert(gameTypes[0], null, [
      {
        text: gameTypes[1],
        onPress: () => this.updateGameType(1)
      },
      {
        text: gameTypes[2],
        onPress: () => this.updateGameType(2)
      },
      {
        text: gameTypes[3],
        onPress: () => this.updateGameType(3)
      },
      {
        text: gameTypes[4],
        onPress: () => this.updateGameType(4)
      }
    ])
  }

  onRequestEditScore = () => {
    if (this.state.type == 0) {
      Alert.alert("Oops!", "Please select game type")
      return
    }

    const gameType = this.state.type
    const gameData = GameData.instance()
    const challenge = gameData.challengeId

    // if (gameData.playerD && gameData.playerC) {
    //   this.props.navigation.navigate("EditResult2Player")
    // } else if (gameData.playerC) {
    //   this.props.navigation.navigate("EditResult3Player")
    // }
    // else {
    //   this.props.navigation.navigate("EditResult2Player")
    // }

    // return

    Api.instance().createNewGame(challenge, gameType).then(res => {
      if (res.data && res.data.scheduleId) {
        GameData.instance().gameId = res.data.scheduleId

        
        if (gameData.playerD && gameData.playerC) {
          this.props.navigation.navigate("EditResult2Player")
        } else if (gameData.playerC) {
          this.props.navigation.navigate("EditResult3Player")
        }
        else {
          this.props.navigation.navigate("EditResult2Player")
        }
      }
      else {
        Alert.alert("Oops!", "We was unable to create your match. Please try again later!")
      }
    }).catch(error => {
      Alert.alert("Oops!", "We was unable to create your match. Please try again later!")
    })
  }

  onRequestEnterScore = () => {
    if (this.state.type == 0) {
      Alert.alert("Oops!", "Please select game type")
      return
    }

    const gameType = this.state.type
    const challenge = GameData.instance().challengeId
    
    Api.instance().createNewGame(challenge, gameType).then(res => {
      if (res.data && res.data.scheduleId) {
        GameData.instance().gameId = res.data.scheduleId
        this.props.navigation.navigate("EnterFinalResult")
      }
      else {
        Alert.alert("Oops!", "We was unable to create your match. Please try again later!")
      }
    }).catch(error => {
      Alert.alert("Oops!", "We was unable to create your match. Please try again later!")
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
      />
    }
  }

  render() {
    return (
      <BaseComponent>
        <Header />
        <ScrollView>
          {this.renderPlayerInfo()}
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24
          }}>
            <SelectItem value={gameTypes[this.state.type]} tint={Theme.buttonPrimary} onPress={this.onRequestChangeGameType} />
            <SelectItem value={"Edit score card"} tint="white" fixSize onPress={this.onRequestEditScore} />
            <SelectItem value={"Enter final result"} tint={Theme.buttonPrimary} fixSize onPress={this.onRequestEnterScore} />
          </View>
        </ScrollView>
        <Ads />
      </BaseComponent>
    )
  }
}