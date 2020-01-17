import React from 'react'
import {View, Image} from 'react-native'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'

const Player = React.memo(({avatar, name, lastName, showPoint, point}) => {
  
  const lastname = lastName.slice(0,1);
  
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
      }}>{name + "." + lastname}</DGText>

      {showPoint ? (<DGText style={{
        backgroundColor: Theme.buttonPrimary,
        color: 'white',
        marginTop: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
      }}>{point > 1 ? (point + " points") : (point + " point")}</DGText>) : undefined}
    </View>
  )
})

export default React.memo(({playerA, playerB, showPoint}) => {

  const aIndex = Number.parseInt(playerA.index)
  const bIndex = Number.parseInt(playerB.index)

  const aBasePoint = Math.floor(aIndex * 3/4) 
  const bBasePoint = Math.floor(bIndex * 3/4) 

  let aPoint = 0
  let bPoint = 0

  if (aBasePoint > bBasePoint) {
    aPoint = Math.abs(aBasePoint - bBasePoint) 
  } else {
    bPoint = Math.abs(aBasePoint - bBasePoint) 
  }
  return (
    <View style={{
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <Player avatar={playerA.avatar} name={playerA.name} lastName={playerA.lastName} showPoint={showPoint} point={aPoint} />
      <DGText style={{
        color: Theme.buttonPrimary,
        marginHorizontal: 16,
        marginBottom: 32,
        fontSize: 30,
        fontWeight: 'bold',
      }}>VS</DGText>
      <Player avatar={playerB.avatar} name={playerB.name} lastName={playerB.lastName} showPoint={showPoint} point={bPoint}/>
    </View>
  )
})