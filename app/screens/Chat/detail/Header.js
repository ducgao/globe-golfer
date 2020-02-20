import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import DGText from '../../../components/DGText';
import Theme from '../../../res/Theme'
import FlexSpacing from '../components/FlexSpacing';
import { shareGG } from '../../../utils';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

const HeaderIcon = React.memo(({name, action}) => (
  <TouchableOpacity style={{
    width: 32,
    justifyContent: name === "ios-settings" ? 'flex-end' : 'flex-start',
    alignItems: name === "ios-settings" ? 'flex-end' : 'flex-start'
  }} onPress={action}>
    <Icon 
      size={32}
      color={'white'}
      name={name}
    />
  </TouchableOpacity>
))

const CenterButton = React.memo(({action}) => {
  return (
    <TouchableOpacity style={{ 
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center',
      flexDirection: 'row'
    }} activeOpacity={0.7} onPress={action}>
      <Icon 
        size={32}
        color={'white'}
        name={"ios-person-add"}
      />
      <DGText style={{ color: Theme.textWhite, marginLeft: 12 }}>Invite a Friend</DGText>
    </TouchableOpacity>
  )
})

const Header = React.memo(({title}) => {

  const { goBack, navigate } = useNavigation()

  const onGoBack = () => {
    goBack()
  }

  const onGoToInvite = () => {
    shareGG()
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
      marginTop: 8 + getStatusBarHeight(),
      borderBottomWidth: 1,
      borderBottomColor: Theme.separator
    }}>
      <HeaderIcon name={"ios-arrow-back"} action={onGoBack}/>
      <DGText style={{
        flex: 1, 
        color: 'white', 
        textAlign: 'center',
        fontWeight:'bold',
        fontSize:24,
      }}>{title}</DGText>
      <HeaderIcon name={"ios-settings"} action={onGoToSetting}/>
    </View>
  )
})

export default Header