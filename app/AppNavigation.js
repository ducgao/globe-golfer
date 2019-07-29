import React from 'react'
import {
  View,
  Image
} from 'react-native'
import Authentication from './screens/Authentication'

import Login from './screens/Authentication/Login'
import LoginWithEmail from './screens/Authentication/LoginWithEmail'
import Register from './screens/Authentication/Register'
import SetupAccount from './screens/Authentication/SetupAccount'
import SetupAccountStepInputIndex from './screens/Authentication/SetupAccountStepInputIndex'
import SetupAccountStepInputName from './screens/Authentication/SetupAccountStepInputName'
import SetupAccountStepInputBirthday from './screens/Authentication/SetupAccountStepInputBirthday'
import SetupAccountStepInputGender from './screens/Authentication/SetupAccountStepInputGender'
import SetupAccountStepInputLocation from './screens/Authentication/SetupAccountStepInputLocation'
import SetupAccountStepInputScannedCard from './screens/Authentication/SetupAccountStepInputScannedCard'
import SetupAccountStepInputAvatar from './screens/Authentication/SetupAccountStepInputAvatar'
import SetupAccountStepActiveLocation from './screens/Authentication/SetupAccountStepActiveLocation'
import SetupAccountStepInputEmail from './screens/Authentication/SetupAccountStepInputEmail'
import SetupAccountStepFinal from './screens/Authentication/SetupAccountStepFinal'

import Settings from './screens/Settings'

import Challenge from './screens/Challenge'

import VeryFirstScreen from './screens/VeryFirst'

import Chat from './screens/Chat'
import Notification from './screens/Notification'
import Menu from './screens/Menu'
import LeaderBoard from './screens/LeaderBoard'
import Profile from './screens/Profile'

import Theme from './res/Theme'

import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation"

const iconStyle = {
  alignSelf: 'center',
  width: 44,
  height: 44
}

const TabBarIcon = React.memo(({selectedIcon, unselectedIcon, isSelected}) => {
  return (
    <View style={{ height: 56, width: 56, justifyContent: 'center' }}>
      <Image
        style={iconStyle}
        source={isSelected ? selectedIcon : unselectedIcon}
      />
    </View>
  )
})

const loginNavigator = {
  Login: { screen: Login },
  LoginWithEmail: { screen: LoginWithEmail }
}

const Play = createStackNavigator({
  Menu,
  Challenge
}, {
  headerMode: 'none'
})

const Main = createBottomTabNavigator({
  Chat: {
    screen: Chat,
    navigationOptions: {
      tabBarIcon: props => (
        <TabBarIcon 
          isSelected={props.focused} 
          selectedIcon={require('@images/ic_chat_selected.png')} 
          unselectedIcon={require('@images/ic_chat.png')}
        />
      )
    }
  },
  Notification: {
    screen: Notification,
    navigationOptions: {
      tabBarIcon: props => (
        <TabBarIcon 
          isSelected={props.focused} 
          selectedIcon={require('@images/ic_bell_selected.png')} 
          unselectedIcon={require('@images/ic_bell.png')}
        />
      )
    }
  }, 
  Play: {
    screen: Play,
    navigationOptions: {
      tabBarIcon: props => (
        <TabBarIcon 
          isSelected={props.focused} 
          selectedIcon={require('@images/ic_play_selected.png')} 
          unselectedIcon={require('@images/ic_play.png')}
        />
      )
    }
  }, 
  LeaderBoard: {
    screen: LeaderBoard,
    navigationOptions: {
      tabBarIcon: props => (
        <TabBarIcon 
          isSelected={props.focused} 
          selectedIcon={require('@images/ic_leaderboard_selected.png')} 
          unselectedIcon={require('@images/ic_leaderboard.png')}
        />
      )
    }
  }, 
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarIcon: props => (
        <TabBarIcon 
          isSelected={props.focused} 
          selectedIcon={require('@images/ic_profile_selected.png')} 
          unselectedIcon={require('@images/ic_profile.png')}
        />
      )
    }
  }
}, {  
  initialRouteName: 'Play',
  tabBarOptions: {
  showIcon: true,
  showLabel: false,
  style: { backgroundColor: Theme.tabBarBackground, height: 60 }
}})

const setupAccountNavigator = {
  Register: { screen: Register },
  SetupAccount: { screen: SetupAccount },
  SetupAccountStepInputIndex: { screen: SetupAccountStepInputIndex },
  SetupAccountStepInputName: { screen: SetupAccountStepInputName },
  SetupAccountStepInputBirthday: { screen: SetupAccountStepInputBirthday },
  SetupAccountStepInputGender: { screen: SetupAccountStepInputGender },
  SetupAccountStepInputLocation: { screen: SetupAccountStepInputLocation },
  SetupAccountStepInputScannedCard: { screen: SetupAccountStepInputScannedCard },
  SetupAccountStepInputAvatar: { screen: SetupAccountStepInputAvatar },
  SetupAccountStepActiveLocation: { screen: SetupAccountStepActiveLocation },
  SetupAccountStepInputEmail: { screen: SetupAccountStepInputEmail },
  SetupAccountStepFinal: { screen: SetupAccountStepFinal }
}

const AppNavigator = createStackNavigator({
  Authentication,
  Main,
  Settings,
  ...loginNavigator,
  ...setupAccountNavigator
}, {
  headerMode: 'none'
})

export default createAppContainer(AppNavigator)

