import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform } from 'react-native'

import Permissions from 'react-native-permissions'

import { getBottomSpace } from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/Ionicons'

import BaseComponent from '../../components/BaseComponent'
import DGText from '../../components/DGText'
import DGButtonV2 from '../../components/DGButtonV2'
import Strings from '../../res/Strings'
import Theme from '../../res/Theme'
import { showErrorAlert } from '../../utils'
import LoadableImage from '../../components/LoadableImage'

export default class SetupAccountStepActiveLocation extends PureComponent {
  static navigationOptions = { header: null }

  onRequestGetLocation = () => {
    Permissions.request('location').then(response => {
      if (response == 'authorized') {
        this.props.navigation.navigate("SetupAccountStepInputAvatar")  
      }
      else {
        showErrorAlert(Strings.activeLocation.error)
      }
    })
  }

  onRequestLearnMore = () => {
    showErrorAlert("We won't able to play without your location permission!")
  }

  renderTitle() {
    return <DGText style={styles.title}>{Strings.activeLocation.title}</DGText>
  }

  renderLocationIcon() {
    return (
      <View style={styles.iconContainer}>
        <Icon name="ios-pin" color='black' size={80} style={styles.icon} />
      </View>
    )
  }

  renderMessage() {
    return <DGText style={styles.messgage}>{Strings.activeLocation.message}</DGText>
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
        {this.renderLocationIcon()}
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
          onPress={this.onRequestLearnMore}
          />
        <DGButtonV2 
          style={{ backgroundColor: Theme.buttonPrimary, width: '40%', marginLeft: 4 }}
          text="Yes"
          onPress={this.onRequestGetLocation}
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
    textAlign: 'center'
  },
  messgage: {
    color: Theme.textGray,
    fontSize: 16,
    marginTop: 24,
    marginLeft: 16, 
    marginRight: 16,
    textAlign: 'center',
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