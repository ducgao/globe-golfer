import React from 'react'
import {View, Alert, ScrollView} from 'react-native'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import Theme from '../../../../res/Theme'
import GameData from '../GameData'
import DGText from '../../../../components/DGText'
import SelectItem from '../comps/CircleButton'
import PlayersInfo4 from '../comps/PlayersInfo4'
import { useFocusState } from 'react-navigation-hooks'
import Ads from '../../../../components/Ads'

class Select4rdPlayerView extends React.PureComponent {

  onRequestAddGGMember = (where) => {
    this.props.navigation.navigate("AddMember", {where})
  }

  onRequestAddGuest = (where) => {
    this.props.navigation.navigate("AddGuest", {where})
  }

  onRequestChangeA = () => {
    Alert.alert("Select New Player", null, [
      {
        text: "Select GG Member",
        onPress: () => this.onRequestAddGGMember("A")
      },
      {
        text: "Add Guest",
        onPress: () => this.onRequestAddGuest("A")
      },
      {
        text: "Cancel",
        style: 'destructive'
      },
    ])
  }

  onRequestChangeB = () => {
    Alert.alert("Select New Player", null, [
      {
        text: "Select GG Member",
        onPress: () => this.onRequestAddGGMember("B")
      },
      {
        text: "Add Guest",
        onPress: () => this.onRequestAddGuest("B")
      },
      {
        text: "Cancel",
        style: 'destructive'
      },
    ])
  }

  onRequestChangeC = () => {
    Alert.alert("Select New Player", null, [
      {
        text: "Select GG Member",
        onPress: () => this.onRequestAddGGMember("C")
      },
      {
        text: "Add Guest",
        onPress: () => this.onRequestAddGuest("C")
      },
      {
        text: "Cancel",
        style: 'destructive'
      },
    ])
  }

  onRequestChangeD = () => {
    Alert.alert("Select New Player", null, [
      {
        text: "Select GG Member",
        onPress: () => this.onRequestAddGGMember("D")
      },
      {
        text: "Add Guest",
        onPress: () => this.onRequestAddGuest("D")
      },
      {
        text: "Cancel",
        style: 'destructive'
      },
    ])
  }

  onRequestSubmit = () => {
    const { playerA, playerB, playerC, playerD } = this.props

    if (playerA && playerB && playerC && playerD) {
      this.props.navigation.navigate("SelectType")
    } else {
      Alert.alert("Oops!", "Please select all players to start the match!")
    }
  }

  render() {
    return (
      <BaseComponent>
        <Header />
        <ScrollView>
          <PlayersInfo4
            playerA={this.props.playerA}
            playerB={this.props.playerB}
            playerC={this.props.playerC}
            playerD={this.props.playerD}
            onRequestChangeA={this.onRequestChangeA}
            onRequestChangeB={this.onRequestChangeB}
            onRequestChangeC={this.onRequestChangeC}
            onRequestChangeD={this.onRequestChangeD}
            onSwitched={this.props.onSwitched}
          />
          <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: 24}}>
            <DGText style={{
              color: 'white', 
              fontSize: 20, 
              fontWeight: 'bold', 
              marginTop: 24,
              textAlign: 'center',
              marginBottom: 24,
            }}>{"Tap on \"New PLAYERS\" circle to select a player"}</DGText>
            <SelectItem value={"Next"} tint={Theme.buttonPrimary} fixSize onPress={this.onRequestSubmit} />
          </View>
        </ScrollView>
        <Ads />
      </BaseComponent>
    )
  }
}

export default React.memo((props) => {

  const gameData = GameData.instance()

  const {isFocused} = useFocusState()
  const [state, setState] = React.useState({
    playerA: gameData.playerA,
    playerB: gameData.playerB,
    playerC: gameData.playerC,
    playerD: gameData.playerD,
  })

  React.useEffect(() => {
    if (isFocused) {
      setState({
        playerA: gameData.playerA,
        playerB: gameData.playerB,
        playerC: gameData.playerC,
        playerD: gameData.playerD,
      })
    }
  }, [isFocused])

  return <Select4rdPlayerView {...props} 
    playerA={state.playerA}
    playerB={state.playerB}
    playerC={state.playerC}
    playerD={state.playerD}
    onSwitched={(a, b, c, d) => {

      gameData.playerA = a
      gameData.playerB = b
      gameData.playerC = c
      gameData.playerD = d

      setState({
        playerA: a,
        playerB: b,
        playerC: c,
        playerD: d,
      })
    }}
  />
})