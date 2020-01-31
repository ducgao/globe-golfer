import React from 'react'
import {
  View,
  TextInput,
  Alert
} from 'react-native'

import Modal from 'react-native-modal'
import DGText from '../../../components/DGText'
import TextInputBlockV2 from '../../../components/TextInputBlockV2'
import DGButtonV2 from '../../../components/DGButtonV2'
import Theme from '../../../res/Theme'
import Strings from '../../../res/Strings'

export default React.memo(({visible, initValue, onRequestOK}) => {

  const [state, setState] = React.useState({
    f: initValue[0],
    l: initValue[1]
  })

  return (
    <Modal
      isVisible={visible}
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View style={{
        borderRadius: 8,
        backgroundColor: 'white',
        width: '90%',
        paddingVertical: 12
      }}>
        <DGText style={{
          fontSize: 20,
          marginHorizontal: 16,
          fontWeight: 'bold',
        }}>Fist name</DGText>
        <TextInput
          style={{
            marginTop: 4,
            marginHorizontal: 16,
            minHeight: 50,
          }}
          value={state.f}
          onChangeText={text => setState({...state, f: text})}
          multiline={true}
          placeholder={"Enter your first name"} 
        />
        <DGText style={{
          fontSize: 20,
          marginHorizontal: 16,
          fontWeight: 'bold',
        }}>Last name</DGText>
        <TextInput
          style={{
            marginTop: 4,
            marginHorizontal: 16,
            minHeight: 50,
          }}
          value={state.l}
          onChangeText={text => setState({...state, l: text})}
          multiline={true}
          placeholder={"Enter your last name"} 
        />
        <DGButtonV2
          style={{ 
            width: '90%',
            marginTop: 4,
            backgroundColor: Theme.buttonPrimary 
          }}
          text={"OK"}
          onPress={() => {
            if (state.f.trim() === "" || state.l.trim() === "") {
              Alert.alert("Oops!", "Your first name of last name must not be empty")
              return
            }
            onRequestOK([state.f.trim(), state.l.trim()])
          }}
          />
      </View>
      
    </Modal>
  )
})