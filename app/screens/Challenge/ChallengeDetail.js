import React, { PureComponent } from 'react'
import { View, TouchableOpacity } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import BaseComponent from '../../components/BaseComponent'
import DGText from '../../components/DGText'

import Theme from '../../res/Theme'
import Icon from 'react-native-vector-icons/Ionicons'
import Card from '../Challenge/components/Card'
import Api from '../../api'

const TheButton = React.memo(({text, onPress, icon}) => {
  return (
    <TouchableOpacity style={{
      justifyContent: 'center',
      alignItems: 'center'
    }} onPress={onPress}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Theme.buttonPrimary,
        paddingTop: 8,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Icon name={icon} color='white' size={50} />
      </View>
      <DGText style={{ 
        color: Theme.buttonPrimary,
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12
      }}>{text}</DGText>
    </TouchableOpacity>
  )
})

export default class ChallengeDetail extends PureComponent {
  static navigationOptions = { header: null }

  requestNotYet = () => {
    this.props.navigation.goBack()
  }

  requestChallenge = () => {
    const user = this.props.navigation.getParam('data')
    Api.instance().challengeTo(user.id);
    this.props.navigation.goBack()
  }

  renderCTABlock() {
    return (
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 32
      }}>
        <TheButton 
          icon={'md-close'}
          text={"Not yet"}
          onPress={this.requestNotYet}
        />
        <View style={{flex: 1}} />
        <TheButton 
          icon={'md-checkmark'}
          text={"Challenge"}
          onPress={this.requestChallenge}
        />
      </View>
      
    )
  }

  render() {
    const user = this.props.navigation.getParam('data')
  
    return (
      <BaseComponent toolbar={{
        title: "Challenge",
        onBack: this.props.navigation.goBack,
      }}>
        <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 44 }}>
          {user ? [
            <View style={{marginHorizontal: 16, marginTop: 24}}>
              <Card withAds={false} card={{
                location: user.location,
                avatar: user.avatar,
                about: user.about,
                rating: user.rate,
                name: user.name,
                lastName: user.lastName,
                metaData: user.metaData
              }}/>
            </View>,
            this.renderCTABlock()
          ] : null}
        </KeyboardAwareScrollView>
      </BaseComponent>
    )
  }
}