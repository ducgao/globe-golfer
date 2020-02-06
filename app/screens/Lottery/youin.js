import React, { PureComponent } from 'react'
import { View } from 'react-native'

import BaseComponent from '../../components/BaseComponent'
import DGText from '../../components/DGText'

export default class YouIn extends PureComponent {
  static navigationOptions = { header: null }

  render() {
    const code = this.props.navigation.getParam("code")
    return (
      <BaseComponent toolbar={{
        title: "You Are In",
        onBack: this.props.navigation.goBack,
      }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <DGText style={{
            marginTop: 40,
            color: 'white', 
            fontSize: 30, 
            fontWeight: 'bold', 
            textAlign: 'center'
          }}>{"Congratulations\nYou are in!"}</DGText>
          <DGText style={{
            marginTop: 40,
            color: 'white', 
            fontSize: 20, 
            fontWeight: '600', 
            textAlign: 'center'
          }}>{"Your participation has been validated.\nYour ticket number for the next draw is"}</DGText>
          <DGText style={{
            marginTop: 40,
            color: 'white', 
            fontSize: 24, 
            fontWeight: 'bold', 
            textAlign: 'center',
            textDecorationLine: 'underline'
          }}>{code}</DGText>
        </View>
        
      </BaseComponent>
    )
  }
}