import React from 'react'
import {View} from 'react-native'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import Theme from '../../../../res/Theme'
import GameData from '../GameData'
import DGText from '../../../../components/DGText'
import SelectItem from '../comps/CircleButton'
import PlayersInfo3 from '../comps/PlayersInfo3'
import { useFocusState } from 'react-navigation-hooks'

class Select3rdPlayerView extends React.PureComponent {

  onRequestAddGGMember = () => {
    this.props.navigation.navigate("AddMember", {where: "C"})
  }

  onRequestAddGuest = () => {
    this.props.navigation.navigate("AddGuest", {where: "C"})
  }

  render() {
    return (
      <BaseComponent>
        <Header />
        <PlayersInfo3
          playerA={this.props.playerA}
          playerB={this.props.playerB}
          playerC={this.props.playerC}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <DGText style={{color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16}}>{"Add 3rd Player"}</DGText>
          <SelectItem 
            value={"Global golfer member"} 
            tint={Theme.buttonPrimary} 
            fixSize 
            size={100} 
            onPress={this.onRequestAddGGMember} 
          />
          <SelectItem 
            value={"Guest"} 
            tint={Theme.buttonPrimary} 
            fixSize 
            size={100} 
            onPress={this.onRequestAddGuest} 
          />  
        </View>
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
  })

  React.useEffect(() => {
    if (isFocused) {
      setState({
        playerA: gameData.playerA,
        playerB: gameData.playerB,
        playerC: gameData.playerC,
      })
    }
  }, [isFocused])

  return <Select3rdPlayerView {...props} 
    playerA={state.playerA}
    playerB={state.playerB}
    playerC={state.playerC}
  />
})