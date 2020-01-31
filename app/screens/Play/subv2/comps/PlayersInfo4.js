import React from 'react'
import {TouchableOpacity, View, Image} from 'react-native'
import DGText from '../../../../components/DGText'
import Theme from '../../../../res/Theme'
import GameData from '../GameData'
import SelectItem from './CircleButton'

const NewPlayer = React.memo(({
  tag, 
  renderMode, 
  onRequestSelect, 
  team, 
  onRequestSwitch,
  onRequestMoveHere
}) => {
  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: 40,
      opacity: renderMode === "host" ? 0.3 : 1
    }}>
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: team,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={onRequestSelect}
        onLongPress={() => onRequestSwitch(tag)}
        // disabled={onRequestSelect === undefined}
      >
        <DGText style={{
          color: Theme.buttonPrimary,
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center'
        }}>{"New PLAYERS"}</DGText>
      </TouchableOpacity>
      <DGText style={{
        color: Theme.buttonPrimary,
        marginTop: 16
      }}>{"Select player"}</DGText>
      {
        renderMode === "target" ? (<TouchableOpacity 
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            top: 0,
            position: 'absolute',
            backgroundColor: '#00000099',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => onRequestMoveHere(tag)}
        >
          <DGText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>Move Here</DGText>
        </TouchableOpacity>) : undefined
      }
    </View>
  )
})

const PlayerWithoutAvatar = React.memo(({
  tag, 
  renderMode, 
  name, 
  onRequestSelect, 
  team, 
  onRequestSwitch,
  onRequestMoveHere,
}) => {
  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: 40,
      opacity: renderMode === "host" ? 0.3 : 1
    }}>
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: team,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={onRequestSelect}
        onLongPress={() => onRequestSwitch(tag)}
      >
        <DGText style={{
          color: Theme.buttonPrimary,
          fontWeight: 'bold',
          fontSize: 40,
          textAlign: 'center'
        }}>{name[0]}</DGText>
      </TouchableOpacity>
      <DGText style={{
        color: Theme.buttonPrimary,
        marginTop: 16
      }}>{name}</DGText>
      {
        renderMode === "target" ? (<TouchableOpacity 
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            top: 0,
            position: 'absolute',
            backgroundColor: '#00000080',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => onRequestMoveHere(tag)}
        >
          <DGText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>Move Here</DGText>
        </TouchableOpacity>) : undefined
      }
    </View>
  )
})

const Player = React.memo(({
  tag, 
  renderMode, 
  avatar, 
  name, 
  onRequestSelect, 
  team, 
  onRequestSwitch,
  onRequestMoveHere
}) => {
  if (!avatar && !name) {
    return <NewPlayer 
      tag={tag}
      renderMode={renderMode}
      onRequestSelect={onRequestSelect} 
      team={team} 
      onRequestSwitch={onRequestSwitch} 
      onRequestMoveHere={onRequestMoveHere}
    />
  }

  if (!avatar) {
    return <PlayerWithoutAvatar 
      tag={tag}
      renderMode={renderMode}
      name={name} 
      onRequestSelect={onRequestSelect} 
      team={team} 
      onRequestSwitch={onRequestSwitch} 
      onRequestMoveHere={onRequestMoveHere}
    />
  }

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: 40,
      opacity: renderMode === "host" ? 0.3 : 1
    }}>
      <TouchableOpacity
        onPress={onRequestSelect}
        onLongPress={() => onRequestSwitch(tag)}
      >
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: team,
          }}
          source={{uri: avatar}}
        />
      </TouchableOpacity>
      <DGText style={{
        color: Theme.buttonPrimary,
        marginTop: 16
      }}>{name}</DGText>
      {
        renderMode === "target" ? (<TouchableOpacity 
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            top: 0,
            position: 'absolute',
            backgroundColor: '#00000080',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => onRequestMoveHere(tag)}
        >
          <DGText style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>Move Here</DGText>
        </TouchableOpacity>) : undefined
      }
    </View>
  )
})

export default React.memo(({
  playerA, 
  playerB, 
  playerC, 
  playerD, 
  onRequestChangeA,
  onRequestChangeB,
  onRequestChangeC, 
  onRequestChangeD,
  onSwitched = () => {},
}) => {

  const playerMap = {
    "A": playerA,
    "B": playerB,
    "C": playerC,
    "D": playerD
  }

  const [state, setState] = React.useState({
    switchTarget: null
  })

  const onRequestSwitch = (target) => {
    setState({switchTarget: target})
  }

  const onRequestMoveHere = (target) => {
    const from = state.switchTarget
    const to = target

    const newA = getNewPlayerPos("A", from, to)
    const newB = getNewPlayerPos("B", from, to)
    const newC = getNewPlayerPos("C", from, to)
    const newD = getNewPlayerPos("D", from, to)

    onSwitched && onSwitched(newA, newB, newC, newD)

    setState({switchTarget: null})
  }

  const getNewPlayerPos = (tag, from, to) => {
    let player;
    if (from == tag || to == tag) {
      player = from == tag ? playerMap[to] : playerMap[from]
    }
    else {
      player = playerMap[tag]
    }

    return player
  }

  const gameData = GameData.instance()

  const renderPlayer = React.useCallback((tag, p, rqc, team) => {
    let renderMode = "none"
    if (state.switchTarget) {
      renderMode = state.switchTarget === tag ? "host" : "target"
    }
    
    if (!p) {
      return <Player 
        tag={tag} 
        renderMode={renderMode}
        onRequestSelect={rqc} 
        team={team} 
        onRequestSwitch={onSwitched ? onRequestSwitch : undefined} 
        onRequestMoveHere={onRequestMoveHere}
      />
    }
    else {
      if (p.avatar == gameData.root1.avatar || p.avatar == gameData.root2.avatar) {
        return <Player 
          tag={tag} 
          renderMode={renderMode}
          avatar={p.avatar} 
          name={p.name + "." + p.lastName[0]} 
          team={team} 
          onRequestSwitch={onSwitched ? onRequestSwitch : undefined} 
          onRequestMoveHere={onRequestMoveHere}
        />
      }
      else {
        return <Player 
          tag={tag} 
          renderMode={renderMode}
          avatar={p.avatar} 
          name={p.name + "." + p.lastName[0]} 
          onRequestSelect={rqc} 
          team={team} 
          onRequestSwitch={onSwitched ? onRequestSwitch : undefined} 
          onRequestMoveHere={onRequestMoveHere}
        />
      }
    }
  }, [state.switchTarget])

  return (
    <View style={{
      marginTop: 12,
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <View style={{width: '50%', justifyContent: 'center', alignItems: 'center'}}>
        {renderPlayer("A", playerA, onRequestChangeA, "white")}
        {renderPlayer("C", playerC, onRequestChangeC, "white")}
      </View>
      {
        state.switchTarget ? (
          <SelectItem 
            value={"Cancel"} 
            tint={"white"} 
            onPress={() => setState({switchTarget: null})}
          />
        ) : (
          <DGText style={{
            color: Theme.buttonPrimary,
            fontSize: 30,
            fontWeight: 'bold',
          }}>VS</DGText>
        )
      }
      <View style={{width: '50%', justifyContent: 'center', alignItems: 'center'}}>
        {renderPlayer("B", playerB, onRequestChangeB, Theme.buttonPrimary)}
        {renderPlayer("D", playerD, onRequestChangeD, Theme.buttonPrimary)}
      </View>
    </View>
  )
})