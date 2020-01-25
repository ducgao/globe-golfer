import React from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import DGText from '../../../components/DGText'
import DialogCombination from '../../../components/DialogCombination';
import Header from '../components/Header';
import Theme from '../../../res/Theme';
import BaseComponent from '../../../components/BaseComponent'
import PendingItem from '../../Play/components/PendingItem';
import MatchInfo from '../../Play/configuration/MatchInfo';

const Spacing = React.memo(() => {
  return <View style={{ height: 32 }} />
})

const BackButton = React.memo(({onPress}) => {
  return (
    <TouchableOpacity style={{
      width: 200,
      height: 44,
      backgroundColor: Theme.buttonPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    }} activeOpacity={0.7} onPress={onPress}>
      <DGText style={{color: 'white', fontSize: 18}}>Back</DGText>
    </TouchableOpacity>
  )
})

const Result = React.memo(({score1, score2}) => {

  return (
    <View style={{
      width: 180,
      height: 180,
      alignSelf: 'center',
      marginVertical: 20,
      borderRadius : 90,
      backgroundColor: 'gray',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <DGText style={{color: 'white', fontSize: 28}}>{score1 + " & " + score2}</DGText>
    </View>
  )
})

export default class ResultSimple extends React.PureComponent {

  render() {
    const data = this.props.navigation.getParam("data")
  
    return (
      <BaseComponent>
        <DialogCombination>
          <View style={{ minHeight: Dimensions.get('window').height }}>  
            <MatchInfo title="Match Result" />
            <Spacing />
            <PendingItem item={data} viewOnly={true} />
            <Result score1={data.score1} score2={data.score2} />
            <BackButton onPress={() => { this.props.navigation.goBack() }} />
          </View>
        </DialogCombination>
      </BaseComponent>
    )
  }
}