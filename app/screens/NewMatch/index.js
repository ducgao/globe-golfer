import React, { PureComponent } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import BaseComponent from '../../components/BaseComponent'
import DGButtonV2 from '../../components/DGButtonV2'

import Theme from '../../res/Theme'

import LoadingModal from '../../components/LoadingModal'
import Card from '../Challenge/components/Card'
import { GET_AVATAR } from '../../api/Endpoints'
import DGText from '../../components/DGText'

import { connect } from 'react-redux'
import lodash from 'lodash'
import Api from '../../api'
import { getMessages } from '../../actions/getMessages'
import { getNewNotifications, getHistoryNotifications } from '../../actions/getNotifications'
import { getPendingMatches } from '../../actions/getPendingMatches'
import { getPlayedMatches } from '../../actions/getPlayedMatches'

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

class NewMatch extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    loading: true
  }

  componentDidMount() {
    this.props.getNewNotifications(0)
    this.props.getHistoryNotifications(0)
  }

  componentWillReceiveProps(nextProps) {
    if (Array.isArray(nextProps.newNotificationsData.data) && nextProps.newNotificationsData.data.length > 0) {
      this.setState({
        loading: false    
      })
    }
  }

  requestChatWithHim = () => {
    const user = this.props.navigation.getParam('data').userFromProfile

    const conversation = lodash.find(this.props.newNotificationsData.data, (item) => item.avatar.indexOf(user.avatar) >= 0)

    this.props.navigation.navigate("NotificationDetail", { notification: conversation, tag: 0 })
  }

  requestAcceptMatch = () => {
    this.setState({
      loading: true
    })

    const user = this.props.navigation.getParam('data').userFromProfile
    const notification = lodash.find(this.props.newNotificationsData.data, (item) => item.avatar.indexOf(user.avatar) >= 0)

    Api.instance().acceptChallenge(notification.challengeId).then(_ => {
      this.props.getPendingMatches()
      this.props.getPlayedMatches()

      this.setState({
        loading: false,
      }, () => {
        const conversation = lodash.find(this.props.messagesData.data, (item) => item.avatar == notification.avatar)
        this.props.navigation.replace("MatchAccepted", {
          notification,
          chatData: {
            conversation,
            notification
          }  
        })
      })
    })
  }

  requestDeclineMatch = () => {
    this.setState({
      loading: true
    })

    const user = this.props.navigation.getParam('data').userFromProfile
    const notification = lodash.find(this.props.newNotificationsData.data, (item) => item.avatar.indexOf(user.avatar) >= 0)

    Api.instance().declineChallenge(notification.challengeId).then(_ => {
      this.setState({
        loading: false,
      }, () => {
        this.props.navigation.goBack()
      })
    })
  }

  renderCTABlock() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Button text="Accept" backgroundColor={Theme.buttonPrimary} onPress={this.requestAcceptMatch}/>
        <Button text="Decline" backgroundColor={Theme.buttonSecondary} onPress={this.requestDeclineMatch}/>
      </View>
    )
  }

  render() {
    const user = this.props.navigation.getParam('data').userFromProfile
  
    return (
      <BaseComponent toolbar={{
        title: "",
        onBack: this.props.navigation.goBack,
      }}>
        <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 44 }}>
          {user ? [
            <DGText style={{
              width: '100%',
              color: Theme.buttonPrimary,
              fontSize: 40,
              textAlign: 'center'
            }}>Challenge!</DGText>,
            <View style={{marginHorizontal: 16, marginTop: 50}}>
              <Card withAds={false} card={{
                location: user.golfCourseName,
                avatar: GET_AVATAR.replace("{id}", user.avatar),
                about: user.about,
                rating: user.rate,
                name: user.firstname,
                lastName: user.lastname,
              }}/>
            </View>,
            this.renderCTABlock()
          ] : null}
        </KeyboardAwareScrollView>
        <LoadingModal visible={this.state.loading} />
      </BaseComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  messagesData: state.messages,
  newNotificationsData: state.notifications.new,
  historyNotificationsData: state.notifications.history,
})

const mapDispatchToProps = (dispatch) => ({
  getNewNotifications: (tag) => dispatch(getNewNotifications(tag)),
  getHistoryNotifications: (tag) => dispatch(getHistoryNotifications(tag)),
  getPendingMatches: () => dispatch(getPendingMatches()),
  getPlayedMatches: () => dispatch(getPlayedMatches())
})

export default connect(mapStateToProps, mapDispatchToProps)(NewMatch)