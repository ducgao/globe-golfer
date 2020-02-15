import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const Star = React.memo(({isActive, small, big, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <Icon 
        style={{ marginHorizontal: 2 }}
        name={"ios-star"} 
        color={isActive ? Theme.buttonPrimary : 'white'} 
        size={small ? 12 : (big ? 40 : 20)}
      />
    </TouchableOpacity>
  )
})

const CardRatingBar = React.memo(({small, big, star, onRatingChanged}) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Star isActive={1 <= star} small={small} big={big} onPress={() => {onRatingChanged && onRatingChanged(1)}} />
      <Star isActive={2 <= star} small={small} big={big} onPress={() => {onRatingChanged && onRatingChanged(2)}} />
      <Star isActive={3 <= star} small={small} big={big} onPress={() => {onRatingChanged && onRatingChanged(3)}} />
      <Star isActive={4 <= star} small={small} big={big} onPress={() => {onRatingChanged && onRatingChanged(4)}} />
      <Star isActive={5 <= star} small={small} big={big} onPress={() => {onRatingChanged && onRatingChanged(5)}} />
    </View>
  )
})

export default CardRatingBar