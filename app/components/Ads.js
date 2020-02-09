import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Linking,
  StyleSheet
} from 'react-native'
import DGText from './DGText';
import LoadableImage from './LoadableImage';
import { VIEW_ADS } from '../api/Endpoints';
import AdsRepository from '../repository/AdsRepository';
import Api from '../api';
import moment from 'moment';
import { useNavigation } from 'react-navigation-hooks';
import Theme from '../res/Theme';

let THE_LOGO_SIZE = 70

class Lottery extends React.PureComponent {

  isRunning = false
  intervalId = undefined

  constructor(props) {
    super(props);
    
    this.state = {
      id: null,
      endTime: null
    }
  }
  
  componentDidMount() {
    this.fetchLottery()
  }

  fetchLottery = (timeout = 0) => {
    if (timeout == 0) {
      this.doFetchLottery()
    }
    else {
      setTimeout(this.doFetchLottery, timeout)
    }
  }

  doFetchLottery = () => {
    Api.instance().getLottery().then(res => {
      if (res) {
        const et = moment(res.end)
        const cu = moment(new Date())
  
        const endTime = et.diff(cu)
        this.setState({
          id: res.id,
          endTime: parseInt(endTime) / 1000
        })
        this.props.visibleChanged && this.props.visibleChanged()
        this.startTimer()
      }
    })  
  }

  startTimer() {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    this.intervalId = setInterval(() => {
      const newET = this.state.endTime - 1

      if (newET < 0) {
        clearInterval(this.intervalId)
        this.fetchLottery(3000)
      }

      this.setState({
        endTime: newET
      })
    }, 1000)
  }

  secondToCountDown(t) {
    const s = this.makeUpTimeValue(Math.floor(t % 60));
    const m = this.makeUpTimeValue(Math.floor((t/60) % 60));
    const h = this.makeUpTimeValue(Math.floor((t/(60*60)) % 24));

    return `${h}:${m}:${s}`
  } 

  makeUpTimeValue(v) {
    if (v < 10) {
      return `0${v}`
    }

    return v
  }

  onItemPress = () => {
    this.props.onPress && this.props.onPress(this.state.id)
  }

  render() {
    if (this.state.endTime == null || this.state.endTime < 0) {
      this.isRunning = false
      return null
    }
    
    return (
      <TouchableWithoutFeedback style={{
        width: THE_LOGO_SIZE,
        height: THE_LOGO_SIZE,
      }} onPress={this.onItemPress}>
        <View style={{
          width: THE_LOGO_SIZE,
          height: THE_LOGO_SIZE,
          borderRadius: THE_LOGO_SIZE/2,
          borderColor: Theme.buttonPrimary,
          borderWidth: 4,
          alignItems: 'center'
        }}>
          <DGText style={{
            color: Theme.buttonPrimary,
            fontSize: this.props.customLogoSize ? 24 : 16,
            marginTop: 16,
          }}>Lottle</DGText>
          <DGText style={{
            color: 'white',
            fontSize: this.props.customLogoSize ? 16 : 10,
            marginTop: 4
          }}>{this.secondToCountDown(this.state.endTime)}</DGText>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default React.memo(({withLottery, customLogoSize}) => {

  if (customLogoSize) {
    THE_LOGO_SIZE = customLogoSize
  }
  else {
    THE_LOGO_SIZE = 70
  }

  const [ads, setAds] = React.useState(null)
  const [isLotteryShown, setIsLotteryShown] = React.useState(false)

  const {navigate} = useNavigation()

  const onLotteryPress = React.useCallback((id) => {
    navigate("LotteryList", {id})
  }, [])

  const renderContent = () => {
    let lottery = undefined
    let adsView = undefined

    if (withLottery) {
      lottery = <Lottery visibleChanged={() => setIsLotteryShown(true)} onPress={onLotteryPress} customLogoSize={customLogoSize} />
    }

    if (ads) {
      adsView = (
        <>
        {withLottery && isLotteryShown ? <View style={{width: 24}} /> : undefined}
        <TouchableWithoutFeedback style={{
          width: THE_LOGO_SIZE,
          height: THE_LOGO_SIZE,
          borderRadius: THE_LOGO_SIZE/2
        }} onPress={() => {ads && Linking.openURL(ads.link)}} >
          <LoadableImage
            style={{
              width: THE_LOGO_SIZE,
              height: THE_LOGO_SIZE,
              borderRadius: THE_LOGO_SIZE/2,
              backgroundColor: Theme.buttonPrimary
            }}
            resizeMethod='resize'
            resizeMode='cover'
            source={{uri: VIEW_ADS.replace("{image}", ads.image)}}
          />
        </TouchableWithoutFeedback>
        </>
      )
    }

    return (
      <View style={{flexDirection: 'row'}}>
        {lottery}
        {adsView}
      </View>
    )
  }

  React.useEffect(() => {
    const onAdsChanged = (ads) => {
      setAds(ads)
    }

    AdsRepository.instance().subscribe(onAdsChanged)

    return () => {
      AdsRepository.instance().unSubscribe(onAdsChanged)
    }
  }, [])

  return (
    <View style={styles.ads}>
        {renderContent()}    
    </View>
  )
})

const styles = StyleSheet.create({
  ads: {
    height: THE_LOGO_SIZE + 16 * 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
})