import React from 'react'
import {View, TouchableOpacity, Alert} from 'react-native'
import Theme from '../../../../res/Theme'
import DGText from '../../../../components/DGText'
import GameData from '../GameData'

const ScoreInput = React.memo(({value, editable, onRequestChange}) => {
  return (
    <TouchableOpacity style={{
      width: 60,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: Theme.buttonPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8
    }} disabled={!editable}  onPress={onRequestChange}>
      <DGText style={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
      }}>{value}</DGText>
    </TouchableOpacity>
  )
})

export default React.memo(({
  playerAScore, 
  onPlayerAScoreChanged,
  playerBScore, 
  onPlayerBScoreChanged,
  gameRelation,
  onGameRelationChanged,
  editable
}) => {

  onRequestAScoreChange = () => {
    onRequestScoreChange(onPlayerAScoreChanged)
  }

  onRequestBScoreChange = () => {
    onRequestScoreChange(onPlayerBScoreChanged)
  }

  onRequestScoreChange = (callback) => {
    const gameData = GameData.instance()
    const holes = gameData.gameHoles

    const data = [0]

    for (let i = 0; i <= holes / 2; i++) {
      data.push(i + 1)
    }

    Alert.alert("Select score", null, data.map(i => {
      return {
        text: i + "", onPress: () => callback(i)
      }
    }))
  }

  onRequestGameRelationChange = () => {
    Alert.alert("Select game relationship", null, ["&","A/S","Up"].map(i => {
      return {
        text: i + "", onPress: () => onGameRelationChanged(i)
      }
    }))
  }

  return (
    <View style={{
      height: 60,
      borderRadius: 30,
      borderWidth: 2,
      paddingHorizontal: 10,
      borderColor: Theme.buttonPrimary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ScoreInput value={playerAScore} onRequestChange={onRequestAScoreChange} editable={editable} />
      <ScoreInput value={gameRelation} onRequestChange={onRequestGameRelationChange} editable={editable} />
      <ScoreInput value={playerBScore} onRequestChange={onRequestBScoreChange} editable={editable} />
    </View>
  )
})