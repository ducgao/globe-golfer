import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Switch } from 'react-native'

import DGText from './DGText'
import Theme from '../res/Theme'

export default class SettingValue extends PureComponent {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <DGText style={styles.title}>{this.props.title}</DGText>
        <TouchableOpacity onPress={this.props.onPress}>
          <DGText style={styles.value}>{this.props.value}</DGText>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row'
  },
  subContainer: {
    flexDirection: 'row'
  },
  title: {
    flex: 1,
    color: 'white', 
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center'
  },
  value: {
    color: Theme.textGray, 
    fontSize: 16
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    color: Theme.textGray, 
  }
})