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
import lodash from 'lodash'
import Api from '../../api'
import { withNavigationFocus } from 'react-navigation'
import Ads from '../../components/Ads'

const Challenge = React.memo(({item, onPress}) => {

  const imageSource = item.avatar ? {uri: item.avatar} : require('../../res/images/golfer_placeholder.png')

  const onUserPress = () => {
    onPress && onPress(item)
  }

  return (
    <TouchableOpacity style={{ marginHorizontal: 8 }} activeOpacity={0.7} onPress={onUserPress}>
      <LoadableImage
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: Theme.buttonPrimary
        }}
        source={imageSource}
      />
      <DGText style={{
        width: 50,
        marginTop: 4,
        textAlign: 'center',
        color: 'white'
      }} numberOfLines={1}>{item.name}</DGText>
    </TouchableOpacity>
  )
})

const Challengers = React.memo(({title, data, onPress}) => {
  if (!Array.isArray(data)) {
    return (
      <>
        <DGText style={{ 
          marginTop: 12,
          marginBottom: 8,
          fontSize: 18,
          color: Theme.textWhite, 
          marginHorizontal: 16 
        }}>{title}</DGText>
        <ActivityIndicator size='large' color={Theme.buttonPrimary} />
      </>
    )
  }

  if (data.length == 0) {
    return (
      <>
        <DGText style={{ 
          marginTop: 12,
          marginBottom: 8,
          fontSize: 18,
          color: Theme.textWhite, 
          marginHorizontal: 16 
        }}>{title}</DGText>
        <DGText style={{
          color: Theme.textWhite,
          fontStyle: 'italic',
          marginLeft: 16,
          marginTop: 8
        }}>{`You have no ${title.toLowerCase()} right now`}</DGText>
      </>
    )
  }

  const items = data.map((item, index) => <Challenge key={`challenge-${index}`} item={item} onPress={onPress} />)

  return (
    <>
      <DGText style={{ 
        marginTop: 12,
        marginBottom: 8,
        fontSize: 18,
        color: Theme.textWhite, 
        marginHorizontal: 16 
      }}>{title}</DGText>
      <ScrollView style={{ 
        paddingHorizontal: 8,
        marginTop: 12
      }} showsHorizontalScrollIndicator={false} horizontal={true}>
        {items}
      </ScrollView>
    </>
  )
})

const Message = React.memo(({isLoading, data, user, tag}) => {
  return <Board 
    user={user}
    title="Message"
    isLoading={isLoading}
    data={data}
    tag={tag}
  />
})

const EmptyData = React.memo(() => {
  return <DGText style={{ color: Theme.textWhite, fontStyle: 'italic', marginHorizontal: 16, fontSize: 12 }}>No Message</DGText>
})

const MessageItem = React.memo(({user, item, tag}) => {

  const { navigate } = useNavigation()

  const onPress = () => {
    navigate("ChatDetail", {
      data: item,
      tag
    })
  }

  let you = item.first.id === user.id ? item.first : item.second
  const isUnread = you.unread > 0

  let lastMessage = "draft:"
  if (Array.isArray(item.message) && item.message.length > 0) {
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
          color: Theme.textWhite,
          fontStyle: 'italic',
          fontSize: 12
        }} numberOfLines={1}>{lastMessage}</DGText>
      </View>
      {isUnread ? (
        <View 
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: Theme.buttonPrimary,
            marginTop: 25
          }}
        />
      ) : undefined}
    </TouchableOpacity>
  )
})

const MessageBlock = React.memo(({user, data, tag}) => {
  const items = data.map((item, index) => <MessageItem key={`message-item-${index}`} item={item} user={user} tag={tag} />)
  return (
    <>
      {items}
    </>
  )
})

const Board = React.memo(({user, title, isLoading, data, tag}) => {
  let content = undefined;
  if (isLoading || data == null) {
    content = <ActivityIndicator size='large' color={Theme.buttonPrimary} />
  }
  else if (data.length == 0) {
    content = <EmptyData />
  }
  else {
    content = <MessageBlock data={data} user={user} tag={tag} />
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

  constructor(props) {
    super(props)
    
    const initTag =  props.navigation.getParam("tag")
    
    this.state = {
      tabIndex: initTag ? initTag : 0
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      const initTag = this.props.navigation.getParam("tag")
      this.setState({
        tabIndex: initTag == 1 ? 1 : 0
      })
    }
  }

  requestToggleExpand = () => {
    this.setState({ isAllExpand: !this.state.isAllExpand })
  }

  onFilterChanged = (nextValue) => {
    let theValue = 0
    if (this.state.tabIndex == null) {
      const initTag = this.props.navigation.getParam("tag")
      if (initTag == 0 || initTag == 1) {
        this.setState({tabIndex: initTag})

        theValue = initTag
      }
    }
    else {
      this.setState({tabIndex: nextValue})
      theValue = nextValue
    }

    this.props.getMessages(theValue)

    if (theValue == 0) {
      this.props.getPendingMatches()
      this.props.getPlayedMatches()
    }
  }

  onChallengePress = (challenger) => {
    const conversation = lodash.find(this.props.messagesData.data, (item) => item.avatar == challenger.avatar)
    if (conversation) {
      this.props.navigation.navigate("ChatDetail", {
        data: conversation,
        tag: this.state.tabIndex
      })
    }
    else {
      Api.instance().createConversation(challenger.id).then(res => {
        this.props.navigation.navigate("ChatDetail", {
          data: {
            ...res,
            name: challenger.name,
            avatar: challenger.avatar,
            message: []
          },
          tag: this.state.tabIndex
        })
      })
    }
  }
  
  render() {
    let challengersData = null

    const {pendingData, playedData, messagesData} = this.props

    if (!pendingData.isLoading && !playedData.isLoading && !messagesData.isLoading) {
      if (this.state.tabIndex == 0 && Array.isArray(pendingData.data)) {
        if (challengersData == null) {
          challengersData = []
        }
        pendingData.data.forEach(d => {
          challengersData.push(d.to)
        });
      }

      if (this.state.tabIndex == 0 && Array.isArray(playedData.data)) {
        if (challengersData == null) {
          challengersData = []
        }
        playedData.data.forEach(d => {
          challengersData.push(d.to)
        });
      }

      if (Array.isArray(messagesData.data)) {
        if (challengersData == null) {
          challengersData = []
        }
        messagesData.data.forEach(d => {
          if (d.avatar != this.props.user.avatar) {
            challengersData.push({
              name: d.name,
              avatar: d.avatar
            })
          }
        })
      }
    }

    challengersData = lodash.uniqBy(challengersData, "avatar")
    challengersData = lodash.filter(challengersData, (t) => t.avatar != this.props.user.avatar)
    const messageData = lodash.filter(this.props.messagesData.data, (t) => t.avatar != this.props.user.avatar)
    
    return (
      <BaseComponent>
        <Header />
        <Filter onFilterChanged={this.onFilterChanged} initTab={this.state.tabIndex} />
        <ScrollView showsVerticalScrollIndicator={false} >
          <Challengers 
            title={this.state.tabIndex == 0 ? "Challengers" : "Friends"} 
            data={challengersData}
            onPress={this.onChallengePress}
          />
          <Message
            user={this.props.user}
            requestToggleExpand={this.requestToggleExpand}
            isLoading={this.props.messagesData.isLoading}
            data={messageData}
            tag={this.state.tabIndex}
          />
        </ScrollView>
        <Ads />
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

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Chat))

