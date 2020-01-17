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

class Lottery extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      id: null,
      endTime: null
    }
  }
  

  // componentDidMount() {
  //   Api.instance().getLottery().then(res => {
  //     if (res) {
  //       const et = moment(res.end)
  //       const cu = moment(new Date())
  
  //       const endTime = et.diff(cu)
  //       this.setState({
  //         id: res.id,
  //         endTime: parseInt(endTime) / 1000
  //       })
  //       this.props.visibleChanged && this.props.visibleChanged()
  //       this.startTimer()
  //     }
  //   })  
  // }

  componentDidMount() {
    Api.instance().getLottery().then(res => {
      if (res) {
        let now = new Date();
       let current= new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())
        const et = moment(res.end)
        const cu = moment(current);
        
        const endTime = et.diff(cu)
        console.warn('Endtime:'+cu);
        
        this.setState({
          id: res.id,
          endTime: parseInt(endTime) 
        })
        this.props.visibleChanged && this.props.visibleChanged()
       
        this.startTimer()
      }
    })  
  }

  startTimer() {
    setInterval(() => {
      this.setState({
        endTime: this.state.endTime - 1000
      })
    }, 1000)
  }


  // secondToCountDown(t) {
  //   const s = this.makeUpTimeValue(Math.floor(t % 60));
  //   const m = this.makeUpTimeValue(Math.floor((t/60) % 60));
  //   const h = this.makeUpTimeValue(Math.floor((t/(60*60)) % 24));

  //   return `${h}:${m}:${s}`
  // } 

  secondToCountDown(t) {
    const time = (t /1000) /3600;
    const roundTime = time - parseInt(time) ;
    
    const roundTimeM = roundTime * 60 - parseInt(roundTime * 60) ;
    
    
    const m =this.makeUpTimeValue(parseInt(roundTime*60)) ;
    const s = this.makeUpTimeValue(parseInt(roundTimeM *60));
    const h =this.makeUpTimeValue(parseInt(time));
    // const s = this.makeUpTimeValue(Math.floor(t * 60));
    // const m = this.makeUpTimeValue(Math.floor((t/60) * 60));
    // const h = this.makeUpTimeValue(Math.floor((t/(60*60)) % 24));
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
    if (this.state.endTime == null || this.state.endTime < 0) return null
    
    return (
      <TouchableWithoutFeedback style={{
        width: 100,
        height: 100,
      }} onPress={this.onItemPress}>
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderColor: Theme.buttonPrimary,
          borderWidth: 4,
          alignItems: 'center'
        }}>
          <DGText style={{
            color: Theme.buttonPrimary,
            fontSize: 24,
            marginTop: 16,
          }}>Lottle</DGText>
          <DGText style={{
            color: 'white',
            fontSize: 16,
            marginTop: 4
          }}>{this.secondToCountDown(this.state.endTime)}</DGText>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default React.memo(({withLottery}) => {

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
      lottery = <Lottery visibleChanged={() => setIsLotteryShown(true)} onPress={onLotteryPress}/>
    }

    if (ads) {
      adsView = (
        <>
        {withLottery && isLotteryShown ? <View style={{width: 24}} /> : undefined}
        <TouchableWithoutFeedback style={{
          width: 100,
          height: 100,
          borderRadius: 50
        }} onPress={() => {ads && Linking.openURL(ads.link)}} >
          <LoadableImage
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
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
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center'
  },
})