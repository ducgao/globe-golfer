import { AsyncStorage } from 'react-native'
import { ACCESS_TOKEN_STORE_KEY } from '../utils/constants'
import LotteryBinder from './Binders/LotteryBinder';
import ProfileBinder from './Binders/ProfileBinder';

export default class Base {

  accessToken = undefined;

  _clearApp() {
    // AsyncStorage.removeItem(ACCESS_TOKEN_STORE_KEY).then(() => {
    //   this.navigation.dispatch(StackActions.reset(
    //     {
    //        index: 0,
    //        key: null,
    //        actions: [
    //          NavigationActions.navigate({ routeName: 'Authentication'})
    //        ]
    //      }
    //     )
    //   )
    // })
  }

  setAccessToken(token) {
    this.accessToken = token

    if (token) {
      AsyncStorage.setItem(ACCESS_TOKEN_STORE_KEY, token)  
    }
    else {
      AsyncStorage.removeItem(ACCESS_TOKEN_STORE_KEY)
    }
  }

  getAccessToken() {
    return this.accessToken
  }

  callPost(url, body, binder) {
    return this.call('POST', url, body, binder)
  }

  callPut(url, body, binder) {
    return this.call('PUT', url, body, binder)
  }

  callGet(url, binder) {
    return this.call('GET', url, null, binder)
  }

  callDelete(url, binder) {
    return this.call('DELETE', url, null, binder)
  }

  call(method, url, body, binder) {
    const headers = this.accessToken ? {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken
    } : {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const getConfigs = { method, headers }
    const postConfigs = body ? { ...getConfigs, body } : getConfigs
    const configs = method != 'GET' ? postConfigs : getConfigs

    return new Promise((resolve, rejecter) => {
      fetch(url, configs)
      .then(response => {
        const statusCode = response.status
        const data = response.json()

        if (statusCode != 200) {
          alert(JSON.stringify(response))
        }

        return Promise.all([statusCode, data])
      })
      .then(([code, data]) => {
        if (code == 401) {
          this._clearApp()
        } else if (code == 200) {
          if (binder) {
            const binded = binder.bind(data);
            if (!binded || binded.result === false) {
              rejecter()
            }
            else {
              resolve(binded)
            }
          }
          else {
            resolve()
          }
        }
        rejecter(code)
      })
      .catch(e => {
        rejecter(e)
      })
    })
  }
}