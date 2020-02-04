import React from 'react'
import { View, Dimensions, TouchableOpacity, Image } from 'react-native'

import DGText from '@components/DGText'
import CardRatingBar from './CardRatingBar'
import LinearGradient from 'react-native-linear-gradient'
import LoadableImage from '../../../components/LoadableImage'

const windowWidth = Dimensions.get('window').width

const CardBasicInfo = React.memo(({ item, index, avatar, name, location, rating, onPress }) => {
  
  const avatarSource = avatar && avatar.startsWith("http") ? { uri: avatar } : require('../../../res/images/golfer_placeholder.png')
  return (
    <TouchableOpacity 
      style={{ alignItems: 'center', marginTop: 20, width: windowWidth / 2 }}
      activeOpacity={0.7}
      onPress={() => { onPress(index, item) }}
    >
      <LoadableImage 
        style={{ 
          width: windowWidth / 2 - 40, 
          height: windowWidth / 2 - 40,
          borderRadius: (windowWidth / 2 - 40) / 2
        }}
        source={avatarSource}
        resizeMethod='resize'
        resizeMode='cover'
      />
      <LinearGradient 
        colors={['#00000000', '#000000']} 
        style={{ 
          position: 'absolute', 
          bottom: 0,
          width: '100%', 
          paddingBottom: 12 
        }}
      >
        <View>
          <DGText style={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            color: 'white',
            fontSize: 20
          }}>{name}</DGText>
          <DGText style={{ 
            textAlign: 'center', 
            color: 'white',
            fontSize: 10
          }}>{location}</DGText>
          <CardRatingBar small={true} star={rating} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
})

export default CardBasicInfo