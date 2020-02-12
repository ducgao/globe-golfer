import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Linking,
  StyleSheet
} from 'react-native'
import LoadableImage from './LoadableImage';
import { VIEW_ADS } from '../api/Endpoints';
import AdsRepository from '../repository/AdsRepository';
import { useNavigation } from 'react-navigation-hooks';
import Theme from '../res/Theme';
import Lottery from './Lottery';

export default React.memo(({withLottery, customLogoSize}) => {

  let theLogoSize = 70
  if (customLogoSize) {
    theLogoSize = customLogoSize
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
      lottery = <Lottery 
        visibleChanged={(visible) => setIsLotteryShown(visible)} 
        onPress={onLotteryPress} 
        customLogoSize={customLogoSize} 
      />
    }

    if (ads) {
      adsView = (
        <>
        {withLottery && isLotteryShown ? <View style={{width: 24}} /> : undefined}
        <TouchableWithoutFeedback 
          style={{
            width: theLogoSize,
            height: theLogoSize,
            borderRadius: theLogoSize/2
          }} 
          onPress={() => {
            ads.link && Linking.openURL(ads.link)
          }}>
          <LoadableImage
            style={{
              width: theLogoSize,
              height: theLogoSize,
              borderRadius: theLogoSize/2,
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
    <View style={[styles.ads, {
      height: theLogoSize + 16 * 2
    }]}>
        {renderContent()}    
    </View>
  )
})

const styles = StyleSheet.create({
  ads: {
    justifyContent: 'center',
    alignItems: 'center'
  },
})