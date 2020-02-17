import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import FlexSpacing from './FlexSpacing'
import DGText from '../../../components/DGText';
import Theme from '../../../res/Theme'

const Item = React.memo(({icon, title, onPress, isSelected}) => {
  return (
    <View style={{
      flex: 1,
      marginHorizontal: 4,
      opacity: isSelected ? 1 : 0.6,
      justifyContent: 'center', 
      alignItems: 'center',
    }}>
      <TouchableOpacity style={{ 
        justifyContent: 'center', 
        alignItems: 'center', 
      }} activeOpacity={0.7} onPress={onPress}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Theme.buttonPrimary
        }}>
          <Icon 
            size={32}
            color={'white'}
            name={icon}
          />
        </View>
        <DGText style={{ 
          fontSize: 9,
          color: Theme.textWhite,
          textAlign: 'center',
          marginTop: 4
        }}>{title}</DGText>
      </TouchableOpacity>
    </View>
  )
})

export default class Filter extends React.PureComponent {

  state = {
    selectedIndex: 0
  }

  componentDidMount() {
    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(this.state.selectedIndex)
    }
  }

  onFilterChanged = (index) => {
    this.setState({ selectedIndex: index })

    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(index)
    }
  }

  render() {
    return (
      <View style={{
        flexDirection: 'row',
        height: 80,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        paddingTop: 8,
        borderBottomColor: Theme.separator,
        alignItems: 'flex-start'
      }}>
        <Item 
          title="FRIENDS" 
          icon="ios-trophy" 
          isSelected={this.state.selectedIndex == 0}
          onPress={() => this.onFilterChanged(0)}
        />
        <Item 
          title="CLUB" 
          icon="ios-trophy" 
          isSelected={this.state.selectedIndex == 1}
          onPress={() => this.onFilterChanged(1)}
        />
        <Item 
          title="CHAMPIONSHIP CLUB" 
          icon="ios-trophy" 
          isSelected={this.state.selectedIndex == 2}
          onPress={() => this.onFilterChanged(2)}
        />
        <Item 
          title="CHAMPIONSHIP INDIVIDUAL" 
          icon="ios-trophy" 
          isSelected={this.state.selectedIndex == 4}
          onPress={() => this.onFilterChanged(4)}
        />
      </View>
    )
  }
}