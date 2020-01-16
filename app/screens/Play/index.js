import React, { PureComponent } from 'react'
import { ActivityIndicator, View, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'

import Theme from '../../res/Theme'

import Header from './components/Header'
import PendingItem from './components/PendingItem'
import BaseComponent from '../../components/BaseComponent';
import DGText from '../../components/DGText';
import { getPendingMatches } from '../../actions/getPendingMatches';
import { getPlayedMatches } from '../../actions/getPlayedMatches';
import DialogCombination from '../../components/DialogCombination';
import LoadableImage from '../../components/LoadableImage'
import PlayedItem from './components/PlayedItem'

const Title = React.memo(() => {
  return (
    <DGText style={{ 
      color: Theme.textWhite, 
      alignSelf: 'center',
      fontSize: 24,
      fontWeight: 'bold'
    }}>Select your match</DGText>
  )
})

const BoardHeader = React.memo(({title, isExpanded, requestToggleExpand}) => {
  const icon = isExpanded ? require('../../res/images/ic_down.png') : require('../../res/images/ic_right.png')
  return (
    <TouchableOpacity style={{ 
      flexDirection: 'row', 
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical:12
      }} activeOpacity={0.7} onPress={requestToggleExpand}>
      <LoadableImage
        style={{
          width: 30, 
          height: 30, 
        }} 
        source={icon}
      />
      <DGText style={{ color: Theme.textWhite, marginHorizontal: 8 }} >{title}</DGText>
    </TouchableOpacity>
  )
})

const PendingItems = React.memo(({isLoading, data}) => {
  // Alert.alert(data)
  if (isLoading || data == null) {
    return <ActivityIndicator size='large' color={Theme.buttonPrimary} />
  }

  if (data.length == 0) {
    return <DGText style={{ color: Theme.textWhite, fontStyle: 'italic', marginHorizontal: 16 + 30 + 8, fontSize: 12 }}>No Pending Match</DGText>
  }

  return data.map((item, index) => <PendingItem key={`pending-item-${index}`} item={item} />)
})

const PendingBlock = React.memo(({isLoading, isExpanded, requestToggleExpand, data}) => {
  return (
    <>
      <BoardHeader title={"PENDING"} isExpanded={isExpanded} requestToggleExpand={requestToggleExpand}/>
      {isExpanded ? <PendingItems isLoading={isLoading} data={data} /> : undefined}
    </>
  )
})

// const PlayedItem = React.memo(({item, userAvatar}) => {
  
//   return (   
//     <View style={{ marginVertical: 16, flexDirection: 'row', justifyContent: 'center' }}>
//       <LoadableImage
//         style={{
//           width: 100,
//           height: 100,
//           borderRadius: 50
//         }}
//         source={{uri:item.from.avatar}}
//       />
//       <View style={{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
//         <DGText style={{ 
//           fontSize: 20,
//           fontWeight: 'bold',
//           marginBottom: 4,
//           color: Theme.buttonPrimary 
//         }}>{item.result}</DGText>
//         <TouchableOpacity activeOpacity={0.7} onPress={() => alert("Request replay with victim")}>
//           <DGText style={{ 
//             backgroundColor: Theme.buttonPrimary,
//             color: Theme.textWhite,
//             paddingHorizontal: 12,
//             paddingVertical: 8
//           }}>REPLAY</DGText>
//         </TouchableOpacity>
        
//       </View>
//       <LoadableImage
//         style={{
//           width: 100,
//           height: 100,
//           borderRadius: 50
//         }}
//         source={{uri: item.to.avatar}}
//       />
//     </View>
//   )
// })

const PlayedItems = React.memo(({isLoading, data, userAvatar}) => {
  if (isLoading || data == null) {
    return <ActivityIndicator size='large' color={Theme.buttonPrimary} />
  }

  if (data.length == 0) {
    return <DGText style={{ color: Theme.textWhite, fontStyle: 'italic', marginHorizontal: 16 + 30 + 8, fontSize: 12 }}>No Played Match</DGText>
  }

  return data.map((item, index) => <PlayedItem key={`played-item-${index}`} item={item} userAvatar={userAvatar} />)
})

const PlayedBlock = React.memo(({isLoading, isExpanded, requestToggleExpand, data, userAvatar}) => {
  return (
    <>
      <BoardHeader title={"PLAYED"} isExpanded={isExpanded} requestToggleExpand={requestToggleExpand}/>
      {isExpanded ? <PlayedItems isLoading={isLoading} data={data} userAvatar={userAvatar} /> : undefined}
    </>
  )
})

class Play extends PureComponent {
  static navigationOptions = { header: null }

  componentDidMount() {
    this.props.getPendingMatches()
  }

  state = {
    isPendingExpand: true,
    isPlayedExpand: false
  }

  requestTogglePendingBlock = () => {
    const nextValue = !this.state.isPendingExpand

    if (nextValue == true) {
      this.props.getPendingMatches()
    }

    this.setState({ isPendingExpand: nextValue })
  }

  requestTogglePlayedBlock = () => {
    const nextValue = !this.state.isPlayedExpand

    if (nextValue == true) {
      this.props.getPlayedMatches()
    }

    this.setState({ isPlayedExpand: nextValue })
  }
  
  render() {
    return (
      <BaseComponent>
        <Header />
        <DialogCombination>
          <Title />
          <PendingBlock 
            data={this.props.pendingData.data}
            isExpanded={this.state.isPendingExpand}
            isLoading={this.props.pendingData.isLoading}
            requestToggleExpand={this.requestTogglePendingBlock} 
          />
          <PlayedBlock 
            data={this.props.playedData.data}
            isExpanded={this.state.isPlayedExpand} 
            isLoading={this.props.playedData.isLoading}
            requestToggleExpand={this.requestTogglePlayedBlock} 
          />
        </DialogCombination>
      </BaseComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.profile.user,
  pendingData: state.matches.pending,
  playedData: state.matches.played
})

const mapDispatchToProps = (dispatch) => ({
  getPendingMatches: () => dispatch(getPendingMatches()),
  getPlayedMatches: () => dispatch(getPlayedMatches())
})

export default connect(mapStateToProps, mapDispatchToProps)(Play)