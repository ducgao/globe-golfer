import React, { PureComponent } from 'react'
import { View, ScrollView, Dimensions } from 'react-native'

import BaseComponent from '../../components/BaseComponent'
import DGText from '../../components/DGText'
import DGButtonV2 from '../../components/DGButtonV2'

import { connect } from 'react-redux'

class YouIn extends PureComponent {
  static navigationOptions = { header: null }

  onGetPremium = () => {
    this.props.navigation.navigate('Premium')
  }

  renderAdditionInfo(isPremium) {
    const code = this.props.navigation.getParam("code")
    if (isPremium) {
        <View>
          <DGText style={{
            marginTop: 80,
            color: 'white', 
            fontSize: 20, 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginHorizontal: 16
          }}>{"Your participation has been validated.\nYour ticket number for the next draw is"}</DGText>   
          <DGText style={{
            marginTop: 40,
            color: 'white', 
            fontSize: 24, 
            fontWeight: 'bold', 
            textAlign: 'center',
            textDecorationLine: 'underline'
          }}>{code[1]}</DGText>
        </View>
    }
    else {
      return (
        <View>
          <DGText style={{
            marginTop: 80,
            color: 'white', 
            fontSize: 20, 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginHorizontal: 16
          }}>{"The premium ticket is reserved for GG premium members only.\nTo take advantage of the many benefits, choose GlobeGolfer Premium!"}</DGText>   
          <DGButtonV2
            style={{ 
              width: Dimensions.get('window').width / 2,
              marginTop: 16,
              backgroundColor: Theme.buttonPrimary 
            }}
            text={"Get GG subscription"}
            onPress={this.onGetPremium}
          />
        </View>
      )
    }
  }

  render() {
    const code = this.props.navigation.getParam("code")

    return (
      <BaseComponent toolbar={{
        title: "You Are In",
        onBack: this.props.navigation.goBack,
      }}>
        <ScrollView contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }} showsVerticalScrollIndicator={false} >
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
            textAlign: 'center',
            marginHorizontal: 16
          }}>{"Your participation has been validated.\nYour ticket number for the next draw is"}</DGText>
          <DGText style={{
            marginTop: 40,
            color: 'white', 
            fontSize: 24, 
            fontWeight: 'bold', 
            textAlign: 'center',
            textDecorationLine: 'underline'
          }}>{code[0]}</DGText>
          {this.renderAdditionInfo(this.props.user.isPremium)}
        </ScrollView>
      </BaseComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.profile.user,
})

const mapDispatchToProps = () => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(YouIn)