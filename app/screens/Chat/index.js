import React, { PureComponent } from 'react'
import { ActivityIndicator, ScrollView, View, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'

import Theme from '../../res/Theme'

import Header from './components/Header'
import BaseComponent from '../../components/BaseComponent';
import Filter from './components/Filter';
import DGText from '../../components/DGText';
import { getMessages } from '../../actions/getMessages';
import { useNavigation } from 'react-navigation-hooks';
import { getPendingMatches } from '../../actions/getPendingMatches'
import { getPlayedMatches } from '../../actions/getPlayedMatches'
import LoadableImage from '../../components/LoadableImage'

const Challenge = React.memo(({item, onPress}) => {

  const imageSource = item.avatar ? {uri: item.avatar} : require('../../res/images/golfer_placeholder.png')

  return (
    <TouchableOpacity style={{ marginHorizontal: 8 }} activeOpacity={0.7} onPress={onPress}>
      <LoadableImage
        style={{
          width: 50,
          height: 50,
          borderRadius: 25
        }}
        source={imageSource}
      />
      <DGText style={{
        width: 50,
        marginTop: 4,
        textAlign: 'center',
        color: 'white'
      }}>{item.name}</DGText>
    </TouchableOpacity>
  )
})

const Challengers = React.memo(({data}) => {
  if (!Array.isArray(data) || data.length == 0) {
    return (
      <>
        <DGText style={{ 
          marginTop: 12,
          marginBottom: 8,
          fontSize: 18,
          color: Theme.textWhite, 
          marginHorizontal: 16 
        }}>Challengers</DGText>
        <DGText style={{
          color: Theme.textWhite,
          fontStyle: 'italic',
          marginLeft: 16,
          marginTop: 8
        }}>You have no challenger right now</DGText>
      </>
    )
  }

  const items = data.map((item, index) => <Challenge key={`challenge-${index}`} item={item} />)

  return (
    <>
      <DGText style={{ 
        marginTop: 12,
        marginBottom: 8,
        fontSize: 18,
        color: Theme.textWhite, 
        marginHorizontal: 16 
      }}>Challengers</DGText>
      <ScrollView style={{ 
        paddingHorizontal: 8,
        marginTop: 12
      }} showsHorizontalScrollIndicator={false} horizontal={true}>
        {items}
      </ScrollView>
    </>
  )
})

const Message = React.memo(({isLoading, data, user}) => {
  return <Board 
    user={user}
    title="Message"
    isLoading={isLoading}
    data={data}
  />
})

const EmptyData = React.memo(() => {
  return <DGText style={{ color: Theme.textWhite, fontStyle: 'italic', marginHorizontal: 16, fontSize: 12 }}>No Message</DGText>
})

const MessageItem = React.memo(({user, item}) => {

  const { navigate } = useNavigation()

  const onPress = () => {
    navigate("ChatDetail", {data: item})
  }

  let lastMessage = "draft:"
  if (item.message.length > 0) {
    if (item.message[0].sender_id == user.id) {
      lastMessage = "You: " + item.message[0].message
    }
    else {
      lastMessage = item.message[0].message
    }
  }

  const imageSource = item.avatar ? {uri: item.avatar} : require('../../res/images/golfer_placeholder.png')

  return (
    <TouchableOpacity 
      style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        paddingHorizontal: 16, 
        height: 80, 
        marginTop: 12 
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <LoadableImage
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: Theme.buttonPrimary
        }}
        source={imageSource}
      />
      <View style={{
        flex: 1,
        marginLeft: 16,
        height: 60,
        justifyContent: 'center',
      }}>
        <DGText style={{
          color: Theme.textWhite,
          fontSize: 20
        }}>{item.name}</DGText>
        <DGText style={{ 
          color: Theme.textWhite
        }} numberOfLines={1}>{lastMessage}</DGText>
      </View>
    </TouchableOpacity>
  )
})

const MessageBlock = React.memo(({user, data}) => {
  const items = data.map((item, index) => <MessageItem key={`message-item-${index}`} item={item} user={user}/>)
  return (
    <>
      {items}
    </>
  )
})

const Board = React.memo(({user, title, isLoading, data}) => {
  let content = undefined;
  if (isLoading || data == null) {
    content = <ActivityIndicator size='large' color={Theme.buttonPrimary} />
  }
  else if (data.length == 0) {
    content = <EmptyData />
  }
  else {
    content = <MessageBlock data={data} user={user} />
  }


  return (
    <>
      <DGText style={{ 
        color: Theme.textWhite, 
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        fontSize: 18,
  
      }}>{title}</DGText>
      {content}
    </>
  )
})

class Chat extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    tabIndex: 0
  }

  componentDidMount() {
    this.props.getPendingMatches()
    this.props.getPlayedMatches()
  }

  requestToggleExpand = () => {
    this.setState({ isAllExpand: !this.state.isAllExpand })
  }

  onFilterChanged = (nextValue) => {
    this.setState({tabIndex: nextValue})
    this.props.getMessages(nextValue)
  }
  
  render() {
    const challengersData = []
    
    if (Array.isArray(this.props.pendingData.data)) {
      this.props.pendingData.data.forEach(d => {
        challengersData.push(d.to)
      });
    }

    if (Array.isArray(this.props.playedData.data)) {
      this.props.playedData.data.forEach(d => {
        challengersData.push(d.to)
      });
    }

    return (
      <BaseComponent>
        <Header />
        <Filter onFilterChanged={this.onFilterChanged} />
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.state.tabIndex == 0 ? <Challengers data={challengersData}/> : undefined}
          <Message 
            user={this.props.user}
            requestToggleExpand={this.requestToggleExpand}
            isLoading={this.props.messagesData.isLoading}
            data={this.props.messagesData.data}
          />
        </ScrollView>
      </BaseComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.profile.user,
  messagesData: state.messages,
  pendingData: state.matches.pending,
  playedData: state.matches.played
})

const mapDispatchToProps = (dispatch) => ({
  getMessages: (tag) => dispatch(getMessages(tag)),
  getPendingMatches: () => dispatch(getPendingMatches()),
  getPlayedMatches: () => dispatch(getPlayedMatches())
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)

