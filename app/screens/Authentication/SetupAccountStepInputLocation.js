import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import { showErrorAlert } from '../../utils'
import { getCountries } from '../../actions/getCountries'
import { getRegions } from '../../actions/getRegions'
import { getClubs } from '../../actions/getClubs'
import { connect } from 'react-redux'

import RegistrationHelper from '../../api/RegistrationHelper'
import BaseComponent from '../../components/BaseComponent'
import DGButtonV2 from '../../components/DGButtonV2';
import Strings from '../../res/Strings'
import Theme from '../../res/Theme'
import SelectInputBlockV2 from '../../components/SelectInputBlockV2';
import TextInputBlockV2 from '../../components/TextInputBlockV2';
import DateInputBlockV2 from '../../components/DateInputBlockV2';
import LoadableImage from '../../components/LoadableImage'


const GENDERS = ["Male", "Female", "Other"]

class SetupAccountStepInputLocation extends PureComponent {
  static navigationOptions = { header: null }

  fnameTextInput = undefined
  lNameTextInput = undefined
  indexTextInput = undefined
  licenseTextInput = undefined

  selectedBirthday = undefined
  selectedGender = undefined

  selectedCountryId = undefined
  selectedRegionId = undefined
  selectedClubId = undefined

  componentDidMount() {
    this.props.getCountries()
  }

  requestGoToActiveLocation = () => {
    const firstName = this.fnameTextInput.getText();
    if (!firstName) {
      showErrorAlert("Your first name can not be blank")
      return
    }

    const lastName = this.lNameTextInput.getText()
    if (!lastName) {
      showErrorAlert("Your last name can not be blank")
      return
    }

    if (this.selectedBirthday == undefined) {
      showErrorAlert("Please select your birthday")
      return
    }

    if (this.selectedGender == undefined) {
      showErrorAlert("Please select your gender")
      return
    }

    const index = this.indexTextInput.getText()
    if (index < -4 || index > 54) {
      showErrorAlert("Please enter the index in range from -4.0 to 54")
      return
    }
    if (!index) {
      showErrorAlert("Your index can not be blank")
      return
    }
    const license = this.licenseTextInput.getText()
    if (!license) {
      showErrorAlert("Your license's number can not be blank")
      return
    }
    const lengthLicense =this.licenseTextInput.getText().length
    console.warn("lincense"+lengthLicense);
    
    if (lengthLicense < 7 || lengthLicense > 9) {
      showErrorAlert("Your license's length min 7 digits and max 9 digits")
      return
    }
    if (this.selectedCountryId == undefined) {
      showErrorAlert(Strings.inputLocation.error.country)
      return
    }

    if (this.selectedRegionId == undefined) {
      showErrorAlert(Strings.inputLocation.error.region)
      return
    }

    if (this.selectedClubId == undefined) {
      showErrorAlert(Strings.inputLocation.error.club)
      return
    }

    RegistrationHelper.instance().setFirstName(firstName)
    RegistrationHelper.instance().setLastName(lastName)
    RegistrationHelper.instance().setIndex(index)
    RegistrationHelper.instance().setLicense(license)
    RegistrationHelper.instance().setBirthDay(this.selectedBirthday)
    RegistrationHelper.instance().setGender(this.selectedGender)
    RegistrationHelper.instance().setCountry(this.selectedCountryId)
    RegistrationHelper.instance().setRegion(this.selectedRegionId)
    RegistrationHelper.instance().setClub(this.selectedClubId)
    this.props.navigation.navigate("SetupAccountStepActiveEmailContact")
  }

  onCountrySelectionChange = (newCountryId) => {
    if (newCountryId == 0) {
      this.selectedCountryId = undefined
      return
    }

    this.selectedCountryId = newCountryId
    this.props.getRegions(newCountryId)
  }

  onRegionSelectionChange = (newRegionId) => {
    if (newRegionId == 0) {
      this.selectedRegionId = undefined
      return
    }

    this.selectedRegionId = newRegionId
    this.props.getClubs(newRegionId)
  }

  onClubSelectionChange = (newClubId) => {
    if (newClubId == 0) {
      this.selectedClubId = undefined
      return
    }

    this.selectedClubId = newClubId
  }

  onGenderSelectionChange = (newGenderId) => {
    if (newGenderId == 0) {
      this.selectedGender = undefined
      return
    }

    this.selectedGender = newGenderId
  }

  onBirthdayChanged = (newDate) => {
    this.selectedBirthday = newDate
  }

  renderSelectCountry() {
    let items = []
    if (this.props.countries.data) {
      items = this.props.countries.data.map(i => {
        return {
          label: i.title,
          value: i.id
        }
      })
    } 

    return <SelectInputBlockV2
      title={Strings.inputLocation.country} 
      hint={Strings.inputLocation.hint.country}
      isLoading={this.props.countries.isLoading}
      items={items}
      onValueChange={this.onCountrySelectionChange}
    />
  }

  renderSelectRegion() {
    let items = []
    if (this.props.regions.data) {
      items = this.props.regions.data.map(i => {
        return {
          label: i.title,
          value: i.id
        }
      })
    }

    return <SelectInputBlockV2 
      title={Strings.inputLocation.region} 
      hint={Strings.inputLocation.hint.region}
      isLoading={this.props.regions.isLoading}
      items={items}
      onValueChange={this.onRegionSelectionChange}
    />
  }

  renderSelectPlayzone() {
    let items = []
    if (this.props.clubs.data) {
      items = this.props.clubs.data.map(i => {
        return {
          label: i.title,
          value: i.id
        }
      })
    }

    return <SelectInputBlockV2 
      title="Club" 
      hint={Strings.inputLocation.hint.club}
      isLoading={this.props.clubs.isLoading}
      items={items}
      onValueChange={this.onClubSelectionChange}
    />
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

  renderSelectGender() {
    const items = GENDERS.map(i => {
      return {
        label: i,
        value: i
      }
    })

    return <SelectInputBlockV2
      title="Gender"
      hint="Select your gender"
      items={items}
      onValueChange={this.onGenderSelectionChange}
    />
  }

  renderPersonalInfo() {
    const initFirstName = RegistrationHelper.instance().firstName
    const initLastName = RegistrationHelper.instance().lastName

    const email = <TextInputBlockV2
      ref={ref => this.fnameTextInput = ref}
      title="First name"
      placeholder="Enter your first name" 
      inputAlign="left"
      initValue={initFirstName}
    />
    const password = <TextInputBlockV2 
      ref={ref => this.lNameTextInput = ref}
      title="Last name"
      placeholder="Enter your last name"
      inputAlign="left"
      initValue={initLastName}
    />
    const date = <DateInputBlockV2 style={styles.body} title="Birthday" onDateChange={this.onBirthdayChanged}/>
    const sexSelect = this.renderSelectGender()
    return (
      <>
        <View style={{
          paddingHorizontal: 16
        }}>
          {email}
          {password}
          {date}
        </View>
        {sexSelect}
      </>
    )
  }

  renderMemberShipInfo() {
    let index = <TextInputBlockV2
      ref={ref => this.indexTextInput = ref}
      title="Index"
      placeholder="Enter your index" 
      inputAlign="left"
    />
    let license = <TextInputBlockV2 
      ref={ref => this.licenseTextInput = ref}
      title="License's number"
      placeholder="Enter your number of license"
      inputAlign="left"
    />
    return (
      <View style={{
        paddingHorizontal: 16
      }}>
        {index}
        {license}
      </View>
    )
  }

  renderLocationInfo() {
    const countries = this.renderSelectCountry();
    const regions = this.renderSelectRegion();
    const clubs = this.renderSelectPlayzone();

    return (
      <>
        {countries}
        {regions}
        {clubs}
      </>
    )
  }

  renderBody() {
    return (
      <View style={styles.body}>
        {this.renderPersonalInfo()}
        {this.renderMemberShipInfo()}
        {this.renderLocationInfo()}
      </View>
    )
  }

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <DGButtonV2 
          style={{ backgroundColor: Theme.buttonPrimary, width: '50%' }}
          text={Strings.button.continue}
          onPress={this.requestGoToActiveLocation}
          />
      </View>
    )
  }

  render() {
    return (
      <BaseComponent toolbar={{
        title: Strings.toolbar.back,
        onBack: () => this.props.navigation.goBack()}}>
        <KeyboardAwareScrollView contentContainerStyle={styles.body}>
            {this.renderLogo()}
            {this.renderBody()}
            {this.renderFooter()}
        </KeyboardAwareScrollView>
      </BaseComponent>
    )
  }
}

const windowHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
  body: {
    
  },
  input: {
    backgroundColor: Theme.buttonSecondary,
    width: '80%',
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
  footerContainer: {
    marginVertical: 24,
    paddingBottom: getBottomSpace() + 32
  }
})

const mapStateToProps = (state) => ({
  countries: state.countries,
  regions: state.regions,
  clubs: state.clubs
})

const mapDispatchToProps = (dispatch) => ({
  getCountries: () => dispatch(getCountries()),
  getRegions: (countryId) => dispatch(getRegions(countryId)),
  getClubs: (regionId) => dispatch(getClubs(regionId))
})

export default connect(mapStateToProps, mapDispatchToProps)(SetupAccountStepInputLocation)
