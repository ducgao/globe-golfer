import React, { PureComponent } from 'react'
import { AsyncStorage } from 'react-native'
import BaseComponent from '../../components/BaseComponent'
import { ACCESS_TOKEN_STORE_KEY } from '../../utils/constants';
import Api from '../../api';

export default class Authentication extends PureComponent {
  static navigationOptions = { header: null }

  constructor(props) {
    super(props)
    Api.instance().setNavigation(props.naviga)
    AsyncStorage.getItem(ACCESS_TOKEN_STORE_KEY).then(token => {
      if (token) {
        Api.instance().setAccessToken(token)
        props.navigation.replace("Main")    
      }
      else {
        props.navigation.replace("Register")
      }
    })
    .catch(() => {
      props.navigation.replace("Register")
    })

    // props.navigation.replace("Register")
  }

  render() {
    return null
  }
}