import React from 'react'
import {View, Image} from 'react-native'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'

const Player = React.memo(({avatar, name, point}) => {
  if (!avatar && !name) {
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 24,
        marginHorizontal: 8,
      }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <DGText style={{
            color: Theme.buttonPrimary,
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center'
          }}>{"New PLAYERS"}</DGText>
        </View>
        <DGText style={{
          color: Theme.buttonPrimary,
          marginTop: 16
        }}>{"Select player"}</DGText>
      </View>
    )
  }

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 24,
      marginHorizontal: 8,
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
        marginTop: 16
      }}>{name}</DGText>
      {point != null && point != undefined ? (<DGText style={{
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

export default React.memo(({playerA, playerB, playerC, showPoint}) => {

  let playerCUI = null
  let pointA
  let pointB
  let pointC

  if (showPoint) {
    const aIndex = playerA.index ? playerA.index : 0
    const bIndex = playerB.index ? playerB.index : 0
    const cIndex = playerC ? (playerC.index ? playerC.index : 0) : 0
  
    const pA3d4 = Math.floor(aIndex * 3/4)
    const pB3d4 = Math.floor(bIndex * 3/4)
    const pC3d4 = Math.floor(cIndex * 3/4) 
  
    const lowest = Math.min(pA3d4, pB3d4, pC3d4)
  
    pointA = Math.round(Math.abs(pA3d4 - lowest)/2)
    pointB = Math.round(Math.abs(pB3d4 - lowest)/2)
    pointC = Math.round(Math.abs(pC3d4 - lowest)/2)

    console.warn(bIndex);
    console.warn(pB3d4)
    console.warn(lowest)
    console.warn(pointB)
  }

  if (!playerC) {
    playerCUI = <Player />
  }
  else if (playerC.avatar) {
    playerCUI = <Player avatar={playerC.avatar} name={playerC.name} point={pointC} />
  }
  else {
    playerCUI = <Player avatar={playerC.avatar} name={playerC.name} point={pointC} />
  }

  return (
    <View style={{
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <Player avatar={playerA.avatar} name={playerA.name} point={pointA} />
      <Player avatar={playerB.avatar} name={playerB.name} point={pointB}/>
      {playerCUI}
    </View>
  )
})