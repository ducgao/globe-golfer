import React from 'react'
import { View, TouchableOpacity ,Text} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import FlexSpacing from './FlexSpacing'
import Toggler from '@components/Toggler';
import Theme from '../../../res/Theme'

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

const Header = React.memo(({isOn, onViewModeChanged}) => {

  const { goBack, navigate } = useNavigation()

  const onGoBack = () => {
    goBack()
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
    }}>
      <HeaderIcon name={"ios-arrow-back"} action={onGoBack}/>
      <FlexSpacing />
      <View>
        <Text style={{color:Theme.buttonPrimary,fontSize:24,fontWeight:'bold'}}>Challenge</Text>
      </View>
      <FlexSpacing />
      <HeaderIcon name={"ios-settings"} action={onGoToSetting}/>
    </View>
  )
})

export default Header
