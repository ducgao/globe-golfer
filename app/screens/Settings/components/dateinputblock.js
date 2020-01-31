import React, { PureComponent } from 'react'
import {
  View,
  Dimensions,
  StyleSheet
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import Strings from '../../../res/Strings'
import DGText from '../../../components/DGText'

export default class DateInputBlockV2 extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      date: props.initValue
    }
  }

  onDateChange = (date) => {
    this.setState({date})
    this.props.onDateChanged && this.props.onDateChanged(date)
  }

  renderTitle() {
    return <DGText style={styles.messgage}>{Strings.profile.birthDay}</DGText>
  }

  renderInput() {
    return (
      <DatePicker
        style={styles.input}
        date={this.state.date}
        customStyles={{
          dateInput: { 
            borderWidth: 0,
            alignItems: 'flex-end'
          },
          dateText: {
            color: Theme.textGray,
            fontSize: 16
          }
        }}
        mode="date"
        placeholder={Strings.tapToSelect}
        format="YYYY-MM-DD"
        minDate="1900-01-01"
        confirmBtnText={Strings.confirm}
        cancelBtnText={Strings.cancel}
        showIcon={false}
        onDateChange={this.onDateChange}
      />
    )
  }

  render() {
    return(
      <View style={[styles.container, this.props.style]}>
        {this.renderTitle()}
        {this.renderInput()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row'
  },
  input: {
    color: Theme.textWhite,
  },
  messgage: {
    flex: 1,
    color: 'white', 
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center'
  },
})