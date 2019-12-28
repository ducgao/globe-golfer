import React from 'react'
import {View, Image} from 'react-native'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'

const Player = React.memo(({avatar, name, showPoint, point}) => {
  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 24
    }}>
      <Image
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: 'white',
        }}
        source={{uri: avatar}}
      />
      <DGText style={{
        color: Theme.buttonPrimary,
        marginTop: 12
      }}>{name}</DGText>

      {/* {showPoint ? (<DGText style={{
        backgroundColor: Theme.buttonPrimary,
        color: 'white',
        marginTop: 12,
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 12,
      }}>{point > 1 ? (point + " points") : (point + " point")}</DGText>) : undefined} */}
    </View>
  )
})

export default React.memo(({playerA, playerB, showPoint}) => {
  return (
    <View style={{
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <Player avatar={playerA.avatar} name={playerA.name} showPoint={showPoint} />
      <DGText style={{
        color: Theme.buttonPrimary,
        marginHorizontal: 16,
        marginBottom: 32,
        fontSize: 30,
        fontWeight: 'bold',
      }}>VS</DGText>
      <Player avatar={playerB.avatar} name={playerB.name} showPoint={showPoint}/>
    </View>
  )
})