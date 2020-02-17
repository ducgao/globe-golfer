import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from 'react-navigation-hooks'
import FlexSpacing from './FlexSpacing'
import DGText from '../../../components/DGText';
import Theme from '../../../res/Theme'

const Badge = React.memo(({badge}) => {
  if (badge == 0 || !badge) {
    return undefined;
  }

  return (
    <View
      style={{
        width: 20, 
        height: 20,
        borderRadius: 10,
        top: -4,
        right: -4,
        position: 'absolute',
        backgroundColor: 'red'
      }}
    >
      <DGText style={{ 
        fontSize: 9,
        color: Theme.textWhite,
        textAlign: 'center',
        marginTop: 4
      }}>{badge}</DGText>
    </View>
  )
})

const Item = React.memo(({icon, title, onPress, isSelected, badge}) => {
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
        <Badge badge={badge} />
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

  setSelection(tag) {
    this.setState({
      selectedIndex: tag - 1
    })
  }

  render() {
    return (
      <View style={{
        flexDirection: 'row',
        height: 80,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        paddingTop: 12,
        borderBottomColor: Theme.separator,
        alignItems: 'flex-start'
      }}>
        <Item 
          title="MATCHS" 
          icon="ios-notifications-outline" 
          isSelected={this.state.selectedIndex == 0}
          onPress={() => this.onFilterChanged(0)}
          badge={0}
        />
        <Item 
          title="LOTTERY" 
          icon="ios-notifications-outline" 
          isSelected={this.state.selectedIndex == 1}
          onPress={() => this.onFilterChanged(1)}
          badge={0}
        />
        <Item 
          title="WINNERS" 
          icon="ios-notifications-outline" 
          isSelected={this.state.selectedIndex == 2}
          onPress={() => this.onFilterChanged(2)}
          badge={0}
        />
        <Item 
          title="GLOBEGOLFER" 
          icon="ios-notifications-outline" 
          isSelected={this.state.selectedIndex == 3}
          onPress={() => this.onFilterChanged(3)}
          badge={0}
        />
      </View>
    )
  }
}