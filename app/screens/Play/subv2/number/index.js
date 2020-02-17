import React from 'react'
import {View, TouchableOpacity, Alert, ScrollView} from 'react-native'
import PlayersInfo from '../comps/PlayersInfo'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'
import GameData from '../GameData'
import Ads from '../../../../components/Ads'

import { connect } from 'react-redux'

const NumberItem = React.memo(({value, onPress}) => {
  return (
    <TouchableOpacity style={{
      width: 80,
      height: 80,
      borderRadius: 40,
      borderColor: Theme.buttonPrimary,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16
    }} onPress={onPress}>
      <DGText style={{
        color: Theme.buttonPrimary,
        fontSize: 50
        }}>{value}</DGText>
    </TouchableOpacity>
  )
})

const NumberSelector = React.memo(({onChanged}) => {

  const [localState, setLocalState] = React.useState({index: 0})

  const onNumberPress = (n) => {
    onChanged(n)

    setLocalState({index: n})
  }

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <DGText style={{
        color: 'gray',
        fontSize: 20,
        marginTop: 24,
        marginBottom: 20
      }}>{"Numbers of players"}</DGText>
      <NumberItem value={2} onPress={() => onNumberPress(2)}/>
      <NumberItem value={3} onPress={() => onNumberPress(3)}/>
      <NumberItem value={4} onPress={() => onNumberPress(4)}/>
    </View>
  )
})

class SelectNumber extends React.PureComponent {

  onSelectionChanged = (index) => {

    const gameData = GameData.instance()
    gameData.reset()

    if (index == 2) {  
      this.props.navigation.navigate("SelectType")
    }
    else if (index == 3) {
      this.props.navigation.navigate("Select3rdPlayer")
    }
    else {
      this.props.navigation.navigate("Select4rdPlayer")
    }
  }

  render() {

    const gameData = GameData.instance()

    const isEditable = gameData.playerA.id === this.props.user.id

    return (
      <BaseComponent>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <PlayersInfo 
            playerA={gameData.playerA}
            playerB={gameData.playerB}
            showPoint
          />
          {isEditable ? 
            <NumberSelector onChanged={this.onSelectionChanged} /> : 
            <DGText style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
              paddingHorizontal: 16,
              marginTop: 24
            }}>{"You're not able to create and edit score for this match, this features just reserved to the player who asked for the challenge"}</DGText>
          }
        </ScrollView>
        <Ads />
      </BaseComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.profile.user,
})

const mapDispatchToProps = () => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectNumber)