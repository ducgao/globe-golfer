import React from 'react'
import { View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Header from './Header'
import Theme from '../../../res/Theme';
import {StompEventTypes, withStomp} from 'react-stompjs'

import { connect } from 'react-redux'
import Api from '../../../api';
import LoadingModal from '../../../components/LoadingModal';
import { getMessages } from '../../../actions/getMessages';
import { getPendingMatches } from '../../../actions/getPendingMatches';
import { getPlayedMatches } from '../../../actions/getPlayedMatches';

class ChatDetail extends React.PureComponent {

  user1 = null
  user2 = null

  subscription = []
  
  constructor(props) {
    super(props)

    const data = props.navigation.getParam("data")

    const currentUserId = props.user.id

    this.user1 = {
      id: data.first.id,
      name: data.first.id == currentUserId ? [props.user.firstName, props.user.lastName].join(" ") : data.name,
      avatar: data.first.id == currentUserId ? props.user.avatar : data.avatar,
    }

    this.user2 = {
      id: data.second.id,
      name: data.second.id == currentUserId ? [props.user.firstName, props.user.lastName].join(" ") : data.name,
      avatar: data.second.id == currentUserId ? props.user.avatar : data.avatar,
    }

    const messages = data.message.map(m => {
      const owner = m.sender_id == this.user1.id ? this.user1 : this.user2
      return {
        _id: m.message_id,
        text: m.message,
        createdAt: m.time,
        user: {
          ...owner,
          _id: owner.id,
        },
      }
    })
    
    this.state = {
      messages,
      connecting: false
    }
  }

  componentDidMount() {
    const senderId = this.props.user.id
    const data = this.props.navigation.getParam("data")
    const path = '/channel/' + data.id
    const subscribePath = '/app/chat/' + data.id + '/Subscribe'
    const client = this.props.stompContext.getStompClient()

    Api.instance().updateReadMessage(data.id)
    
    client.publish({destination: subscribePath, body: JSON.stringify({sender_id: senderId})});
    this.subscription.push(client.subscribe(path, this.onNewMessageComming))
  }
  
  componentWillUnmount() {
    const tag = this.props.navigation.getParam('tag')
    this.props.getMessages(tag)
    this.props.getPendingMatches()
    this.props.getPlayedMatches()
  }

  onNewMessageComming = (message) => {
    const messageObject = JSON.parse(message.body)
    if (messageObject.message == null) {
      return
    }

    const owner = messageObject.sender_id == this.user1.id ? this.user1 : this.user2
    const currentTime = (new Date()).getMilliseconds()
    const newMessage = {
      _id: currentTime,
      text: messageObject.message,
      user: {
        ...owner,
        _id: owner.id,
      },
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessage),
    }))
  }

  onSend = (messages = []) => {
    const data = this.props.navigation.getParam("data")
    const senderId = this.props.user.id
    const userTo = senderId == this.user1.id ? this.user2.id : this.user1.id
    const message = {
      conversation_id: data.id,
      sender_id: this.props.user.id,
      message: messages[0].text,
      userto_id: userTo,
      type: 11,
      status: 0
    }

    const client = this.props.stompContext.getStompClient()
    const sendMessagePath = '/app/chat/' + data.id + '/sendMessage'
    client.publish({destination: sendMessagePath, body: JSON.stringify(message)});
  }

  render() {
    const host = this.props.user.id == this.user1.id ? this.user1 : this.user2
    return (
      <View style={{ backgroundColor: Theme.mainBackground, flex: 1 }}>
        <Header />
        <GiftedChat
          listViewProps={{
            style: {
              paddingVertical: 16,
            }
          }}
          alignTop={true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            ...host,
            _id: host.id
          }}
        />
        <LoadingModal visible={this.state.connecting} />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.profile.user
})

const mapDispatchToProps = (dispatch) => ({
  getMessages: (tag) => dispatch(getMessages(tag)),
  getPendingMatches: () => dispatch(getPendingMatches()),
  getPlayedMatches: () => dispatch(getPlayedMatches())
})

export default withStomp(connect(mapStateToProps, mapDispatchToProps)(ChatDetail))