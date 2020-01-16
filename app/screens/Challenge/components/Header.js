import React from 'react'
import { View, TextInput } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import FlexSpacing from './FlexSpacing'
import Toggler from '@components/Toggler';

const HeaderIcon = React.memo(({ name, action }) => (
  <Icon
    size={32}

    color={'white'}
    name={name}
    onPress={action}
  />
))
const MiddleContent = React.memo(({ withSearch, onSearchKeywordChanged }) => {
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
    return <View style={{ flex: 1 }} />
  }
})
const Header = React.memo(({ isOn, onViewModeChanged, onSearchKeywordChanged }) => {

  const { goBack, navigate } = useNavigation()

  const onGoBack = () => {
    goBack()
  }

  onSearchKeywordChanged = (kw) => {
    if (kw === "") {
      this.setState({keyword: null})
      return
    }

    this.setState({keyword: kw})
  }

  const onGoToSetting = () => {
    navigate('Profile')
  }

  return (
    <View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}>
        <HeaderIcon name={"ios-arrow-back"} action={onGoBack} />
        <FlexSpacing />
        <Toggler isOn={isOn} onChanged={onViewModeChanged} />
        <FlexSpacing />
        <HeaderIcon name={"ios-settings"} action={onGoToSetting} />
      </View>
      <View style={{
        height: 40
      }}>
        <MiddleContent withSearch={isOn} onSearchKeywordChanged={onSearchKeywordChanged} />
      </View>
    </View>
  )
})

export default Header