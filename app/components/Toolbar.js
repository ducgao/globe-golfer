import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import DGText from './DGText'
import Theme from '../res/Theme'
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks';

const Toolbar = React.memo((props) => {

  const { goBack } = useNavigation()

  const onBack = () => {
    goBack();
  }

  return (
    <View {...props} style={[styles.container, props.style]}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Icon name="ios-arrow-back" color={Theme.buttonPrimary} size={30} />
        </TouchableOpacity>
        <DGText style={styles.text}>{props.title}</DGText>
        {
          props.rightComponent ? (
            <TouchableOpacity onPress={props.rightComponent.onPress} activeOpacity={0.7}>
              <DGText style={styles.textRight}>{props.rightComponent.title}</DGText>
            </TouchableOpacity>
          ) : undefined
        }
        
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 12 + getStatusBarHeight(),
    paddingBottom: 12,
    alignItems: 'center'
  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.toolbarTitle,
    textAlignVertical: 'center',
    marginHorizontal: 16,
  },
  textRight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.toolbarTitle,
    textAlignVertical: 'center',
    marginTop: Platform.OS == 'ios' ? 2 : 0
  },
  separator: {
    width: '100%',
    height: 2,
    marginTop: 8,
    backgroundColor: Theme.separator
  }
})

export default Toolbar