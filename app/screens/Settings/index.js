import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import BaseComponent from '../../components/BaseComponent'
import DGText from '../../components/DGText'
import DGButton from '../../components/DGButton'
import SettingToggle from '../../components/SettingToggle'
import SettingClickable from '../../components/SettingClickable'
import SettingValueClickable from '../../components/SettingValueClickable'
import SettingRange from '../../components/SettingRange'

import Strings from '../../res/Strings'
import Theme from '../../res/Theme'
import SettingSlider from '../../components/SettingSlider'
import { ACCESS_TOKEN_STORE_KEY } from '../../utils/constants';
import { StackActions, NavigationActions } from 'react-navigation';
import DialogCombination from '../../components/DialogCombination';
import Api from '../../api';

class Settings extends PureComponent {
  static navigationOptions = { header: null }

  onRequestLogout = () => {
    this.container.showYesNoDialog(
      "Logout",
      "Are you sure to want to logout from this account?",
      "Yes",
      "No",
      () => {
        AsyncStorage.removeItem(ACCESS_TOKEN_STORE_KEY).then(() => {
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

  renderTopBlock() {
    let ggSubscriptionButton = <DGButton 
      style={styles.ggButton}
      text={Strings.settings.getGGSubscription}
      onPress={this.onRequestScanCard}
    />
    return [ggSubscriptionButton]
  }

  renderDiscoverBlock() {
    const user = this.props.user
    const settings = this.props.settings
    return (
      <View>
        {this.renderSectionTitle(Strings.settings.defaultSettings)}
        {this.renderValueClickableItem(Strings.settings.location, user.country)}
        {this.renderValueClickableItem(Strings.settings.region, user.region)}
        {this.renderValueClickableItem(Strings.settings.club, user.club)}
        {this.renderSliderItem(Strings.settings.maxDistance, "%s km", 1, 100, settings.distance)}
        {this.renderRangeItem(Strings.settings.ageRange, 18, 50, [settings.ageRange.min, settings.ageRange.max])}
        {this.renderRangeItem(Strings.settings.indexRange, 18, 50, [settings.indexRange.min, settings.indexRange.max])}
      </View>
    )
  }

  renderVisibilityBlock() {
    const settings = this.props.settings
    let showGG = this.renderToggleItem(
      Strings.settings.showMeOnGG.title, 
      Strings.settings.showMeOnGG.message,
      settings.showGG === 1
    )

    return showGG
  }

  renderWebProfileBlock() {
    return (
      <View>
        {this.renderSectionTitle(Strings.settings.webProfile)}
        {this.renderValueClickableItem(Strings.settings.username, "Aeron")}
      </View>
    )
  }

  renderNotificationBlock() {
    const settings = this.props.settings
    return (
      <View>
        {this.renderSectionTitle(Strings.settings.notifications.title)}
        {
          this.renderToggleItem(
            Strings.settings.notifications.messages,
            undefined,
            settings.message === 1
          )
        }
        {
          this.renderToggleItem(
            Strings.settings.notifications.globeGolfer,
            undefined,
            settings.globegolfer === 1
          )
        }
      </View>
    )
  }

  renderContactUsBlock() {
    return (
      <View>
        {this.renderSectionTitle(Strings.settings.contactUs)}
        {this.renderClickableItem(Strings.settings.helpAndSupport)}
        {this.renderClickableItem(Strings.settings.rateUs)}
        {this.renderClickableItem(Strings.settings.shareGG)} 
      </View>
    )
  }

  renderLegalBlock() {
    return (
      <View>
        {this.renderSectionTitle(Strings.settings.legal)}
        {this.renderClickableItem(Strings.settings.privacyPolicy, "flex-start")}
        {this.renderClickableItem(Strings.settings.termOfService, "flex-start")}
        {this.renderClickableItem(Strings.settings.rulesAndEtiquettes, "flex-start")} 
        {this.renderClickableItem(Strings.settings.licenses, "flex-start")}
      </View>
    )
  }

  renderLogoutBlock() {
    return (
      <View>
        {this.renderClickableItem(Strings.settings.changePassword)} 
        {this.renderClickableItem(Strings.settings.logout, undefined, this.onRequestLogout)} 
        {this.renderClickableItem(Strings.settings.deleteAccount)} 
      </View>
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

  renderClickableItem(title, align, onPress) {
    let item = <SettingClickable 
      key="clickable item" 
      titleAlign={align ? align : 'center'}
      style={{ paddingBottom: 8, paddingTop: 16 }}
      title={title}
      onPress={onPress}
    />
    return item;
  }

  renderToggleItem(title, description, isOn, onChanged) {
    let item = <SettingToggle
      key="toggle item"
      style={{ paddingBottom: 4 }}
      title={title}
      description={description}
      isOn={isOn}
      onChanged={onChanged}
    />
    return item;
  }

  renderSectionTitle(title) {
    let item = <DGText key="section title" style={styles.sectionTitle}>{title.toUpperCase()}</DGText>
    return this.renderItemWithSeparator(item)
  }

  renderItemWithSeparator(item) {
    let separator = this.renderSeparator()
    return [item, separator]
  }

  renderSpacing(height) {
    return <View style={{ height }} />
  }

  renderSeparator() {
    return <View key="separator" style={styles.separator} />
  }

  render() {
    return (
      <BaseComponent toolbar={{
        title: Strings.settings.title,
        onBack: () => this.props.navigation.goBack()
      }}>
        <DialogCombination 
          ref={r => this.container = r}
          contentContainerStyle={{ paddingTop: 24 }}
        >
          {this.renderTopBlock()}
          {this.renderSeparator()}
          {this.renderSpacing(44)}
          {this.renderDiscoverBlock()}
          {this.renderVisibilityBlock()}
          {this.renderSpacing(44)}
          {this.renderNotificationBlock()}
          {this.renderSpacing(44)}
          {this.renderContactUsBlock()}
          {this.renderSpacing(44)}
          {this.renderLegalBlock()}
          {this.renderSpacing(44)}
          {this.renderLogoutBlock()}
          {this.renderSpacing(44)}
        </DialogCombination>
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

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)