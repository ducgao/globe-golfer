import React from 'react'
import { View } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import DGText from '../../../components/DGText';

const HeaderIcon = React.memo(({name, action}) => (
  <Icon 
    size={32}
    color={'white'}
    name={name}
    onPress={action}
  />
))

const Title = React.memo(({title}) => {
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
      }}>{title}</DGText>
    </View>
  )
})

const Header = React.memo(({onRequestGoBack, onRequestSaveScoreCard, navigate}) => {
  
  const onGoBack = () => {
    if (onRequestGoBack) {
      onRequestGoBack()
    }
  }
  const onGoHome = () => {
    navigate('Menu')
  }

  const onGoToSetting = () => {
    if (onRequestSaveScoreCard) {
      onRequestSaveScoreCard()
    }
  }

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginTop: 20
    }}>
      <HeaderIcon name={"ios-home"} action={onGoHome}/>
      <Title title={"Match"}/>
      <HeaderIcon name={"ios-arrow-forward"} action={onGoToSetting}/>
    </View>
  )
})

export default Header