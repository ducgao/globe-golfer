import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import Theme from '../../../../res/Theme'

const HeaderIcon = React.memo(({name, action}) => (
  <TouchableOpacity style={{
    width: 40,
    justifyContent: name === "ios-settings" ? 'flex-end' : 'flex-start',
    alignItems: name === "ios-settings" ? 'flex-end' : 'flex-start'
  }} onPress={action}>
    <Icon 
      size={40}
      color={'white'}
      name={name}    
	  onPress={action}
    />
  </TouchableOpacity>
))

const MiddleContent = React.memo(({withSearch, onSearchKeywordChanged}) => {
  if (withSearch) {
    return <TextInput style={{
        flex: 1,
        marginHorizontal: 16,
        height: 32,
        backgroundColor: Theme.buttonPrimary,
        borderRadius: 16,
        paddingHorizontal: 8,
        color: "white"
      }} 
      placeholder="Search..." 
      placeholderTextColor="white"
      onChangeText={onSearchKeywordChanged}
    />
  }
  else {
    return <View style={{flex: 1}} />
  }
})

const Header = React.memo(({withSearch, onSearchKeywordChanged}) => {

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
      borderBottomWidth: 1,
      borderBottomColor: Theme.separator
    }}>
      <HeaderIcon name={"ios-arrow-back"} action={onGoBack}/>
      <MiddleContent withSearch={withSearch} onSearchKeywordChanged={onSearchKeywordChanged} />
      <HeaderIcon name={"ios-settings"} action={onGoToSetting}/>
    </View>
  )
})

export default Header