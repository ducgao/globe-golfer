import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform, Text, Alert, TouchableOpacity } from 'react-native'


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
import { ScrollView } from 'react-native-gesture-handler'
import ReadMore from 'react-native-read-more-text'

export default class SetupAccountStepActiveLocation extends PureComponent {
  constructor(props) {
    super(props)
   
    this.state = {
        showInfo :false
    }
  }
  static navigationOptions = { header: null }
  toggleStatus(){
    this.setState({
      showInfo:!this.state.showInfo
    });
  }

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

  // _renderTruncatedFooter = (handlePress) => {
  //   return (
  //     <RegularText style={{color: Colors.tintColor, marginTop: 5}} onPress={handlePress}>
  //       Read more
  //     </RegularText>
  //   );
  // }

  // _renderRevealedFooter = (handlePress) => {
  //   return (
  //     <RegularText style={{color: Colors.tintColor, marginTop: 5}} onPress={handlePress}>
  //       Show less
  //     </RegularText>
  //   );
  // }

  onLearnMore = () => {
    Alert.aler
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

  _handleTextReady = () => {
    console.log('ready!');
  }

  renderMessage() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{alignSelf: 'flex-start'}}>
          
            <ReadMore
              numberOfLines={3}
              onReady={this._handleTextReady}>
              <DGText style={styles.messgage}>{Strings.activeLocation.message1}</DGText>
              <DGText style={styles.messgage}>
              {"\n"}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.  Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </DGText>
            </ReadMore>
        </ScrollView>
      </View>
    )
  }

  renderLogo() {
    return (
      <LoadableImage
        style={{
          marginTop: 30,
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
      <BaseComponent>
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
    textAlign: 'center',
    marginTop: 20
  },
  messgage: {
    color: Theme.textGray,
    fontSize: 16,
    marginTop: 16,
    marginLeft: 0, 
    marginRight: 16,
    textAlign: 'center',
    lineHeight: 24,
    flex:1
  },
  messgage1: {
    color: Theme.textGray,
    fontSize: 16,
    marginTop: 24,
    marginLeft: 16, 
    marginRight: 16,
    textAlign: 'center',
    lineHeight: 24,
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
  },
  inlineStyle: {
    alignSelf:'flex-start',
  }
})