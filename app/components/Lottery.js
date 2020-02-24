import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
} from 'react-native'
import DGText from './DGText';
import Api from '../api';
import moment from 'moment';
import Theme from '../res/Theme';

export default class Lottery extends React.PureComponent {

  isRunning = false
  intervalId = undefined

  theLogoSize = 70

  constructor(props) {
    super(props);
    
    this.state = {
      id: null,
      endTime: null
    }

    if (props.customLogoSize) {
      this.theLogoSize = props.customLogoSize
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
        this.props.visibleChanged && this.props.visibleChanged(true)
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
    const h = this.makeUpTimeValue(Math.floor((t/(60*60))));

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
      this.props.visibleChanged && this.props.visibleChanged(false)
      return null
    }
    
    return (
      <TouchableWithoutFeedback style={{
        width: this.theLogoSize,
        height: this.theLogoSize,
      }} onPress={this.onItemPress}>
        <View style={{
          width: this.theLogoSize,
          height: this.theLogoSize,
          borderRadius: this.theLogoSize/2,
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