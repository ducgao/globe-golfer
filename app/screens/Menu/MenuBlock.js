import React, { PureComponent } from 'react'
import { 
  View, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import DGText from '../../components/DGText'
import Theme from '../../res/Theme';
import LoadableImage from '../../components/LoadableImage';

const DotPagination = React.memo(({dotsLength, activeSlide}) => {
  return (
    <Pagination
      dotsLength={dotsLength}
      activeDotIndex={activeSlide || 0}
      containerStyle={{ 
        position: 'absolute',
        alignSelf: 'center',
        bottom: -8,
      }}
      dotStyle={{
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Theme.buttonPrimary,
        marginHorizontal: -12
      }}
      inactiveDotStyle={{
        backgroundColor: 'white'
      }}
      inactiveDotOpacity={1}
      inactiveDotScale={1}
    />
  )
})

export default class MenuBlock extends PureComponent {

  state = {
    activeSlide: 2
  }

  data = []

  constructor(props) {
    super(props)

    this.data = [
      {
        name: "Friends",
        onPress: props.onInvitePress
      },
      {
        name: "Play",
        onPress: props.onPlayPress
      },
      {
        name: "Challenge",
        onPress: props.onChallengePress
      },
      {
        name: "Ranking",
        onPress: props.onScoresPress
      } 
    ]

    if (props.isHidePremium == false) {
      this.data.push({
        name: "Premium",
        onPress: props.onPremiumPress
      })
    }
  }

  renderMenuItem(item) {

    const activeObject = this.data[this.state.activeSlide]

    let iconSource = null
    let isActive = item.name == activeObject.name

    switch (item.name) {
      case "Challenge":
        iconSource = require('../../res/images/ic_global_1.png')
        break;
      case "Invite a Friend":
        iconSource = require('../../res/images/ic_global_2.png')
        break;
      case "Play":
        iconSource = require('../../res/images/ic_global_3.png')
        break;
      case "Ranking":
        iconSource = require('../../res/images/ic_global_4.png')
        break;
      case "Premium":
        iconSource = require('../../res/images/ic_global_1.png')
        break;
      case "Friends":
        iconSource = require('../../res/images/ic_global_1.png')
        break;
      default:
        iconSource = require('../../res/images/ic_global.png')
        break;
    }

    return (
      <TouchableOpacity style={{ 
        width: itemWidth,
        height: itemWidth,
        justifyContent: 'center',
      }} activeOpacity={0.7} onPress={item.onPress}>
        <LoadableImage
          style={{
            position: 'absolute',
            width: itemWidth,
            height: itemWidth,
            tintColor: isActive ? '#FFFFFF' : null
          }}
          resizeMethod='resize'
          resizeMode='contain'
          source={iconSource}
        />
        <DGText style={{ 
          color: "white", 
          alignSelf: 'center',
          fontSize: 30,
          fontWeight: 'bold',
          textAlign: 'center',
          color: Theme.buttonPrimary,
          backgroundColor: 'black',
          paddingHorizontal: 12,
          borderRadius: 16,
        }}>{item.name}</DGText>
      </TouchableOpacity>
    )
  }
    
  renderItem = ({item}) => {
    return this.renderMenuItem(item)
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Carousel
          ref={(c) => { this.carousel = c; }}
          data={this.data}
          contentContainerCustomStyle={{ justifyContent: 'center', alignItems: 'center' }}
          renderItem={this.renderItem}
          sliderWidth={windowWidth}
          sliderHeight={itemWidth}
          itemWidth={itemWidth}
          itemHeight={itemWidth}
          loop={true}
          firstItem={2}
          inactiveSlideScale={0.6}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
        />
        <DotPagination dotsLength={this.data.length} activeSlide={this.state.activeSlide}/>
      </View>
    )
  }
}

const windowWidth = Dimensions.get('window').width
const itemWidth = windowWidth * 0.5
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    justifyContent: 'center'
  }
})