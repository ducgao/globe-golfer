import React from 'react'
import { View } from 'react-native'
import DGText from '../../../components/DGText';
import Theme from '../../../res/Theme';

export default MatchInfo = React.memo(({title}) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <DGText style={{ 
        color: Theme.textWhite,
        fontSize: 30,
        marginBottom: 12
      }}>{title ? title : "It's a Match"}</DGText>   
    </View>
  )
})  