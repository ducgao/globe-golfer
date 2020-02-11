import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { getBottomSpace } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import BaseComponent from '../../components/BaseComponent'
import DGText from '../../components/DGText'
import DGButtonV2 from '../../components/DGButtonV2'
import SettingToggle from '../../components/SettingToggle'
import SettingClickable from '../../components/SettingClickable'
import SettingValueClickable from '../../components/SettingValueClickable'
import SettingRange from '../../components/SettingRange'

import ImagePicker from 'react-native-image-picker'

import Strings from '../../res/Strings'
import Theme from '../../res/Theme'
import SettingSlider from '../../components/SettingSlider'
import LoadingModal from '../../components/LoadingModal'
import LoadableImage from '../../components/LoadableImage'
import Card from '../Challenge/components/Card'

const InterestItem = React.memo(({name, style, onPress}) => {

  const itemWidth = (Dimensions.get('window').width - 60) / 3
  return (
    <TouchableOpacity style={[
      {
        marginHorizontal: 4,
        marginBottom: 8,
        borderWidth: 1,
        height: 40,
        width: itemWidth,
        justifyContent: 'center',
        borderColor: 'gray'
      },
      style
    ]} disabled={!onPress} onPress={onPress} activeOpacity={0.7}>
      <DGText style={{
        alignSelf: 'center',
        color: 'white'
      }}>{name}</DGText>
    </TouchableOpacity> 
  )
})

class Profile extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    loading: false
  }

  requestGoToEditProfile = () => {
    this.props.navigation.navigate("Settings")
  }

  requestChangeAvatar = () => {
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

  renderAvatar() {
    const avatarSize = 250
    const avatarUrl = this.props.user.avatar
    let source = undefined
    if (avatarUrl && avatarUrl.startsWith("http")) {
      source = {uri: avatarUrl}
    }
    else {
      source = require('../../res/images/golfer_placeholder.png')
    }

    if (this.state.avatarSource) {
      source = this.state.avatarSource
    }

    return (
      <View style={{
        marginBottom: 24
      }}>
        <LoadableImage 
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            alignSelf: 'center',
            backgroundColor: Theme.buttonPrimary
          }}
          source={source}
        />
        <TouchableOpacity style={{
          width: '100%',
          height: 50,
          backgroundColor: '#00000090',
          position: 'absolute',
          bottom: 0,
        }} activeOpacity={0.7} onPress={this.requestChangeAvatar}>
          <DGText style={{
            width: '100%',
            height: 50,
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
            paddingTop: 8
          }}>Edit</DGText>
        </TouchableOpacity>
      </View>
    )
  }

  renderPersonalInfoBlock() {
    const user = this.props.user
    const name = [user.firstName, user.lastName].join(" ")

    return (
      <View>
        {this.renderValueClickableItem(Strings.profile.fullName, name)}
        {this.renderValueClickableItem(Strings.profile.myCountry, user.country)}
        {this.renderValueClickableItem(Strings.profile.myRegion, user.region)}
        {this.renderValueClickableItem(Strings.profile.myCountry, user.club)}
        {this.renderValueClickableItem(Strings.profile.index, user.index)}
        {this.renderSpacing(24)}
        {this.renderSectionTitle(Strings.profile.aboutMe)}
        {this.renderSpacing(8)}
        <DGText style={{
          width: '80%',
          color: Theme.textWhite,
          marginHorizontal: 16,
        }}>{user.about}</DGText>
        {this.renderSpacing(24)}
        {this.renderSectionTitle(Strings.profile.myInterests)}
        {this.renderSpacing(8)}
        {this.renderInterests()}
      </View>
    )
  }

  renderInterests() {
    const user = this.props.user
    const interest = user.interest
    if (!Array.isArray(interest) || interest.length == 0) {
      return <InterestItem 
        name={"+"} 
        style={{
          marginHorizontal: 16
        }}
        onPress={() => this.props.navigation.navigate("Interest")}
      />
    }

    interest.push({})

    return (
      <FlatList
        style={{ marginLeft: 12 }}
        data={interest}
        numColumns={3}
        keyExtractor={(_, index) => index}
        renderItem={({item}) => {
          if (item.name) {
            return <InterestItem name={item.name} />
          }
          else {
            return <InterestItem 
              name={"+"} 
              onPress={() => this.props.navigation.navigate("Interest")}
            />
          }
        }}
      />
    )
  }

  renderCTABlock() {
    return (
      <DGButtonV2 
        style={{ backgroundColor: Theme.buttonPrimary, width: '50%' }}
        text={Strings.settings.edit}
        onPress={this.requestGoToEditProfile}
        />
    )
  }

  renderDeleteAccountBlock() {
    return (
      <View>
        {this.renderSeparator()}
        {this.renderClickableItem(Strings.settings.deleteAccount)} 
      </View>
    )
  }

  renderRangeItem(title, min, max, value) {
    let item = <SettingRange
      key="range item"
      style={{ paddingBottom: 0 }}
      title={title}
      min={min}
      max={max}
      value={value}
    />
    return item;
  }

  renderSliderItem(title, valueTemplate, min, max, value) {
    let item = <SettingSlider
      key="slider item"
      style={{ paddingBottom: 0 }}
      title={title}
      valueTemplate={valueTemplate}
      min={min}
      max={max} 
      value={value}
    />
    return item;
  }

  renderValueClickableItem(title, value) {
    let item = <SettingValueClickable
      key="value clickable item" 
      style={{ paddingBottom: 12, paddingTop: 16 }}
      title={title}
      value={value}
      />
    return item;
  }

  renderClickableItem(title, align) {
    let item = <SettingClickable 
      key="clickable item" 
      titleAlign={align ? align : 'center'}
      style={{ paddingBottom: 8, paddingTop: 16 }}
      title={title} />
    return item;
  }

  renderToggleItem(title, description) {
    let item = <SettingToggle
      key="toggle item"
      style={{ paddingBottom: 4 }}
      title={title}
      description={description}
    />
    return item;
  }

  renderSectionTitle(title) {
    return <DGText key="section title" style={styles.sectionTitle}>{title}</DGText>
  }

  renderSpacing(height) {
    return <View style={{ height }} />
  }

  render() {
    const user = this.props.user
  
    return (
      <BaseComponent toolbar={{
        title: "Profile",
        onBack: this.props.navigation.goBack,
      }}>
        <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 44 }}>
          {user ? [
            <View style={{marginHorizontal: 16, marginTop: 24}}>
              <Card withAds={false} card={{
                location: user.club + ", " + user.region,
                avatar: user.avatar,
                about: user.about,
                rating: user.rate,
                name: user.firstName,
                lastName: user.lastName,
                metaData: [
                  { key: "Level", value: "Tour Player" },
                  { key: "Index", value: user.index },
                  { key: "Match", value: user.match },
                  { key: "Win", value: user.win },
                ]
              }}/>
            </View>,
            this.renderCTABlock()
          ] : null}
        </KeyboardAwareScrollView>
        <LoadingModal visible={this.state.loading} />
      </BaseComponent>
    )
  }
}

const windowWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
  body: {
    flex: 1, 
    justifyContent: 'center'
  },
  ggButton: {
    backgroundColor: Theme.buttonPrimary,
    width: windowWidth - 32,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 4,
    marginBottom: 16
  },
  separator: {
    marginTop: 12,
    width: '100%',
    height: 1,    
    backgroundColor: Theme.separator
  },
  title: {
    color: Theme.textWhite,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  messgage: {
    color: Theme.textGray,
    fontSize: 20,
    marginTop: 24,
    marginLeft: 16, 
    marginRight: 16,
    textAlign: 'center'
  },
  footerContainer: {
    paddingBottom: getBottomSpace() + 32
  },
  sectionTitle: {
    color: Theme.textWhite,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16, 
    marginRight: 16,
  }
})

const mapStateToProps = (state) => ({
  user: state.profile.user,
  settings: state.profile.settings
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)