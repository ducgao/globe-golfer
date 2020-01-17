import React from 'react'
import { Alert, View, TouchableOpacity } from 'react-native'

import { useNavigation } from 'react-navigation-hooks';
import DGText from '../../../components/DGText';
import LoadableImage from '../../../components/LoadableImage';
import Theme from '../../../res/Theme';
import GameData from '../subv2/GameData';

export default React.memo(({item, viewOnly}) => {

  const { navigate } = useNavigation()

  const requestPlayTo = () => {
    // console.warn(item);
    
    // GameData.instance().challengeId = item.id 
    // GameData.instance().playerA = item.from
    // GameData.instance().playerB = item.to
    
    // navigate("SelectNumber")

    Alert.alert("Feature is under development")
  }

  const sourceFrom = item.from.avatar ? { uri: item.from.avatar } : require('../../../res/images/golfer_placeholder.png')
  const sourceTo = item.to.avatar ? { uri: item.to.avatar } : require('../../../res/images/golfer_placeholder.png')
  const lastnameFrom = item.from.lastName.slice(0,1)
  const lastnameTo = item.to.lastName.slice(0,1)

  return (
    <View style={{ marginVertical: 16, flexDirection: 'row', justifyContent: 'center' }}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LoadableImage
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: Theme.buttonPrimary
          }}
          source={sourceFrom}
        />
        <DGText style={{color: 'white', marginTop: 12, fontWeight: '600'}}>{item.from.name + "." + lastnameFrom}</DGText>
      </View>
      <View style={{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
        {
          viewOnly ? undefined : (
            <TouchableOpacity activeOpacity={0.7} onPress={requestPlayTo}>
              <DGText style={{ 
                backgroundColor: Theme.buttonPrimary,
                color: Theme.textWhite,
                paddingHorizontal: 12,
                paddingVertical: 8
              }}>REPLAY</DGText>
            </TouchableOpacity>
          )
        }
      </View>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LoadableImage
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: Theme.buttonPrimary
          }}
          source={sourceTo}
        />
        <DGText style={{color: 'white', marginTop: 12, fontWeight: '600'}}>{item.to.name + "." + lastnameTo}</DGText>
      </View>
    </View>
  )
})