import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import { useNavigation } from 'react-navigation-hooks';
import DGText from '../../../components/DGText';
import LoadableImage from '../../../components/LoadableImage';
import Theme from '../../../res/Theme';

export default PendingItem = React.memo(({item, viewOnly}) => {

  const { navigate } = useNavigation()

  const requestPlayTo = () => {
    console.warn(item);
    
    navigate("PlayConfiguration", { data: item })
  }

  const sourceFrom = item.from.avatar ? { uri: item.from.avatar } : require('../../../res/images/golfer_placeholder.png')
  const sourceTo = item.to.avatar ? { uri: item.to.avatar } : require('../../../res/images/golfer_placeholder.png')

  return (
    <View style={{ marginVertical: 16, flexDirection: 'row', justifyContent: 'center' }}>
      <LoadableImage
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: Theme.buttonPrimary
        }}
        source={sourceFrom}
      />
      <View style={{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
        <DGText style={{ 
          fontSize: 20,
          marginBottom: 4,
          color: Theme.buttonPrimary 
        }} >VS</DGText>
        {
          viewOnly ? undefined : (
            <TouchableOpacity activeOpacity={0.7} onPress={requestPlayTo}>
              <DGText style={{ 
                backgroundColor: Theme.buttonPrimary,
                color: Theme.textWhite,
                paddingHorizontal: 12,
                paddingVertical: 8
              }}>PLAY NOW</DGText>
            </TouchableOpacity>
          )
        }
      </View>
      <LoadableImage
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: Theme.buttonPrimary
        }}
        source={sourceTo}
      />
    </View>
  )
})