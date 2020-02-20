import React from 'react'
import { Alert, View, TouchableOpacity } from 'react-native'

import { useNavigation } from 'react-navigation-hooks';
import DGText from '../../../components/DGText';
import LoadableImage from '../../../components/LoadableImage';
import Theme from '../../../res/Theme';
import GameData from '../subv2/GameData';
import Api from '../../../api';

export default React.memo(({item, viewOnly, myId}) => {

  const requestPlayTo = () => {
    const target = myId === item.from.id ? item.to : item.from
    console.warn(target);
    Api.instance().challengeTo(target.id);
    Alert.alert("Request Sent!", "You just sent a new request to play again with xxx, please wait for the response from him!".replace('xxx', target.name))
  }

  const sourceFrom = item.from.avatar ? { uri: item.from.avatar } : require('../../../res/images/golfer_placeholder.png')
  const sourceTo = item.to.avatar ? { uri: item.to.avatar } : require('../../../res/images/golfer_placeholder.png')

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
        <DGText style={{color: 'white', marginTop: 12, fontWeight: '600'}}>{item.from.name}</DGText>
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
        <DGText style={{color: 'white', marginTop: 12, fontWeight: '600'}}>{item.to.name}</DGText>
      </View>
    </View>
  )
})