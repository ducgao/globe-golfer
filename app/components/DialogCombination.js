import React, { PureComponent } from 'react'
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Modal from 'react-native-modal'
import DGText from './DGText'
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper'

export default class DialogCombination extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    visibleModal: undefined,
    dialogTitle: undefined,
    dialogMessage: undefined,
    dialogActionTitle: undefined,
    dialogAction: undefined,
    dialogYes: undefined,
    dialogNo: undefined,
    dialogActionYes: undefined,
    dialogActionNo: undefined,
  }

  showDialog(title, message, dialogActionTitle, action) {
    this.setState({
      visibleModal: "dialog",
      dialogTitle: title,
      dialogMessage: message,
      dialogActionTitle: dialogActionTitle,
      dialogAction: action
    })
  }

  showYesNoDialog(title, message, yes, no, actionYes, actionNo) {
    this.setState({
      visibleModal: "yesno",
      dialogTitle: title,
      dialogMessage: message,
      dialogYes: yes,
      dialogNo: no,
      dialogActionYes: actionYes,
      dialogActionNo: actionNo
    })
  }

  doBindAction = () => {
    const theAction = this.state.dialogAction
    this.setState({
      visibleModal: undefined,
      dialogTitle: undefined,
      dialogMessage: undefined,
      dialogActionTitle: undefined,
      dialogAction: undefined
    }, () => { setTimeout(theAction, 300) })
  }

  doBindActionYes = () => {
    const theAction = this.state.dialogActionYes
    this.setState({
      visibleModal: undefined,
      dialogTitle: undefined,
      dialogMessage: undefined,
      dialogYes: undefined,
      dialogNo: undefined,
      dialogActionYes: undefined,
      dialogActionNo: undefined
    }, () => { setTimeout(theAction, 300) })
  }

  doBindActionNo = () => {
    const theAction = this.state.dialogActionNo
    this.setState({
      visibleModal: undefined,
      dialogTitle: undefined,
      dialogMessage: undefined,
      dialogYes: undefined,
      dialogNo: undefined,
      dialogActionYes: undefined,
      dialogActionNo: undefined
    }, () => { setTimeout(theAction, 300) })
  } 

  renderModals() {
    const regularDialogModal = (
      <Modal 
        isVisible={this.state.visibleModal === "dialog"}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => this.setState({visibleModal: undefined})}
        onBackButtonPress={() => this.setState({visibleModal: undefined})}
        >
          <View style={{
            backgroundColor: 'white',
            borderRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 12
          }}>
          <DGText style={{
            fontSize: 24,
            fontWeight: 'bold',
          }}>{this.state.dialogTitle}</DGText>
          <DGText>{this.state.dialogMessage}</DGText>
          <TouchableOpacity 
            style={[
              { height: 44, justifyContent: 'center', alignItems: 'center' },
              { marginTop: 20 },
              { backgroundColor: Theme.buttonPrimary },
              { borderWidth: 0 }
            ]} activeOpacity={0.7} onPress={this.doBindAction}>
            <DGText style={[styles.socialText, {color: 'white', fontWeight: 'bold'}]}>{this.state.dialogActionTitle}</DGText>
          </TouchableOpacity>
        </View>
      </Modal>
    )

    const yesnoDialogModal = (
      <Modal 
        isVisible={this.state.visibleModal === "yesno"}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => this.setState({visibleModal: undefined})}
        onBackButtonPress={() => this.setState({visibleModal: undefined})}
        >
          <View style={{
            backgroundColor: 'white',
            borderRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 12
          }}>
          <DGText style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>{this.state.dialogTitle}</DGText>
          <DGText style={{ textAlign: 'center' }}>{this.state.dialogMessage}</DGText>
          <View style={{ marginTop: 20, flexDirection: 'row' }}>
            <TouchableOpacity 
              style={[
                { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
                { backgroundColor: 'gray' },
                { borderWidth: 0 }
              ]} activeOpacity={0.7} onPress={this.doBindActionNo}>
              <DGText style={[styles.socialText, {color: 'white', fontWeight: 'bold'}]}>{this.state.dialogNo}</DGText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
                { backgroundColor: Theme.buttonPrimary },
                { borderWidth: 0 }
              ]} activeOpacity={0.7} onPress={this.doBindActionYes}>
              <DGText style={[styles.socialText, {color: 'white', fontWeight: 'bold'}]}>{this.state.dialogYes}</DGText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )

    return (
      <React.Fragment>
        {regularDialogModal}
        {yesnoDialogModal}
      </React.Fragment>
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView 
        style={{ backgroundColor: Theme.mainBackground }}
        contentContainerStyle={
          [
            styles.body, 
            this.props.contentContainerStyle,
            { 
              backgroundColor: Theme.mainBackground,
              paddingBottom: getBottomSpace(), 
              paddingTop: getStatusBarHeight() 
            }
          ]}>
        {this.props.children}
        {this.renderModals()}
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    justifyContent: 'center',
    paddingBottom: 80
  }
})