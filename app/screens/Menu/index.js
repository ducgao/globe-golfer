import React, { PureComponent } from 'react'
import { 
  View, 
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import OneSignal from 'react-native-onesignal'

import MenuBlock from './MenuBlock'
import BaseComponent from '../../components/BaseComponent'
import { useNavigation } from 'react-navigation-hooks';
import Header from './components/Header'
import { getProfile } from '../../actions/getProfile';
import NotificationRepository from '../../repository/NotificationRepository'
import { getNewNotifications, getHistoryNotifications } from '../../actions/getNotifications'
import { getPendingMatches } from '../../actions/getPendingMatches'
import { getPlayedMatches } from '../../actions/getPlayedMatches'
import LoadableImage from '../../components/LoadableImage'
import Ads from '../../components/Ads'
import AdsRepository from '../../repository/AdsRepository'
import Api from '../../api'
import { withStomp, StompEventTypes } from 'react-stompjs'
import { BASE } from '../../api/Endpoints'
import Geolocation from '@react-native-community/geolocation';
import MessageRepository from '../../repository/MessageRepository'

import Permissions from 'react-native-permissions';

const Logo = React.memo(() => (
  <LoadableImage
    style={[
      styles.logo,
      {
        width: 120,
        height: 120,
        alignSelf: 'center'
      }
    ]}
    source={require('../../res/images/ic_icon.png')}
  />
))

const Body = React.memo(({isHidePremium}) => {

  const menuBlock = React.useRef(null)
  const { navigate } = useNavigation()

  const onRequestGoToPlay = () => {
    navigate('Play')
  }

  const onRequestGoToChallenge = () => {
    navigate('Challenge')
  }

  const onRequestGoToScores = () => {
    navigate("LeaderBoard")
  }

  const onInvitePress = () => {
    navigate("Chat", {tag: 1})
  }

  const onPremiumPress = () => {
    navigate("Premium")
  }

  return (
    <View style={styles.body}>
      <MenuBlock 
        ref={menuBlock}
        isHidePremium={isHidePremium}
        onPlayPress={onRequestGoToPlay}
        onChallengePress={onRequestGoToChallenge}
        onScoresPress={onRequestGoToScores}
        onInvitePress={onInvitePress}
        onPremiumPress={onPremiumPress}
      />
    </View>
  )
})

class Menu extends PureComponent {

  constructor(props) {
    super(props)

    OneSignal.init("316ed61c-0349-4eaf-aa5c-634a7bfad659");
    OneSignal.inFocusDisplaying(2)
    OneSignal.addEventListener('received', this.onNotiReceived);
    OneSignal.addEventListener('opened', this.onOpened);
  }

  componentDidMount() {
    this.props.getProfile()
    this.configChatService()

    Api.instance().getNewNotifications(0).then(res => {
      NotificationRepository.instance().updateNotifications(res)
    })

    AdsRepository.instance().loadAds()

    Permissions.check("location").then(r => {
      if (r !== "authorized") {
        Permissions.request("location").then(rs => {
          if (rs !== "authorized") {
            alert("Golf Global cannot run without location service. Please go to setting and enable location service to have a best experience")
          }
        })  
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.id) {
      OneSignal.sendTag("user_id", nextProps.user.id + "")

      MessageRepository.instance().setUserId(nextProps.user.id)
      Api.instance().getMessages(0).then(res => {
        MessageRepository.instance().updateMessages(res)
      })

      Geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude
        const long = pos.coords.longitude
        
        Api.instance().updateLocation(nextProps.user.id + "", lat, long)
        // Api.instance().updateLocation(nextProps.user.id + "", 10.7781159, 106.70058)
      }, undefined, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      })
    }
  }

  configChatService = () => {
    const token = Api.instance().getAccessToken()

    this.props.stompContext.addStompEventListener(StompEventTypes.Connect, this.onConnected)
    this.props.stompContext.addStompEventListener(StompEventTypes.Disconnect, this.onDisconnected)
    this.props.stompContext.addStompEventListener(StompEventTypes.WebSocketClose, this.onClose)

    this.props.stompContext.newStompClient(
      BASE + "ws?access_token=" + token,
      null,
      null,
      "/"
    )
  }

  onConnected = () => {}

  onDisconnected = () => {
    this.props.stompContext.newStompClient(
      BASE + "ws?access_token=" + token,
      null,
      null,
      "/"
    )
  }

  onClose = () => {
    this.props.stompContext.removeStompClient()
  }

  onNotiReceived = () => {
    this.props.getNewNotifications(0)
    this.props.getHistoryNotifications(0)

    this.props.getPendingMatches()
    this.props.getPlayedMatches()
  }

  onOpened = (openResult) => {
    const notification = openResult.notification
    const payload = notification.payload
    const data = payload.rawPayload.custom.a

    if (data.type === "1") {
      this.props.navigation.navigate('NewMatch', {data})  
    }
    else if (data.type === "8") {
      this.props.navigation.navigate('Chat')  
    }
    else {
      this.props.navigation.navigate('Notification')  
    }
  }

  render() {
    return (
      <BaseComponent withDotBackground={true}>
        <Header />
        <Logo />
        <Body isHidePremium={this.props.user && this.props.user.isPremium} />
        <Ads withLottery={true} />
      </BaseComponent>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  logo: {
    height: '30%'
  },
  controllerBlock: {
    width: "30%",
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  controller: {
    width: 50,
    height: 50,
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => ({
  user: state.profile.user
})

const mapDispatchToProps = (dispatch) => ({
  getProfile: () => dispatch(getProfile()),
  getNewNotifications: (tag) => dispatch(getNewNotifications(tag)),
  getHistoryNotifications: (tag) => dispatch(getHistoryNotifications(tag)),
  getPendingMatches: () => dispatch(getPendingMatches()),
  getPlayedMatches: () => dispatch(getPlayedMatches())
})

export default withStomp(connect(mapStateToProps, mapDispatchToProps)(Menu))