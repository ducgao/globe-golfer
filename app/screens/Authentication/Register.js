import React, { PureComponent } from 'react'
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native'

import { GoogleSignin } from 'react-native-google-signin'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk"
import DGText from '../../components/DGText'
import Strings from '../../res/Strings'
import Theme from '../../res/Theme'
import Intro from '../../components/Intro'

import Icon from 'react-native-vector-icons/Ionicons'
import DialogCombination from '../../components/DialogCombination';
import LoadingModal from '../../components/LoadingModal';
import RegistrationHelper from '../../api/RegistrationHelper';
import LoadableImage from '../../components/LoadableImage'
import { showErrorAlert } from '../../utils'
import Api from '../../api'

export default class Register extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    visibleModal: undefined,
    loading: false
  }

  componentDidMount() {
    GoogleSignin.configure({ webClientId: '150393205713-niluqkkcdf6kir5trl7odkfdoe7aeqio.apps.googleusercontent.com' })
  }

  checkGoogleAccountExisted = (user) => {
    return new Promise((resolve) => {
      Api.instance().loginGoogle(user.user.id, user.idToken).then(res => {
        resolve(res.result)
      })
      .catch(() => {
        resolve(false)
      })
    })
  }

  checkFacebookAccountExisted = (data) => {
    return new Promise((resolve) => {
      Api.instance().loginFacebook(data.userID, data.accessToken).then(res => {
        resolve(res.result)
      })
      .catch(() => {
        resolve(false)
      })
    })
  }

  onRequestGoToInputEmail = () => {
    this.props.navigation.navigate("SetupAccountStepInputEmail")
  }

  onRequestConfirmGoToInputEmail = () => {
    this.container.showDialog(
      "Please accept our conditions", 
      "By signing up, you agree to our term of use. Remember our condifdentiality policy", 
      "Accept and Register", 
      this.onRequestGoToInputEmail)
  }

  onRequestConfirmGoToFacebook = () => {
    this.container.showYesNoDialog(
      'GlobeGolfer want to use Facebook.com to connect', 
      "This allows us to get some required information from you.", 
      "Continue",
      "Cancel",
      this.onRequestLoginWithFacebook,
      () => {}
    )
  }

  onRequestConfirmGoToGoogle = () => {
    this.container.showYesNoDialog(
      'GlobeGolfer want to use Google.com to connect', 
      "This allows us to get some required information from you.", 
      "Continue",
      "Cancel",
      this.onRequestLoginWithGoogle,
      () => {}
    )
  }

  onRequestLoginWithFacebook = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (result) => {
        if (result.isCancelled) {
          alert("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(
            async (data) => {
              this.setState({loading: true})
              const isAccountExisted = await this.checkFacebookAccountExisted(data)
              this.setState({loading: false})
              
              if (isAccountExisted) {
                setTimeout(() => {
                  showErrorAlert("You Facebook account is already existed. Please use another one or Login")
                }, 1000)
              } 
              else {
                RegistrationHelper.instance().setFacebookId(data.userID)
                RegistrationHelper.instance().setFacebookToken(data.accessToken)
                this.initUser()
              }
            }
          )
        }
      },
      (error) => {
        // alert("Login fail with error: " + error)
      }
    )
  }

  initUser = () => {
    const userInfoRequest = new GraphRequest('/me', {
        httpMethod: 'GET',
        version: 'v2.5',
        parameters: {
            'fields': {
                'string' : 'email,name,first_name,last_name'
            }
        }
    }, (err, res) => {
        RegistrationHelper.instance().setFirstName(res.first_name)
        RegistrationHelper.instance().setLastName(res.last_name)
        this.props.navigation.navigate("SetupAccountStepInputLocation")
    });

    new GraphRequestManager().addRequest(userInfoRequest).start();
  }

  onRequestLoginWithGoogle = () => {
    GoogleSignin.signIn().then(async user => {

      this.setState({loading: true})
      const isAccountExisted = await this.checkGoogleAccountExisted(user)
      this.setState({loading: false})
      if (isAccountExisted) {
        setTimeout(() => {
          showErrorAlert("You Google account is already existed. Please use another one or Login")
        }, 1000)
      }
      else {
        RegistrationHelper.instance().setGoogleId(user.user.id)
        RegistrationHelper.instance().setGoogleToken(user.idToken)
        RegistrationHelper.instance().setFirstName(user.user.givenName)
        RegistrationHelper.instance().setLastName(user.user.familyName)
        this.props.navigation.navigate("SetupAccountStepInputLocation")
      }
    }).catch(e => {
      alert(e)
    })
  }

  onRequestGoToLogin = () => {
    this.props.navigation.navigate("Login")
  }

  renderLogo() {
    return (
      <LoadableImage
        style={{
          marginTop: 20,
          width: 120,
          height: 120,
          alignSelf: 'center'
        }}
        source={require('../../res/images/ic_icon.png')}
      />
    )
  }

  renderIntroBlock() {
    return <Intro />
  }

  renderLoginFacebookButton() {
    return this.renderSocialButton(
      false,
      '#4267b2', 
      <Icon 
        style={styles.socialIcon} 
        name='logo-facebook' 
        size={40} 
        color='white'
      />,
      Strings.register.facebook, 
      'white',
      this.onRequestConfirmGoToFacebook
    )
  }

  renderLoginGoogleButton() {
    return this.renderSocialButton(
      true,
      Theme.mainBackground,
      <LoadableImage 
        style={[
          styles.socialIcon, 
          { 
            left: 4,
            width: 30, 
            height: 30, 
          }]} 
        source={require('../../res/images/ic_google.png')}
      />,
      Strings.register.google, 
      'white',
      this.onRequestConfirmGoToGoogle
    )
  }

  renderEmailButton() {
    return this.renderSocialButton(
      true,
      Theme.mainBackground, 
      <Icon 
        style={[styles.socialIcon, { width: 40, height: 30, marginLeft: 2 }]} 
        name='md-mail' 
        size={30} 
        color='white'
      />,
      Strings.register.email, 
      'white',
      this.onRequestConfirmGoToInputEmail
    )
  }

  renderSocialButton(isShowBorder, background, logo, text, textColor, action) {
    return (
      <TouchableOpacity 
        style={[
          styles.socialButtonContainer, 
          { backgroundColor: background },
          { borderWidth: isShowBorder ? 1 : 0 }
        ]} activeOpacity={0.7} onPress={action}>
        {logo}
        <DGText style={[styles.socialText, {color: textColor}]}>{text}</DGText>
      </TouchableOpacity>
    )
  }

  renderSeparator() {
    return (
      <View style={{ 
        justifyContent: 'center', 
        marginBottom: 24, 
        marginTop: 12,
        flexDirection: 'row'
      }}>
        <View style={{ 
          flex: 1,
          marginLeft: 16,
          marginRight: 8,
          height: 1,
          alignSelf: 'center',
          backgroundColor: 'gray' 
        }}/>
        <DGText style={{
          alignSelf: 'center',
          width: 20,
          height: 20,
          color: 'white', 
          textAlign: 'center'
        }}>{Strings.or}</DGText>
        <View style={{ 
          flex: 1,
          marginLeft: 8,
          marginRight: 16,
          height: 1,
          alignSelf: 'center',
          backgroundColor: 'gray' 
        }}/>
      </View>
    )
  }

  renderNote() {
    return (
      <TouchableOpacity style={{
        marginTop: 12, 
        justifyContent: 'center',
        flexDirection: 'row'
      }} activeOpacity={0.7} onPress={this.onRequestGoToLogin}>
        <DGText style={{
          alignSelf: 'center',
          height: 20,
          color: 'white', 
          textAlign: 'center'
        }}>{Strings.register.alreadyMember}</DGText>
        <DGText style={{
          alignSelf: 'center',
          height: 20,
          color: 'white', 
          textAlign: 'center',
          textDecorationLine: 'underline'
        }}>{` ${Strings.register.connection} `}</DGText>
      </TouchableOpacity>
    )
  }

  renderControls() {
    return (
      <View style={{
        paddingTop: 24,
        paddingBottom: 24
      }}>
        {this.renderLoginFacebookButton()}
        {this.renderLoginGoogleButton()}
        {this.renderSeparator()}
        {this.renderEmailButton()}
        {this.renderNote()}
      </View>
    )
  }

  render() {
    return (
      <DialogCombination ref={r => this.container = r}>
        {this.renderLogo()}
        {this.renderIntroBlock()}
        {this.renderControls()}
        <LoadingModal visible={this.state.loading} />
      </DialogCombination>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    justifyContent: 'center'
  },
  socialButtonContainer: {
    height: 44,
    backgroundColor: '#4267b2',
    flexDirection: 'row',
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white'
  },
  socialIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 8,
    top: null,
    bottom: null,
    alignSelf: 'center'
  },
  socialText: {
    alignSelf: 'center',
    color: 'white'
  }
})