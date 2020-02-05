import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import BaseComponent from '../../components/BaseComponent'
import DGButtonV2 from '../../components/DGButtonV2'

import Theme from '../../res/Theme'

import LoadingModal from '../../components/LoadingModal'
import DGText from '../../components/DGText'

import { connect } from 'react-redux'
import lodash from 'lodash'
import Api from '../../api'
import LoadableImage from '../../components/LoadableImage'

class NewMatch extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    loading: false
  }

  requestChatWithHim = () => {
    const conversation = this.props.navigation.getParam('conversation')
    const notification = this.props.navigation.getParam('notification')

    if (conversation) {
      this.props.navigation.navigate("ChatDetail", {
        data: conversation,
        tag: 0
      })
    }
    else {
      Api.instance().createConversation(notification.playerId).then(_ => {
        Api.instance().getMessages(0).then(res => {
          const conversation = lodash.find(res, (item) => item.avatar == notification.avatar)
          this.props.navigation.navigate("ChatDetail", {
            data: conversation,
            tag: 0
          })
        })
      })
    }
  }

  renderCTABlock() {
    return (
      <DGButtonV2 
        style={{ backgroundColor: Theme.buttonPrimary, width: '50%' }}
        text={"Chat"}
        onPress={this.requestChatWithHim}
        />
    )
  }

  render() {
    const notification = this.props.navigation.getParam('notification')

    const user = this.props.user
    const anotherUserAvatar = notification.avatar
    
    return (
      <BaseComponent toolbar={{
        title: "",
        onBack: this.props.navigation.goBack,
      }}>
        <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 44 }}>
          <React.Fragment>
            <DGText style={{
              width: '100%',
              color: Theme.buttonPrimary,
              fontSize: 40,
              textAlign: 'center'
            }}>{"It's a match!"}</DGText>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 16, 
              marginTop: 50
            }}>
              <LoadableImage 
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                }}
                source={{uri: user.avatar}}
              />
              <DGText style={{
                color: 'white',
                fontSize: 24,
                textAlign: 'center',
                marginHorizontal: 16
              }}>{"VS"}</DGText>
              <LoadableImage 
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                }}
                source={{uri: anotherUserAvatar}}
              />
            </View>
            <DGText style={{
              width: '100%',
              color: 'white',
              fontSize: 20,
              textAlign: 'center',
              marginVertical: 50,
            }}>{"You can now send him a message to organize your match play"}</DGText>
            {this.renderCTABlock()}
          </React.Fragment>
        </KeyboardAwareScrollView>
        <LoadingModal visible={this.state.loading} />
      </BaseComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.profile.user,
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(NewMatch)