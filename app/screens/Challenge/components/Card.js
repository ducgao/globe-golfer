import React from 'react'
import { View, ScrollView} from 'react-native'
import CardMetaData from './CardMetaData';
import CardBasicInfo from './CardBasicInfo.tindermode';
import CardAbout from './CardAbout';
import Ads from '../../../components/Ads';

const Card = React.memo(({withAds, card}) => (
  <View style={{
    flex: 1,
    marginTop: -48,
    marginBottom: 92,
    backgroundColor: 'black'
  }}>
      <ScrollView style={{flex: 1}}>
      <CardMetaData data={card.metaData} />
      <CardBasicInfo avatar={card.avatar} name={card.name} location={card.location} rating={card.rating}/>
      {card.about ? <CardAbout about={card.about} /> : null}
      <View style={{flex: 1}} />
      {withAds ? <Ads /> : null}
      </ScrollView>
  </View>
))

export default Card