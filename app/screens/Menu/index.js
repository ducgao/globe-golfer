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
import { shareGG } from '../../utils'
import { getNewNotifications, getHistoryNotifications } from '../../actions/getNotifications'
import { getPendingMatches } from '../../actions/getPendingMatches'
import { getPlayedMatches } from '../../actions/getPlayedMatches'
import LoadableImage from '../../components/LoadableImage'
import Ads from '../../components/Ads'
import AdsRepository from '../../repository/AdsRepository'

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
    shareGG()
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

    AdsRepository.instance().loadAds()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.id) {
      OneSignal.sendTag("user_id", nextProps.user.id + "")
    }
  }

  onNotiReceived = () => {
    this.props.getNewNotifications(0)
    this.props.getHistoryNotifications(0)

    this.props.getPendingMatches()
    this.props.getPlayedMatches()
  }

  onOpened = () => {
    this.props.navigation.navigate('Notification')
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

export default connect(mapStateToProps, mapDispatchToProps)(Menu)