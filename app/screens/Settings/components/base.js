import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import DGText from "../../../components/DGText"
import SettingRange from '../../../components/SettingRange'
import SettingSlider from '../../../components/SettingSlider'
import SettingValueClickable from '../../../components/SettingValueClickable'
import SettingValue from '../../../components/SettingValue'
import SettingClickable from '../../../components/SettingClickable'
import SettingToggle from '../../../components/SettingToggle'
import { getBottomSpace } from 'react-native-iphone-x-helper'

export function renderSectionTitle(title, withoutSeparator) {
  let item = <DGText key={"section title" + title} style={styles.sectionTitle}>{title.toUpperCase()}</DGText>
  if (withoutSeparator) {
    return item
  }
  else {
    return renderItemWithSeparator(item)
  }
}

export function renderItemWithSeparator(item) {
  let separator = renderSeparator()
  return [item, separator]
}

export function renderSpacing(height) {
  return <View style={{ height }} />
}

export function renderSeparator() {
  return <View key="separator" style={styles.separator} />
}

export function renderRangeItem(title, min, max, value, onChange, step) {
  let item = <SettingRange
    key={"range-item-" + title}
    style={{ paddingBottom: 0 }}
    title={title}
    min={min}
    max={max}
    value={value}
    step={step}
    onValueChange={onChange}
  />
  return item;
}

export function renderSliderItem(title, valueTemplate, min, max, value, onChange) {
  let item = <SettingSlider
    key={"slider-item-" + title}
    style={{ paddingBottom: 0 }}
    title={title}
    valueTemplate={valueTemplate}
    min={min}
    max={max} 
    value={value}
    onValueChange={onChange}
  />
  return item;
}

export function renderValueClickableItem(title, hint, notReadyMessage, value, data, onChanged) {
  let item = <SettingValueClickable
    key={"value-clickable-item-" + title}
    style={{ paddingBottom: 12, paddingTop: 16 }}
    notReadyMessage={notReadyMessage}
    data={data}
    hint={hint}
    title={title}
    value={value}
    onChanged={onChanged}
    />
  return item;
}

export function renderValueItem(title, value, action) {
  let item = <SettingValue
    key={"value-clickable-item-" + title}
    style={{ paddingBottom: 12, paddingTop: 16 }}
    title={title}
    value={value}
    onPress={action}
    />
  return item;
}

export function renderClickableItem(title, align, onPress) {
  let item = <SettingClickable
    key={"clickable-item-" + title} 
    titleAlign={align ? align : 'center'}
    style={{ paddingBottom: 8, paddingTop: 16 }}
    title={title}
    onPress={onPress}
  />
  return item;
}

export function renderToggleItem(title, description, isOn, onChanged) {
  let item = <SettingToggle
    key={"toggle-item-" + title}
    style={{ paddingBottom: 4 }}
    title={title}
    description={description}
    isOn={isOn}
    onChanged={onChanged}
  />
  return item;
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