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
import lodash from 'lodash'
import { BASE } from '../../../api/Endpoints'
import OneSignal from 'react-native-onesignal';

class ChatDetail extends React.PureComponent {

  user1 = null
  user2 = null

  host = null
  target = null

  client = null

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

    if (props.user.id == this.user1.id) {
      this.host = this.user1
      this.target = this.user2
    }
    else {
      this.target = this.user1
      this.host = this.user2
    }

    const messages = data.message.map(m => {
      const owner = m.sender_id == this.user1.id ? this.user1 : this.user2
      return {
        _id: m.message_id,
        text: m.message,
        sent: true,
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

    OneSignal.setSubscription(false)

    Api.instance().updateReadMessage(data.id)

    this.doSomethingWithAliveStompClient((client) => {
      client.publish({destination: subscribePath, body: JSON.stringify({sender_id: senderId})});
      this.subscription.push(client.subscribe(path, this.onNewMessageComming))
    })
  }
  
  componentWillUnmount() {

    OneSignal.setSubscription(true)

    const tag = this.props.navigation.getParam('tag')
    this.props.getMessages(tag)
    this.props.getPendingMatches()
    this.props.getPlayedMatches()
  }

  doSomethingWithAliveStompClient(job) {
    if (this.client) {
      job(this.client)
    }
    else {
      this.configStomp().then(() => {
        this.doSomethingWithAliveStompClient(job)
      })
    }
  }

  configStomp() {
    return new Promise((resolve, _) => {
      const token = Api.instance().getAccessToken()

      this.props.stompContext.addStompEventListener(StompEventTypes.Connect, () => {
        this.client = this.props.stompContext.getStompClient()
        resolve("ok")
      })
      this.props.stompContext.addStompEventListener(StompEventTypes.Disconnect, () => {
        this.client = null
      })
      this.props.stompContext.addStompEventListener(StompEventTypes.WebSocketClose, () => {
        this.client = null
      })

      this.props.stompContext.newStompClient(
        BASE + "ws?access_token=" + token,
        null,
        null,
        "/"
      )
    })
  } 

  onNewMessageComming = (message) => {
    const messageObject = JSON.parse(message.body)
    if (messageObject.message == null) {
      return
    }

    const owner = messageObject.sender_id == this.host.id ? this.host : this.target
    const newMessage = {
      _id: messageObject.message_id,
      text: messageObject.message,
      sent: true,
      user: {
        ...owner,
        _id: owner.id,
      },
    }

    const isFromHost = this.host.id === messageObject.sender_id
    if (isFromHost) {
      const targetMessageIndex = lodash.findIndex(this.state.messages, m => m._id === messageObject.message_id || m.user._id === messageObject.sender_id)
      let theMessages = [...this.state.messages]
      theMessages[targetMessageIndex] = newMessage

      this.setState({
        messages: theMessages
      })
    }
    else {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, newMessage)
      }))
    }

    const data = this.props.navigation.getParam("data")
    Api.instance().updateReadMessage(data.id)
  }

  onSend = (messages = []) => {
    const data = this.props.navigation.getParam("data")

    const currentTime = Math.floor(Math.random() * 10000) + 1  
    const message = {
      message_id: currentTime,
      conversation_id: data.id,
      sender_id: this.host.id,
      message: messages[0].text,
      userto_id: this.target.id,
      type: 11,
      status: 0,
    }

    const newMessage = {
      _id: currentTime,
      text: messages[0].text,
      pending: true,
      user: {
        ...this.host,
        _id: this.host.id,
      },
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessage),
    }))

    const sendMessagePath = '/app/chat/' + data.id + '/sendMessage'
    this.doSomethingWithAliveStompClient((client) => {
      client.publish({destination: sendMessagePath, body: JSON.stringify(message)});
    })
  }

  render() {
    
    return (
      <View style={{ backgroundColor: Theme.mainBackground, flex: 1 }}>
        <Header title={this.target.name} />
        <GiftedChat
          listViewProps={{
            style: {
              paddingVertical: 16,
            }
          }}
          alignTop
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            ...this.host,
            _id: this.host.id
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