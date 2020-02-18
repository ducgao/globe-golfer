import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform } from 'react-native'

import { getBottomSpace } from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/Ionicons'

import BaseComponent from '../../components/BaseComponent'
import DGText from '../../components/DGText'
import DGButtonV2 from '../../components/DGButtonV2'
import Strings from '../../res/Strings'
import Theme from '../../res/Theme'
import LoadableImage from '../../components/LoadableImage'

export default class SetupAccountStepActiveEmailContact extends PureComponent {
  static navigationOptions = { header: null }

  onRequestGotoActiveLocation = () => {
    this.props.navigation.navigate("SetupAccountStepActiveLocation")  
  }

  renderTitle() {
    return <DGText style={styles.title}>Can we contact to you?</DGText>
  }

  renderMessage() {
    return <DGText style={styles.messgage}>{"We want to send you via email:\n\n- Your monthly statistics\n- Tips to take full advantage of GlobeGolfer\n- Updates on features and new challenges\n- Testimonials from GlobeGolfer community"}</DGText>
  }

  renderLogo() {
    return (
      <LoadableImage
        style={{
          marginTop: 60,
          width: 120,
          height: 120,
          alignSelf: 'center'
        }}
        source={require('../../res/images/ic_icon.png')}
      />
    )
  }

  renderBody() {
    return (
      <View style={styles.body}>
        {this.renderTitle()}
        {this.renderMessage()}
      </View>
    )
  }

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <DGButtonV2 
          style={{ backgroundColor: Theme.buttonSecondary, width: '40%', marginRight: 4 }}
          text="No"
          onPress={this.onRequestGotoActiveLocation}
          />
        <DGButtonV2 
          style={{ backgroundColor: Theme.buttonPrimary, width: '40%', marginLeft: 4 }}
          text="Yes"
          onPress={this.onRequestGotoActiveLocation}
          />
      </View>
    )
  }

  render() {
    return (
      <BaseComponent toolbar={{
        title: Strings.toolbar.back,
        onBack: () => this.props.navigation.goBack()
      }}>
        {this.renderLogo()}
        {this.renderBody()}
        {this.renderFooter()}
      </BaseComponent>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1, 
    justifyContent: 'center'
  },
  title: {
    color: Theme.textWhite,
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 16
  },
  messgage: {
    color: Theme.textGray,
    fontSize: 16,
    marginTop: 24,
    marginLeft: 16, 
    marginRight: 16,
    lineHeight: 24
  },
  footerContainer: {
    flexDirection: 'row',
    paddingBottom: getBottomSpace() + 32,
    justifyContent: 'center'
  },
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    marginTop: 12,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center'
  },
  icon: {
    alignSelf: 'center', 
    marginTop: Platform.OS == 'android' ? 6 : 12
  }
})