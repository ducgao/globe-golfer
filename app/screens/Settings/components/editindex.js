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

  const [state, setState] = React.useState(initValue)

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
        }}>Index</DGText>
        <TextInput
          style={{
            marginTop: 4,
            marginHorizontal: 16,
            minHeight: 100,
          }}
          value={state}
          onChangeText={text => setState(text)}
          keyboardType='decimal-pad'
          multiline={true}
          placeholder={"Enter your index"} 
        />
        <DGButtonV2
          style={{ 
            width: '90%',
            marginTop: 4,
            backgroundColor: Theme.buttonPrimary 
          }}
          text={"OK"}
          onPress={() => {
            if (state < -4 || state > 54) {
              Alert.alert("Oops!", "The index you just entered is not valid, please enter the index in range from -4.0 to 54.0")
              return
            }
            onRequestOK(state)
          }}
          />
      </View>
      
    </Modal>
  )
})