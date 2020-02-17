import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { showErrorAlert } from '../../utils'
import { register } from '../../actions/register'
import { connect } from 'react-redux'

import ImagePicker from 'react-native-image-picker'

import RegistrationHelper from '../../api/RegistrationHelper'
import BaseComponent from '../../components/BaseComponent'
import DGButtonV2 from '../../components/DGButtonV2'
import Strings from '../../res/Strings'
import DGText from '../../components/DGText'
import Theme from '../../res/Theme'
import LoadableImage from '../../components/LoadableImage'
import { USER_EMAIL_STORE_KEY } from '../../utils/constants'

class SetupAccountStepInputAvatar extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    avatarSource: undefined
  }

  componentWillReceiveProps(nextProps) {
    let authenData = nextProps.authenticationData
    if (authenData.isLoading == false && authenData.accessToken) {
      const email = RegistrationHelper.instance().email
      if (email) {
        AsyncStorage.setItem(USER_EMAIL_STORE_KEY, email)
      }
      this.props.navigation.navigate("SetupAccountStepFinal")
    }
    else if (authenData.isLoading == false && authenData.accessToken === null) {
      if (RegistrationHelper.instance().facebookId) {
        showErrorAlert("Your Facebook account is already registed or your input information to registration is not valid somewhere, please check and try again!")
      }
      else if (RegistrationHelper.instance().googleId) {
        showErrorAlert("Your Google account is alread registed or your input information to registration is not valid somewhere, please check and try again!")
      }
      else {
        showErrorAlert("Your email is already registed or your input information to registration is not valid somewhere, please check and try again!")
      }
    }
  }

  requestGoToStepFinal = () => {
    if (this.state.avatarSource == undefined) {
      showErrorAlert(Strings.input.error.avatar)
      return
    }

    RegistrationHelper.instance().setAvatar(this.state.avatarSource)
    this.props.register()
  }

  requestSelectImage = () => {
    const options = {
      title: Strings.selectCardImage,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const imageBase64 = 'data:image/jpeg;base64,' + response.data
        const source = { uri: imageBase64 };
        this.setState({
          avatarSource: source
        })
      }
    })
  }

  renderLogo() {
    return (
      <LoadableImage
        style={{
          marginTop: 60,
          width: 120,
          height: 120,
          alignSelf: 'center'
        }}
        source={require('../../res/images/ic_icon.png')}
      />
    )
  }

  renderTitle() {
    return <DGText style={styles.messgage}>{Strings.avatar.title}</DGText>
  }

  renderImageInputHint() {
    if (this.state.avatarSource == undefined) {
      return <DGText style={styles.centerText}>{Strings.input.tapToSelect}</DGText> 
    }
  }

  renderImageInput() {
    let source = this.state.avatarSource ? this.state.avatarSource : require('../../res/images/placeholder.png')
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this.requestSelectImage}>
        <LoadableImage style={styles.centerImage} source={source}/>
        {this.renderImageInputHint()}
      </TouchableOpacity>
    )
  }

  renderBody() {
    return (
      <View style={styles.body}>
        {this.renderTitle()}
        {this.renderImageInput()}
      </View>   
    )
  }

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <DGButtonV2 
          style={{ backgroundColor: Theme.buttonPrimary, width: '50%' }}
          text={Strings.button.continue}
          loading={this.props.authenticationData.isLoading}
          onPress={this.requestGoToStepFinal}
          />
      </View>
    )
  }

  render() {
    return (
      <BaseComponent toolbar={{
        title: Strings.toolbar.back,
        onBack: () => this.props.navigation.goBack()
        }}>
        <KeyboardAwareScrollView contentContainerStyle={styles.body}>
          <View style={styles.body}>
            {this.renderLogo()}
            {this.renderBody()}
            {this.renderFooter()}
          </View>
          
        </KeyboardAwareScrollView>
      </BaseComponent>
    )
  }
}

const windowHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
  body: {
    flex: 1, 
    height: windowHeight,
    justifyContent: 'center'
  },
  input: {
    backgroundColor: Theme.buttonSecondary,
    width: '60%',
    color: Theme.textWhite,
    textAlign: 'center',
    marginTop: 16
  },
  messgage: {
    color: Theme.textGray,
    fontSize: 20,
    marginTop: 24,
    textAlign: 'center'
  },
  centerImage: {
    width: 200,
    height: 200,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 100,
    alignSelf: 'center'
  },
  centerText: {
    position: 'absolute',
    alignSelf: 'center',
    top: 160
  },
  footerContainer: {
    paddingBottom: getBottomSpace() + 32
  }
})

const mapStateToProps = (state) => ({
  authenticationData: state.authentication
})

const mapDispatchToProps = (dispatch) => ({
  register: () => dispatch(register())
})

export default connect(mapStateToProps, mapDispatchToProps)(SetupAccountStepInputAvatar)