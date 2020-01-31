import React from 'react';
import {View, Alert} from 'react-native';
import Header from '../comps/Header';
import BaseComponent from '../../../../components/BaseComponent';
import DGText from '../../../../components/DGText';
import Theme from '../../../../res/Theme';
import SelectItem from '../comps/CircleButton';
import GameData from '../GameData';
import { useNavigation } from 'react-navigation-hooks';
import { emailValidationFunction } from '../../../../utils';
import DGInputV2 from '../../../../components/DGInputV2';

class Input extends React.PureComponent {

  inputRef = null

  getText() {
    return this.inputRef.getText()
  }

  render() {
    return (
      <View style={{paddingHorizontal: 24, marginVertical: 12}}>
        <DGText style={{color: Theme.buttonPrimary, fontSize: 16}}>{this.props.title}</DGText>
        <DGInputV2
          ref={r => this.inputRef = r}
          placeholder={this.props.placeholder} 
          inputAlign={"left"}
          validateFunction={this.props.validateFunction}
          // initValue={this.props.initValue}
        />
      </View>
    )
  }
}

export default React.memo(() => {

  const {goBack, getParam} = useNavigation()

  const lnameRef = React.useRef(null)
  const fnameRef = React.useRef(null)
  const emailRef = React.useRef(null)
  const indexRef = React.useRef(null)

  const onSubmit = React.useCallback(() => {

    const lastName = lnameRef.current.getText()
    const firstName = fnameRef.current.getText()
    const email = emailRef.current.getText()
    const index = indexRef.current.getText()
    

    if (lastName == null) {
      Alert.alert("Oops!", "The last name is missing!")
      return
    }

    if (firstName == null) {
      Alert.alert("Oops!", "The first name is missing!")
      return
    }

    if (email == null) {
      Alert.alert("Oops!", "The mail is missing!")
      return
    }

    if (index == null) {
      Alert.alert("Oops!", "The index is missing!")
      return
    }

    const gameData = GameData.instance()

    const where = getParam("where")

    if (where === "C") {
      gameData.playerC = {
        name: firstName + "." + lastName,
        email,
        index
      }
    }
    else if (where === "D") {
      gameData.playerD = {
        name: firstName + "." + lastName,
        firstName,
        email,
        index
      }
    }

    goBack()
  }, [])

  return (
    <BaseComponent>
      <Header />
      <Input 
        ref={lnameRef}
        title={"Last name"} 
        placeholder={"Enter last name"}
      />
      <Input 
        ref={fnameRef}
        title={"First name"} 
        placeholder={"Enter first name"}
      />
      <Input ơ
        ref={emailRef}
        title={"Mail"} 
        validateFunction={emailValidationFunction}
        placeholder={"Enter mail"}
      />
      <Input 
        ref={indexRef}
        title={"Index"} 
        placeholder={"Enter index"} 
      />
      <View style={{width: "60%", alignSelf: 'center', marginTop: 24}}>
        <SelectItem 
          value={"Submit"} 
          tint={Theme.buttonPrimary} 
          onPress={onSubmit} 
        />
      </View>
      
    </BaseComponent>
  )
})