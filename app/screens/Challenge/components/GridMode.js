import React from 'react'
import { View, TextInput, FlatList, Dimensions, RefreshControl } from 'react-native'
import CardBasicInfo from './CardBasicInfo.gridmode'

const GridMode = React.memo(({data, onItemSelected, refreshing, onRefresh}) => {

  const [displayData, setDisplayData] = React.useState(data)

  const keyExtractor = (_, index) => "grid item " + index

  const renderItem = ({item, index}) => (
    <CardBasicInfo
      item={item}
      index={index}
      avatar={item.avatar} 
      name={item.name + " " + item.lastName[0]} 
      location={item.location} 
      rating={item.rating}
      onPress={onItemSelected}
    />
  );
  
  const onSearchKeywordChanged = (kw) => {
    const rs = []

    data.forEach(d => {
      if ((d.name + " " + d.lastName).toLowerCase().indexOf(kw.toLowerCase()) >= 0) {
        rs.push(d)
      }
    });

    setDisplayData(rs)
  }

  return (
    <View>
      <TextInput style={{
          marginHorizontal: 16,
          width: Dimensions.get('window').width - 32,
          height: 36,
          backgroundColor: Theme.buttonPrimary,
          borderRadius: 18,
          paddingHorizontal: 8,
          color: "white"
        }} 
        placeholder="Search..." 
        placeholderTextColor="white"
        onChangeText={onSearchKeywordChanged}
      />
      <FlatList 
        style={{ alignSelf: 'center' }}
        keyExtractor={keyExtractor}
        data={displayData}
        numColumns={2}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='white'
          />
        }
      />
    </View>
  )
})

export default GridMode