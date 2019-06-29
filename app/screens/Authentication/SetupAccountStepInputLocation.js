import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import BaseComponent from '../../components/BaseComponent'
import SelectInputBlock from '../../components/SelectInputBlock'
import DGButton from '../../components/DGButton'
import Strings from '../../res/Strings'
import Theme from '../../res/Theme'

export default class SetupAccountStepInputLocation extends PureComponent {
  static navigationOptions = { header: null }

  renderSelectCountry() {
    return <SelectInputBlock title={Strings.country} />
  }

  renderSelectRegion() {
    return <SelectInputBlock title={Strings.region} />
  }

  renderSelectPlayzone() {
    return <SelectInputBlock title={Strings.playGolfAt} />
  }

  renderLogo() {

  }

  renderBody() {
    return (
      <View style={styles.body}>
        {this.renderSelectCountry()}
        {this.renderSelectRegion()}
        {this.renderSelectPlayzone()}
      </View>
    )
  }

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <DGButton 
          style={{ backgroundColor: Theme.buttonPrimary }}
          text={Strings.continue}
          onPress={this.requestGoToInputName}
          />
      </View>
    )
  }

  render() {
    return (
      <BaseComponent>
        <KeyboardAwareScrollView>
          <View style={styles.body}>
            {this.renderLogo()}
            {this.renderBody()}
            {this.renderFooter()}
          </View>
          
        </KeyboardAwareScrollView>
      </BaseComponent>
    )
  }
}

const windowHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
  body: {
    flex: 1, 
    height: windowHeight,
    justifyContent: 'center'
  },
  input: {
    backgroundColor: Theme.buttonSecondary,
    width: '80%',
    color: Theme.textWhite,
    textAlign: 'center',
    marginTop: 16
  },
  messgage: {
    color: Theme.textGray,
    fontSize: 20,
    marginTop: 24,
    textAlign: 'center'
  },
  footerContainer: {
    paddingBottom: getBottomSpace() + 32
  }
})