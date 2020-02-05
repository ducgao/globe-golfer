import React, { PureComponent } from 'react'
import { View } from 'react-native'
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

class NewMatch extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    loading: false
  }

  requestChatWithHim = () => {
    const user = this.props.navigation.getParam('data').userFromProfile

    const conversation = lodash.find(this.props.newNotificationsData.data, (item) => item.avatar.indexOf(user.avatar) >= 0)

    this.props.navigation.navigate("NotificationDetail", { notification: conversation, tag: 0 })
  }

  renderCTABlock() {
    return (
      <DGButtonV2 
        style={{ backgroundColor: Theme.buttonPrimary, width: '50%' }}
        text={"View"}
        onPress={this.requestChatWithHim}
        />
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
  newNotificationsData: state.notifications.new,
  historyNotificationsData: state.notifications.history,
})

const mapDispatchToProps = (dispatch) => ({
  getNewNotifications: (tag) => dispatch(getNewNotifications(tag)),
  getHistoryNotifications: (tag) => dispatch(getHistoryNotifications(tag))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewMatch)