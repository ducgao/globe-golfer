import React from 'react'
import {View, Image} from 'react-native'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'

const Player = React.memo(({avatar, name, showPoint, point, isWinner}) => {
  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 24
    }}>
      <Image
        style={{
          width: 100 + (isWinner ? 40 : 0),
          height: 100 + (isWinner ? 40 : 0),
          borderRadius: 50 + (isWinner ? 20 : 0),
          borderWidth: 2,
          borderColor: 'white',
        }}
        source={{uri: avatar}}
      />
      <DGText style={{
        color: Theme.buttonPrimary,
        marginTop: 12
      }}>{name}</DGText>

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

export default React.memo(({playerA, playerB, showPoint, winner}) => {

  let aIndex = Number.parseInt(playerA.index)
  let bIndex = Number.parseInt(playerB.index)

  aIndex = aIndex ? aIndex : 0
  bIndex = bIndex ? bIndex : 0

  const aBasePoint = Math.floor(aIndex * 3/4) 
  const bBasePoint = Math.floor(bIndex * 3/4) 

  let aPoint = 0
  let bPoint = 0

  if (aBasePoint > bBasePoint) {
    aPoint = Math.round(Math.abs(aBasePoint - bBasePoint)/2)
  } else {
    bPoint = Math.round(Math.abs(aBasePoint - bBasePoint)/2)
  }

  return (
    <View style={{
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <Player 
        avatar={playerA.avatar} 
        name={playerA.name + "." + playerA.lastName[0]} 
        showPoint={showPoint} 
        point={aPoint} 
        isWinner={winner === playerA}
      />
      <DGText style={{
        color: Theme.buttonPrimary,
        marginHorizontal: 16,
        marginBottom: 32,
        fontSize: 30,
        fontWeight: 'bold',
      }}>VS</DGText>
      <Player 
        avatar={playerB.avatar} 
        name={playerB.name + "." + playerB.lastName[0]} 
        showPoint={showPoint} 
        point={bPoint}
        isWinner={winner === playerB}
      />
    </View>
  )
})