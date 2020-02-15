import React from 'react'
import {View, TouchableOpacity, Alert, Image} from 'react-native'
import Header from '../comps/Header'
import BaseComponent from '../../../../components/BaseComponent'
import Theme from '../../../../res/Theme'
import DGText from '../../../../components/DGText'
import Api from '../../../../api'
import LoadableImage from '../../../../components/LoadableImage'
import CardRatingBar from '../../../Challenge/components/CardRatingBar'
import SelectItem from '../comps/CircleButton'

export default class Rating extends React.Component {

  state = {
    currentStar: 5
  }

  requestRate = () => {
    const id = this.props.navigation.getParam("id")

    Api.instance().ratingSomeone(id, this.state.currentStar).then(() => {
      this.props.navigation.popToTop()
    })
  }

  render() {
    const name = this.props.navigation.getParam("name")
    const lastName = this.props.navigation.getParam("lastName")
    const avatar = this.props.navigation.getParam("avatar")
    return (
      <BaseComponent toolbar={{
        title: "Rating",
        onBack: () => this.props.navigation.popToTop()
      }}>
        <LoadableImage 
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            alignSelf: 'center',
            marginTop: 32
          }}
          resizeMethod='resize'
          resizeMode='cover'
          source={{uri: avatar}}
        />
        <DGText style={{
          marginTop: 24 + 32,
          marginBottom: 40,
          fontSize: 24,
          color: 'white',
          textAlign: 'center',
          alignSelf: 'center'
        }}>{[name, lastName].join(" ")}</DGText>
        <CardRatingBar 
          star={this.state.currentStar} 
          big 
          onRatingChanged={(s) => this.setState({currentStar: s})} />
        <View style={{
          width: '60%',
          alignSelf: 'center',
          marginTop: 24
        }}>
          <SelectItem
            value={"Rate"} 
            tint={Theme.buttonPrimary} 
            onPress={this.requestRate}
          />
        </View>
      </BaseComponent>
    )
  }
}