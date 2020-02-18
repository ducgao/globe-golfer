import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import FlexSpacing from './FlexSpacing'
import DGText from '../../../components/DGText';
import Theme from '../../../res/Theme'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

const HeaderIcon = React.memo(({name, action}) => (
  <Icon 
    size={32}
    color={'white'}
    name={name}
    onPress={action}
  />
))

const Title = React.memo(({}) => {
  return (
    <View style={{ 
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center',
      flexDirection: 'row'
    }}>
      <DGText style={{ 
        color: Theme.buttonPrimary, 
        fontWeight: 'bold',
        fontSize: 20
      }}>Notifications</DGText>
    </View>
  )
})

const Header = React.memo(({isOn, onViewModeChanged}) => {

  const { goBack, navigate } = useNavigation()

  const onGoBack = () => {
    navigate('Menu')
  }

  const onGoToSetting = () => {
    navigate('Profile')
  }

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Theme.separator
    }}>
      <HeaderIcon name={"ios-home"} action={onGoBack}/>
      <Title />
      <HeaderIcon name={"ios-settings"} action={onGoToSetting}/>
    </View>
  )
})

export default Header