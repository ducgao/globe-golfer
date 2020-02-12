import React, { PureComponent } from 'react'
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import Theme from '../../res/Theme'

import Header from './components/Header'
import BaseComponent from '../../components/BaseComponent';
import Filter from './components/Filter';
import DGText from '../../components/DGText';
import { getAllRanking } from '../../actions/getRanking';
import LoadableImage from '../../components/LoadableImage'
import Ads from '../../components/Ads'

const AllPlayer = React.memo(({customName, isExpanded, requestToggleExpand, isLoading, data}) => {
  return <Board 
    title={customName ? customName : "ALL PLAYER"}
    isExpanded={isExpanded}
    isLoading={isLoading}
    data={data}
    requestToggleExpand={requestToggleExpand}
  />
})

const BoardHeader = React.memo(({title, isExpanded, requestToggleExpand}) => {
  const icon = isExpanded ? require('../../res/images/ic_down.png') : require('../../res/images/ic_right.png')
  return (
    <TouchableOpacity style={{ 
      flexDirection: 'row', 
      alignItems: 'center',
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical:12
      }} activeOpacity={0.7} onPress={requestToggleExpand}>
      <LoadableImage
        style={{
          width: 30, 
          height: 30, 
        }} 
        source={icon}
      />
      <DGText style={{ color: Theme.textWhite, marginHorizontal: 8 }} >{title}</DGText>
    </TouchableOpacity>
  )
})

const EmptyData = React.memo(() => {
  return <DGText style={{ color: Theme.textWhite, fontStyle: 'italic', marginHorizontal: 16 + 30 + 8, fontSize: 12 }}>Empty Data</DGText>
})

const RankingItem = React.memo(({item, isHeader}) => {
  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16, height: 44 }}>
      <DGText style={{ marginHorizontal: isHeader ? 0 : 8, color: Theme.textWhite }}>{item.index}</DGText>
      <DGText style={{ 
        flex: 1,
        marginHorizontal: isHeader ? 16 : 16, 
        fontWeight: isHeader ? 'normal' : 'bold',
        color: Theme.textWhite 
      }}>{item.name}</DGText>
      <DGText style={{ marginHorizontal: isHeader ? 0 : 8, color: Theme.textWhite }}>{item.total}</DGText>
    </View>
  )
})

const Ranking = React.memo(({data}) => {
  const items = data.map(item => <RankingItem key={`ranking-${item.index}`} item={item} />)
  const header = <RankingItem item={{
    index: "Pos",
    name: "Name",
    total: "Total"
  }} isHeader={true} />
  return (
    <>
      {header}
      {items}
    </>
  )
})

const Board = React.memo(({title, isExpanded, isLoading, data, requestToggleExpand}) => {

  let content = undefined;

  if (isExpanded) {
    if (isLoading || data == null) {
      content = <ActivityIndicator size='large' color={Theme.buttonPrimary} />
    }
    else {
      content = data.length == 0 ? <EmptyData /> : <Ranking data={data} />
    }
  }

  return (
    <>
      <BoardHeader title={title} isExpanded={isExpanded} requestToggleExpand={requestToggleExpand}/>
      {content}
    </>
  )
})

class LeaderBoard extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    tag: undefined,
    isAllExpand: true
  }

  onFilterChanged = (tag) => {
    if (this.state.isAllExpand) {
      this.props.getAllRanking(tag)
    }

    this.setState({ tag })
  }

  requestToggleExpandAll = () => {
    const newValue = !this.state.isAllExpand

    if (newValue == true) {
      this.props.getAllRanking(this.state.tag)
    }

    this.setState({ isAllExpand: newValue })
  }
  
  render() {
    return (
      <BaseComponent>
        <Header />
        <Filter onFilterChanged={this.onFilterChanged} />
        <ScrollView showsVerticalScrollIndicator={false} >
          <AllPlayer 
            // customName={this.props.allRankingData.data.name}
            isLoading={this.props.allRankingData.isLoading}
            data={this.props.allRankingData.data}
            isExpanded={this.state.isAllExpand} 
            requestToggleExpand={this.requestToggleExpandAll}
          />
        </ScrollView>
        <Ads />
      </BaseComponent>
    )
  }
}


const mapStateToProps = (state) => ({
  // favoriteRankingData: state.ranking.favorite,
  allRankingData: state.ranking.all
})

const mapDispatchToProps = (dispatch) => ({
  // getFavoriteRanking: (tag) => dispatch(getFavoriteRanking(tag)),
  getAllRanking: (tag) => dispatch(getAllRanking(tag))
})

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard)
