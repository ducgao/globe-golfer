import React from 'react'
import { View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Header from './Header'
import Theme from '../../../res/Theme';
import DGText from '../../../components/DGText';
import Api from '../../../api';
import { connect } from 'react-redux'
import { getNewNotifications, getHistoryNotifications } from '../../../actions/getNotifications';

const Button = React.memo(({text, backgroundColor, onPress}) => {
  return (
    <TouchableOpacity style={{ 
      flex: 1, 
      backgroundColor,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center'
    }} activeOpacity={0.7} onPress={onPress}>
      <DGText style={{
        color: Theme.textWhite,
        fontWeight: 'bold'
      }}>{text}</DGText>
    </TouchableOpacity>
  )
})

class NotificationDetail extends React.PureComponent {
  constructor(props) {
    super(props)

    const notification = this.props.navigation.getParam("notification")

    const message = notification.message.map((m, i) => {
      return {
        _id: i,
        text: m,
        createdAt: notification.createAt,
        user: {
          _id: 4213,
          name: notification.name,
          avatar: notification.avatar,
        }
      }
    })

    this.state = {
      header: notification.name,
      messages: message
    }
  }

  reloadAndGoBack = () => {
    const tag = this.props.navigation.getParam('tag')
    this.props.getNewNotifications(tag)
    this.props.getHistoryNotifications(tag)
    this.props.navigation.goBack()
  }

  reloadAllMessage = () => {
    const tag = this.props.navigation.getParam('tag')
    this.props.getNewNotifications(tag)
    this.props.getHistoryNotifications(tag)
  }

  acceptMath = () => {
    const notification = this.props.navigation.getParam("notification")
    Api.instance().acceptChallenge(notification.challengeId).then(_ => {
      this.reloadAllMessage()
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [{
          text: "You just accept the challenge!",
          user: {
            _id: 1,
          }
        }]),
      }))
    })
  }

  declineMatch = () => {
    const notification = this.props.navigation.getParam("notification")
    Api.instance().declineChallenge(notification.challengeId).then(_ => {
      this.reloadAllMessage()
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [{
          text: "You was not accept the challenge!",
          user: {
            _id: 1,
          }
        }]),
      }))
    })
  }

  renderInput = () => {
    const notification = this.props.navigation.getParam("notification")
    if (this.state.messages.length == 1 && (notification.typeMessage == 1)) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button text="Accept" backgroundColor={Theme.buttonPrimary} onPress={this.acceptMath}/>
          <Button text="Decline" backgroundColor={Theme.buttonSecondary} onPress={this.declineMatch}/>
        </View>
      )
    }
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: Theme.mainBackground, flex: 1 }}>
        <Header title={this.state.header} />
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
            _id: 1,
          }}
          renderInputToolbar={this.renderInput}
          renderAvatarOnTop={true}
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = (dispatch) => ({
  getNewNotifications: (tag) => dispatch(getNewNotifications(tag)),
  getHistoryNotifications: (tag) => dispatch(getHistoryNotifications(tag))
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDetail)