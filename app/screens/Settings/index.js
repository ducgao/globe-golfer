import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, AsyncStorage, TouchableOpacity, FlatList, Alert } from 'react-native'
import { connect } from 'react-redux'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import lodash from 'lodash'

import BaseComponent from '../../components/BaseComponent'
import DGButton from '../../components/DGButton'
import LoadingModal from '../../components/LoadingModal'

import Strings from '../../res/Strings'
import Theme from '../../res/Theme'
import { ACCESS_TOKEN_STORE_KEY, USER_EMAIL_STORE_KEY } from '../../utils/constants';
import { StackActions, NavigationActions } from 'react-navigation';
import { updateProfile } from '../../actions/updateProfile';
import { GoogleSignin } from 'react-native-google-signin'
import { 
  renderToggleItem, 
  renderSectionTitle, 
  renderClickableItem, 
  renderSeparator, 
  renderSpacing, 
  renderValueClickableItem, 
  renderSliderItem, 
  renderRangeItem, 
  renderValueItem
} from './components/base'
import { getProfile } from '../../actions/getProfile'
import { getInterests } from '../../actions/getInterest'

import DialogCombination from '../../components/DialogCombination';
import Api from '../../api';
import LoadableImage from '../../components/LoadableImage'
import DGText from '../../components/DGText'
import ImagePicker from 'react-native-image-picker'
import EditAbout from './components/editabout'
import EditName from './components/editname'
import EditIndex from './components/editindex'
import SettingDateInputBlock from './components/dateinputblock'

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

class Settings extends PureComponent {
  static navigationOptions = { header: null }

  needUpdate = false

  coDV = null
  reDV = null
  clDV = null

  tempCoDV = null
  tempReDV = null
  tempClDV = null

  constructor(props) {
    super(props)

    this.state = {
      settings: props.settings,
      showChangePassword: false,
      loading: false,
      avatarSource: null,
      needOpenEditAbout: false,
      needOpenEditName: false,
      needOpenEditIndex: false,
      about: null,
      tempLocationEnable: null,
      countries: null,
      locationData: {
        countries: [],
        regions: [],
        clubs: [],
        coIndex: null,
        reIndex: null,
        clIndex: null
      },
      tempLocationData: {
        countries: [],
        regions: [],
        clubs: [],
        coIndex: null,
        reIndex: null,
        clIndex: null
      }
    }
  }

  componentDidMount() {
    AsyncStorage.getItem(USER_EMAIL_STORE_KEY).then(email => {
      if (email) {
        this.setState({showChangePassword: true})
      }
    })

    this.getCountries()
    this.props.getProfile()
    this.props.getInterests()
  } 

  componentWillReceiveProps(nextProps) {
    if (this.needUpdate) {
      this.props.getProfile()
      this.props.getInterests()

      this.setState({
        settings: nextProps.settings,
        loading: false,
        avatarSource: null,
        about: null,
        tempLocationEnable: null,
        locationData: {
          ...this.state.locationData,
          reIndex: null,
          clIndex: null
        },
        tempLocationData: {
          ...this.state.tempLocationData,
          reIndex: null,
          clIndex: null
        }
      })
    }
    
    this.needUpdate = false;
  }

  getCountries = () => {
    Api.instance().getCountries().then(res => {
      const curUserCountry = this.props.user.country
      const curUserTempCountry = this.props.user.tempCountry

      const curUserCountryIndex = res.findIndex(o => o.title === curUserCountry)
      const curUserTempCountryIndex = res.findIndex(o => o.title === curUserTempCountry)

      this.setState({
        locationData: {
          countries: res,
          regions: null,
          clubs: null,
          coIndex: curUserCountryIndex,
          reIndex: null,
          clIndex: null
        },
        tempLocationData: {
          countries: res,
          regions: null,
          clubs: null,
          coIndex: curUserTempCountryIndex,
          reIndex: null,
          clIndex: null
        }
      })

      const curUserCountryId = res[curUserCountryIndex].id
      const curUserTempCountryId = res[curUserTempCountryIndex].id
      
      this.getRegions(curUserCountryId, (regions) => {
        const curUserRegion = this.props.user.region
        const curUserRegionIndex = regions.findIndex(o => o.title === curUserRegion)

        this.setState({
          locationData: {
            ...this.state.locationData,
            regions,
            reIndex: curUserRegionIndex
          }
        })

        const curUserRegionId = regions[curUserRegionIndex].id

        this.getClubs(curUserRegionId, (clubs) => {
          const curUserClub = this.props.user.club
          const curUserClubIndex = clubs.findIndex(o => o.title === curUserClub)

          this.setState({
            locationData: {
              ...this.state.locationData,
              clubs,
              clIndex: curUserClubIndex
            }
          })
        })
      })

      this.getRegions(curUserTempCountryId, (regions) => {
        const curUserTempRegion = this.props.user.tempRegion
        const curUserTempRegionIndex = regions.findIndex(o => o.title === curUserTempRegion)

        this.setState({
          tempLocationData: {
            ...this.state.tempLocationData,
            regions,
            reIndex: curUserTempRegionIndex
          }
        })

        const curUserTempRegionId = regions[curUserTempRegionIndex].id

        this.getClubs(curUserTempRegionId, (clubs) => {
          const curUserTempClub = this.props.user.tempClub
          const curUserTempClubIndex = clubs.findIndex(o => o.title === curUserTempClub)

          this.setState({
            tempLocationData: {
              ...this.state.tempLocationData,
              clubs,
              clIndex: curUserTempClubIndex
            }
          })
        })
      })
    })
  }

  getRegions(countryId, callback) {
    Api.instance().getRegions(countryId).then(res => {
      callback(res)
    })
  }

  getClubs(regionId, callback) {
    Api.instance().getClubs(regionId).then(res => {
      callback(res)
    })
  }

  onCountryChanged = (newValue) => {
    const data = this.state.locationData

    if (data.countries == null || data.coIndex == null) {
      return
    }

    const coIndex = data.countries.findIndex(o => o.title === newValue)
    const coId = coIndex >= 0 ? data.countries[coIndex].id : -1

    this.setState({
      locationData: {
        ...this.state.locationData,
        regions: [],
        clubs: [],
        coIndex,
        reIndex: -1,
        clIndex: -1
      }
    })

    this.getRegions(coId, (regions) => {
      this.setState({
        locationData: {
          ...this.state.locationData,
          regions,
          clubs: [],
          reIndex: -1,
          clIndex: -1
        }
      })
    })
  }

  onTempCountryChanged = (newValue) => {
    const data = this.state.tempLocationData

    if (data.countries == null) {
      return
    }

    const coIndex = data.countries.findIndex(o => o.title === newValue)
    const coId = coIndex >= 0 ? data.countries[coIndex].id : -1

    this.setState({
      tempLocationData: {
        ...this.state.tempLocationData,
        regions: [],
        clubs: [],
        coIndex,
        reIndex: -1,
        clIndex: -1
      }
    })

    this.getRegions(coId, (regions) => {
      this.setState({
        tempLocationData: {
          ...this.state.tempLocationData,
          regions,
          clubs: [],
          reIndex: -1,
          clIndex: -1
        }
      })
    })
  }

  onRegionChanged = (newValue) => {
    const data = this.state.locationData

    if (data.regions == null || data.reIndex == null) {
      return
    }

    const reIndex = data.regions.findIndex(o => o.title === newValue)
    const reId = reIndex >= 0 ? data.regions[reIndex].id : -1

    this.setState({
      locationData: {
        ...this.state.locationData,
        reIndex
      }
    })

    this.getClubs(reId, (clubs) => {
      this.setState({
        locationData: {
          ...this.state.locationData,
          clubs,
          clIndex: -1
        }
      })
    })
  }

  onTempRegionChanged = (newValue) => {
    const data = this.state.tempLocationData

    if (data.regions == null) {
      return
    }

    const reIndex = data.regions.findIndex(o => o.title === newValue)
    const reId = reIndex >= 0 ? data.regions[reIndex].id : -1

    this.setState({
      tempLocationData: {
        ...this.state.tempLocationData,
        reIndex
      }
    })

    this.getClubs(reId, (clubs) => {
      this.setState({
        tempLocationData: {
          ...this.state.tempLocationData,
          clubs,
          clIndex: -1
        }
      })
    })
  }

  onClubChanged = (newValue) => {
    const data = this.state.locationData

    if (data.clubs == null || data.clIndex == null) {
      return
    }

    const clIndex = data.clubs.findIndex(o => o.title === newValue)

    this.setState({
      locationData: {
        ...this.state.locationData,
        clIndex
      }
    })
  }

  onTempClubChanged = (newValue) => {
    const data = this.state.tempLocationData

    if (data.clubs == null) {
      return
    }

    const clIndex = data.clubs.findIndex(o => o.title === newValue)

    this.setState({
      tempLocationData: {
        ...this.state.tempLocationData,
        clIndex
      }
    })
  }

  onRequestChangePassword = () => {
    this.props.navigation.navigate("ChangePassword")
  }

  onRequestLogout = () => {
    this.container.showYesNoDialog(
      Strings.logout.title,
      Strings.logout.message,
      Strings.button.yes,
      Strings.button.no,
      async () => {
        AsyncStorage.removeItem(ACCESS_TOKEN_STORE_KEY).then(() => {
          GoogleSignin.revokeAccess();
          GoogleSignin.signOut();
          Api.instance().setAccessToken(null)
          this.props.navigation.dispatch(StackActions.reset({
            index: 0, 
            key: null, 
            actions: [NavigationActions.navigate({ routeName: 'Authentication' })]
          }));
        });
      },
      () => {}
    )
  }

  onRequestToggleTempLocation = () => {
    if (this.state.tempLocationEnable == null) {
      const user = this.props.user
      const current = user.locationType
      const newL = current == 0 ? 1 : 0

      this.setState({
        tempLocationEnable: newL == 1
      })
    }
    else {
      this.setState({
        tempLocationEnable: null
      })
    }
  }

  onRequestDeleteAccount = () => {
    this.container.showYesNoDialog(
      Strings.deleteAccount.title,
      Strings.deleteAccount.message,
      Strings.button.yes,
      Strings.button.no,
      () => {
        this.setState({loading: true})
        Api.instance().deleteAccount().then(() => {
          this.setState({loading: false})
          AsyncStorage.removeItem(ACCESS_TOKEN_STORE_KEY).then(() => {
            Api.instance().setAccessToken(null)
            this.props.navigation.dispatch(StackActions.reset({
              index: 0, 
              key: null, 
              actions: [NavigationActions.navigate({ routeName: 'Authentication' })]
            }));
          });
        })
      },
      () => {}
    )
  }

  requestEditAbout = () => {
    this.setState({
      needOpenEditAbout: true
    })
  }

  requestEditName = () => {
    this.setState({
      needOpenEditName: true
    })
  }

  requestEditBirthday = () => {
    alert("request edit birthday")
  }

  requestEditIndex = () => {
    this.setState({
      needOpenEditIndex: true
    })
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

  renderAvatar = () => {
    const avatarSize = 200
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

  renderInterests() {
    const user = this.props.user
    const interest = user.interest.slice()
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

  renderPersonalInfoBlock = () => {
    const user = this.props.user
    
    const displayFname = this.state.firstName ? this.state.firstName : user.firstName
    const displayLname = this.state.lastName ? this.state.lastName : user.lastName

    const about = this.state.about ? this.state.about : user.about
    const name = displayFname + " " + displayLname
    const birthDay = this.state.birthDay ? this.state.birthDay : user.birthDay
    const index = this.state.index ? this.state.index : user.index

    return (
      <View>
        {renderValueItem(Strings.profile.fullName, name, this.requestEditName)}
        <SettingDateInputBlock 
          initValue={birthDay} 
          onDateChanged={date => {
            this.setState({
              birthDay: date
            })
          }} 
        />
        {renderValueItem(Strings.profile.index, index, this.requestEditIndex)}
        {renderSpacing(24)}
        {renderSectionTitle(Strings.profile.aboutMe, true)}
        {renderSpacing(8)}
        {
          about ? (
            <TouchableOpacity activeOpacity={0.7} onPress={this.requestEditAbout}>
              <DGText style={{
                width: '80%',
                color: Theme.textWhite,
                marginHorizontal: 16,
              }}>{about}</DGText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.7} onPress={this.requestEditAbout}>
              <DGText style={{
                width: '80%',
                color: Theme.textWhite,
                marginHorizontal: 16,
              }}>{"Your about is blank. Tap to edit"}</DGText>
            </TouchableOpacity>
          )
        }
        {renderSpacing(24)}
        {renderSectionTitle(Strings.profile.myInterests, true)}
        {renderSpacing(8)}
        {this.renderInterests()}
      </View>
    )
  }

  renderUserInfo() {
    const userAvatar = this.renderAvatar()
    const userBasicInfo = this.renderPersonalInfoBlock()
    
    return [userAvatar, userBasicInfo, renderSpacing(44)]
  }
  
  renderTemporaryLocation() {
    const user = this.props.user
    const value = this.state.tempLocationEnable != null ? this.state.tempLocationEnable : (user.locationType == 1)

    const data = this.state.tempLocationData

    let countryValue = null
    let regionValue = null
    let clubValue = null

    if (data.coIndex == null) {
      countryValue = user.tempCountry
    }
    else {
      if (data.coIndex >= 0 && Array.isArray(data.countries) && data.coIndex < data.countries.length) {
        countryValue = data.countries[data.coIndex].title
      }
    }

    if (data.reIndex == null) {
      regionValue = user.tempRegion
    }
    else {
      if (data.reIndex >= 0 && Array.isArray(data.regions) && data.reIndex < data.regions.length) {
        regionValue = data.regions[data.reIndex].title
      }
    }
    
    if (data.clIndex == null) {
      clubValue = user.tempClub
    }
    else {
      if (data.clIndex >= 0 && Array.isArray(data.clubs) && data.clIndex < data.clubs.length) {
        clubValue = data.clubs[data.clIndex].title
      }
    }

    this.tempCoDV = countryValue
    this.tempReDV = regionValue
    this.tempClDV = clubValue

    return (
      <View>
        {renderSectionTitle("TEMPORARY LOCATION")}
        {renderToggleItem("Enable", null, value, this.onRequestToggleTempLocation)}
        {renderValueClickableItem(
          Strings.settings.location, 
          Strings.inputLocation.hint.country, 
          null,
          countryValue, 
          data.countries ? data.countries : [],
          this.onTempCountryChanged
          )}
        {renderValueClickableItem(
          Strings.settings.region, 
          Strings.inputLocation.hint.region, 
          "Please select country first!",
          regionValue, 
          data.regions ? data.regions : [],
          this.onTempRegionChanged
          )}
        {renderValueClickableItem(
          Strings.settings.club, 
          Strings.inputLocation.hint.club, 
          "Please select region first!",
          clubValue, 
          data.clubs ? data.clubs : [],
          this.onTempClubChanged
          )} 
      </View>
    )
  }

  renderDiscoverBlock() {
    const user = this.props.user

    const data = this.state.locationData

    let countryValue = null
    let regionValue = null
    let clubValue = null

    if (data.coIndex == null) {
      countryValue = user.country
    }
    else {
      if (data.coIndex >= 0 && Array.isArray(data.countries) && data.coIndex < data.countries.length) {
        countryValue = data.countries[data.coIndex].title
      }
    }

    if (data.reIndex == null) {
      regionValue = user.region
    }
    else {
      if (data.reIndex >= 0 && Array.isArray(data.regions) && data.reIndex < data.regions.length) {
        regionValue = data.regions[data.reIndex].title
      }
    }
    
    if (data.clIndex == null) {
      clubValue = user.club
    }
    else {
      if (data.clIndex >= 0 && Array.isArray(data.clubs) && data.clIndex < data.clubs.length) {
        clubValue = data.clubs[data.clIndex].title
      }
    }

    this.coDV = countryValue
    this.reDV = regionValue
    this.clDV = clubValue

    return (
      <View>
        {renderSectionTitle(Strings.settings.defaultSettings)}
        {renderValueClickableItem(
          Strings.settings.location, 
          Strings.inputLocation.hint.country, 
          null,
          countryValue, 
          data.countries ? data.countries : [],
          this.onCountryChanged
          )}
        {renderValueClickableItem(
          Strings.settings.region, 
          Strings.inputLocation.hint.region, 
          "Please select country first!",
          regionValue, 
          data.regions ? data.regions : [],
          this.onRegionChanged
          )}
        {renderValueClickableItem(
          Strings.settings.club, 
          Strings.inputLocation.hint.club, 
          "Please select region first!",
          clubValue, 
          data.clubs ? data.clubs : [],
          this.onClubChanged
          )} 
        {
          renderSliderItem(
            Strings.settings.maxDistance, 
            "%s km", 
            1, 
            100, 
            this.state.settings.distance,
            (newValue) => this.setState({ 
              settings: {
                ...this.state.settings,
                distance: newValue 
              } 
            })
          )
        }
        {
          renderRangeItem(
            Strings.settings.ageRange, 
            13, 
            99, 
            [this.state.settings.ageRange.min, this.state.settings.ageRange.max],
            (nmin, mmax) => this.setState({ 
              settings: {
                ...this.state.settings,
                ageRange: { min: nmin, max: mmax }
              }
            }),
            1
          )
        }
        {
          renderRangeItem(
            Strings.settings.indexRange, 
            -4.0, 
            54.0, 
            [this.state.settings.indexRange.min, this.state.settings.indexRange.max],
            (nmin, mmax) => this.setState({ 
              settings: {
                ...this.state.settings,
                indexRange: { min: nmin, max: mmax }
              }
            }),
            0.1
          )
        }
      </View>
    )
  }

  renderTopBlock() {
    let ggSubscriptionButton = <DGButton 
      style={styles.ggButton}
      text={Strings.settings.getGGSubscription}
      onPress={() => this.props.navigation.navigate("Premium")}
    />
    return [ggSubscriptionButton]
  }

  renderVisibilityBlock() {
    let showGG = renderToggleItem(
      Strings.settings.showMeOnGG.title, 
      Strings.settings.showMeOnGG.message,
      this.state.settings.showGG === 1,
      () => { this.setState({ 
        settings: {
          ...this.state.settings,
          showGG: this.state.settings.showGG === 1 ? 0 : 1 
        }
      }) 
      }
    )

    return showGG
  }

  renderNotificationBlock() {
    return (
      <View>
        {renderSectionTitle(Strings.settings.notifications.title)}
        {
          renderToggleItem(
            Strings.settings.notifications.messages,
            undefined,
            this.state.settings.message === 1,
            () => { this.setState({ 
              settings: {
                ...this.state.settings,
                message: this.state.settings.message === 1 ? 0 : 1 
              }
            }) 
            }
          )
        }
        {
          renderToggleItem(
            Strings.settings.notifications.globeGolfer,
            undefined,
            this.state.settings.globegolfer === 1,
            () => { this.setState({ 
              settings: {
                ...this.state.settings, 
                globegolfer: this.state.settings.globegolfer === 1 ? 0 : 1  
              }
            }) 
            }
          )
        }
      </View>
    )
  }

  renderContactUsBlock() {
    return (
      <View>
        {renderSectionTitle(Strings.settings.contactUs)}
        {renderClickableItem(Strings.settings.helpAndSupport)}
        {renderClickableItem(Strings.settings.rateUs)}
        {renderClickableItem(Strings.settings.shareGG)} 
      </View>
    )
  }

  renderLegalBlock() {
    return (
      <View>
        {renderSectionTitle(Strings.settings.legal)}
        {
          renderClickableItem(
            Strings.settings.privacyPolicy, 
            "flex-start",
            () => alert("Open privary policy")
          )
        }
        {
          renderClickableItem(
            Strings.settings.termOfService, 
            "flex-start",
            () => alert("Open term of service")
          )
        }
        {
          renderClickableItem(
            Strings.settings.rulesAndEtiquettes, 
            "flex-start",
            () => alert("Open rules and etiquettes")
          )
        } 
        {
          renderClickableItem(
            Strings.settings.licenses, 
            "flex-start",
            () => alert("Open licenses")
          )
        }
      </View>
    )
  }

  renderLogoutBlock() {
    return (
      <View>
        {
          this.state.showChangePassword ? 
          renderClickableItem(
            Strings.settings.changePassword,
            undefined, 
            this.onRequestChangePassword
          ) : undefined
        } 
        {
          renderClickableItem(
            Strings.settings.logout, 
            undefined, 
            this.onRequestLogout
          )
        } 
        {
          renderClickableItem(
            Strings.settings.deleteAccount,
            undefined, 
            this.onRequestDeleteAccount
          )
        } 
      </View>
    )
  }

  renderDeleteAccountBlock() {
    return (
      <View>
        {renderSeparator()}
        {renderClickableItem(Strings.settings.deleteAccount)} 
      </View>
    )
  }

  onApply = () => {

    const locationData = this.state.locationData
    const tempLocationData = this.state.tempLocationData

    const isCountryValid = locationData.coIndex == null || locationData.coIndex >= 0
    const isRegionValid = locationData.reIndex == null || locationData.reIndex >= 0
    const isClubValid = locationData.clIndex == null || locationData.clIndex >= 0

    const isTempCountryValid = tempLocationData.coIndex == null || tempLocationData.coIndex >= 0
    const isTempRegionValid = tempLocationData.reIndex == null || tempLocationData.reIndex >= 0
    const isTempClubValid = tempLocationData.clIndex == null || tempLocationData.clIndex >= 0

    if (!isCountryValid || !isRegionValid || !isClubValid) {
      Alert.alert("Oops!", "Your location data is not valid. Please check it and apply settings again!")
      return
    }

    if (!isTempCountryValid || !isTempRegionValid || !isTempClubValid) {
      Alert.alert("Oops!", "Your temporary location data is not valid. Please check it and apply settings again!")
      return
    }

    let currentClubId = this.props.user.clubId
    if (locationData.clIndex != null) {
      currentClubId = locationData.clubs[locationData.clIndex].id
    }

    let currentTempClubId = this.props.user.tempClubId
    if (tempLocationData.clIndex != null) {
      currentTempClubId = tempLocationData.clubs[tempLocationData.clIndex].id
    }

    const objToUpdate = {
      distance: this.state.settings.distance,
      index_min: this.state.settings.indexRange.min,
      index_max: this.state.settings.indexRange.max,
      age_min: this.state.settings.ageRange.min,
      age_max: this.state.settings.ageRange.max,
      show_gg: this.state.settings.showGG,
      message: this.state.settings.message,
      globe_golfer: this.state.settings.globegolfer,
      avatar: this.state.avatarSource ? this.state.avatarSource.uri : undefined,
      about: this.state.about ? this.state.about : undefined,
      locationType: this.state.tempLocationEnable == null ? undefined : (this.state.tempLocationEnable ? 1 : 0),
      golfCourseName: this.clDV,
      golfCourseId: currentClubId,
      regionName: this.reDV,
      countryName: this.coDV,
      golfCourseTemName: this.tempClDV,
      golfCourseTemId: currentTempClubId,
      regionTemName: this.tempReDV,
      countryTemName: this.tempCoDV,
      p_index: this.state.index ? this.state.index : undefined,
      firstname: this.state.firstName ? this.state.firstName : undefined,
      lastname: this.state.lastName ? this.state.lastName : undefined,
      date_of_born: this.state.birthDay ? this.state.birthDay : undefined
    }

    this.setState({
      loading: true
    })
    this.needUpdate = true
    this.props.updateProfile(objToUpdate)
  }

  isLocationHasChanged() {
    const data = this.state.locationData
    const user = this.props.user
    if (data.coIndex == null && data.reIndex == null && data.clIndex == null) {
      return false
    }

    if (this.coDV === user.country && this.reDV === user.region && this.clDV === user.club) {
      return false
    }

    return true
  }

  isTempLocationHasChanged() {
    const data = this.state.tempLocationData
    const user = this.props.user

    if (data.coIndex == null && data.reIndex == null && data.clIndex == null) {
      return false
    }
    
    if (this.tempCoDV == user.tempCountry && this.tempReDV == user.tempRegion && this.tempClDV == user.tempClub) {
      return false
    }

    return true
  }

  isPersonalInfoHasChanged() {
    const { firstName, lastName, index, birthDay } = this.state
    const user = this.props.user

    if (firstName && firstName != user.firstName) {
      return true
    }

    if (lastName && lastName != user.lastName) {
      return true
    }

    if (index && index != user.index) {
      return true
    }

    if (birthDay && birthDay != user.birthDay) {
      return true
    }

    return false
  }

  render() {

    let right;
    const isSettingEqual = lodash.isEqual(this.state.settings, this.props.settings)
    const isAvatarHasChanged = this.state.avatarSource != null
    const isAboutHasChanged = this.state.about != null
    const isTempHasChanged = this.state.tempLocationEnable != null
    const isLocationHasChanged = this.isLocationHasChanged()
    // const isTempLocationHasChanged = this.isTempLocationHasChanged()
    const isPersonalInfoHasChanged = this.isPersonalInfoHasChanged()

    if (!isSettingEqual 
      || isAvatarHasChanged 
      || isAboutHasChanged 
      || isTempHasChanged
      || isLocationHasChanged
      // || isTempLocationHasChanged
      || isPersonalInfoHasChanged
      ) {
      right = {
        title: "Apply",
        onPress: this.onApply
      }
    }

    const user = this.props.user
    const about = this.state.about ? this.state.about : user.about
    const fname = this.state.firstName ? this.state.firstName : user.firstName
    const lname = this.state.lastName ? this.state.lastName : user.lastName
    const index = this.state.index ? this.state.index : user.index
    

    return (
      <BaseComponent toolbar={{
        title: Strings.settings.title,
        onBack: this.props.navigation.goBack,
        right
      }}>
        <DialogCombination 
          ref={r => this.container = r}
          contentContainerStyle={{ paddingTop: 24 }}
        >
          {this.renderUserInfo()}
          {
            this.props.user.isPremium ? undefined : [
              this.renderTopBlock()
            ]
          }
          {/* {renderSpacing(44)}
          {this.renderTemporaryLocation()} */}
          {renderSpacing(44)}
          {this.renderDiscoverBlock()}
          {this.renderVisibilityBlock()}
          {renderSpacing(44)}
          {this.renderNotificationBlock()}
          {renderSpacing(44)}
          {this.renderContactUsBlock()}
          {renderSpacing(44)}
          {this.renderLegalBlock()}
          {renderSpacing(44)}
          {this.renderLogoutBlock()}
          {renderSpacing(44)}
        </DialogCombination>
        <LoadingModal visible={this.state.loading} />
        <EditAbout
          initValue={about}
          visible={this.state.needOpenEditAbout} 
          onRequestOK={(text) => {
          this.setState({
            about: text,
            needOpenEditAbout: false
          })
        }}/>
        <EditName
          initValue={[fname, lname]}
          visible={this.state.needOpenEditName} 
          onRequestOK={(text) => {
          this.setState({
            firstName: text[0],
            lastName: text[1],
            needOpenEditName: false
          })
        }}/>
        <EditIndex
          initValue={index}
          visible={this.state.needOpenEditIndex} 
          onRequestOK={(text) => {
          this.setState({
            index: text,
            needOpenEditIndex: false
          })
        }}/>
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
  updateProfile: (objToUpdate) => dispatch(updateProfile(objToUpdate)),
  getProfile: () => dispatch(getProfile()),
  getInterests: () => dispatch(getInterests())
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)