import React from 'react'
import { View, ScrollView } from 'react-native'
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
      {card.metaData ? <CardMetaData data={card.metaData} /> : undefined} 
      <ScrollView style={{flex: 1}} >
        <View style={{flex:1}}>
        <CardBasicInfo 
          avatar={card.avatar} 
          name={card.name + " " + card.lastName[0]} 
          location={card.location} 
          rating={card.rating}
        />
        <View style={{flex: 1}}>
        {card.about ? <CardAbout about={card.about} /> : undefined}
        </View>
        <View style={{flex: 1}} />
        {withAds ? <Ads /> : null}
        </View>
      </ScrollView>
  </View>
))

export default Card