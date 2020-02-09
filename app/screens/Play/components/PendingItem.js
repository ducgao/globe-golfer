import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import { useNavigation } from 'react-navigation-hooks';
import DGText from '../../../components/DGText';
import LoadableImage from '../../../components/LoadableImage';
import Theme from '../../../res/Theme';
import GameData from '../subv2/GameData';

export default PendingItem = React.memo(({item, viewOnly, showName = true}) => {

  const { navigate } = useNavigation()

  const requestPlayTo = () => {
    
    GameData.instance().challengeId = item.id 
    GameData.instance().playerA = item.from
    GameData.instance().playerB = item.to
    
    GameData.instance().root1 = item.from
    GameData.instance().root2 = item.to
    
    navigate("SelectNumber")
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
        {showName ? 
          <DGText style={{color: 'white', marginTop: 12, fontWeight: '600'}}>{item.from.name + "." + item.from.lastName[0]}</DGText>
          :
          undefined
        }
        
      </View>
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
        {showName ? 
          <DGText style={{color: 'white', marginTop: 12, fontWeight: '600'}}>{item.to.name + "." + item.to.lastName[0]}</DGText>
          :
          undefined  
        }
      </View>
    </View>
  )
})