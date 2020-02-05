import React from 'react'
import { View, SafeAreaView, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Header from './Header'
import Theme from '../../../res/Theme';
import DGText from '../../../components/DGText';
import Api from '../../../api';
import lodash from 'lodash'
import { connect } from 'react-redux'
import { getNewNotifications, getHistoryNotifications } from '../../../actions/getNotifications';
import LoadingModal from '../../../components/LoadingModal';
import { getPendingMatches } from '../../../actions/getPendingMatches';
import { getPlayedMatches } from '../../../actions/getPlayedMatches';

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
        text: m.trim(),
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
      messages: message,
      loading: false,
      showBottom: true
    }
  }

  componentDidMount() {
    const notification = this.props.navigation.getParam("notification")
    const tag = this.props.navigation.getParam('tag')
    Api.instance().updateNotificationStatus(notification.id).then(_ => {
      this.props.getNewNotifications(tag)
      this.props.getHistoryNotifications(tag)
    })
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
    this.setState({
      loading: true
    })

    const notification = this.props.navigation.getParam("notification")
    Api.instance().acceptChallenge(notification.challengeId).then(_ => {
      this.reloadAllMessage()
      
      this.props.getPendingMatches()
      this.props.getPlayedMatches()

      this.setState(previousState => ({
        loading: false,
        showBottom: false,
        messages: GiftedChat.append(previousState.messages, [{
          text: "You just accept the challenge!",
          user: {
            _id: 1,
          }
        }]),
      }), () => {
        const notification = this.props.navigation.getParam("notification")
        const conversation = lodash.find(this.props.messagesData.data, (item) => item.avatar == notification.avatar)
        
        this.props.navigation.navigate("MatchAccepted", {
          notification,
          chatData: {
            conversation,
            notification
          }  
        })
      })

    })
  }

  declineMatch = () => {
    this.setState({
      loading: true
    })

    const notification = this.props.navigation.getParam("notification")
    Api.instance().declineChallenge(notification.challengeId).then(_ => {
      this.reloadAllMessage()
      this.setState(previousState => ({
        loading: false,
        showBottom: false,
        messages: GiftedChat.append(previousState.messages, [{
          text: "You was not accept the challenge!",
          user: {
            _id: 1,
          }
        }]),
      }))
    })
  }

  viewMatchResult = () => {
    this.setState({
      loading: true
    })

    const notification = this.props.navigation.getParam("notification")
    Api.instance().simpleViewMatchResult(notification.scheduleId).then(data => {
      this.setState({
        loading: false
      }, () => {
        this.props.navigation.navigate("ResultSimple", {data})
      })
    })
  }

  acceptMatchResult = () => {
    this.setState({
      loading: true
    })
    
    const notification = this.props.navigation.getParam("notification")
    Api.instance().acceptMatchResult(notification.scheduleId).then(_ => {
      this.props.getPendingMatches()
      this.props.getPlayedMatches()

      this.setState(previousState => ({
        loading: false,
        showBottom: false,
        messages: GiftedChat.append(previousState.messages, [{
          text: "You just accept the result!",
          user: {
            _id: 1,
          }
        }]),
      }))
    })
  }

  renderInput = () => {
    if (this.state.showBottom == false) {
      return null
    }
    
    const notification = this.props.navigation.getParam("notification")
    if (this.state.messages.length == 1 && notification.typeMessage == 1) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button text="Accept" backgroundColor={Theme.buttonPrimary} onPress={this.acceptMath}/>
          <Button text="Decline" backgroundColor={Theme.buttonSecondary} onPress={this.declineMatch}/>
        </View>
      )
    }

    if (notification.typeMessage == 26) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button text="View Result" backgroundColor={Theme.buttonPrimary} onPress={this.viewMatchResult}/>
          <Button text="Accept" backgroundColor={Theme.buttonSecondary} onPress={this.acceptMatchResult}/>
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
        <LoadingModal visible={this.state.loading} />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  messagesData: state.messages,
})

const mapDispatchToProps = (dispatch) => ({
  getNewNotifications: (tag) => dispatch(getNewNotifications(tag)),
  getHistoryNotifications: (tag) => dispatch(getHistoryNotifications(tag)),
  getPendingMatches: () => dispatch(getPendingMatches()),
  getPlayedMatches: () => dispatch(getPlayedMatches())
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDetail)