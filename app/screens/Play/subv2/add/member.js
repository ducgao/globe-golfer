import React from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import { getChallenges } from '../../../../actions/getChallenges'
import CardBasicInfo from '../../../Challenge/components/CardBasicInfo.gridmode';
import { connect } from 'react-redux'
import Header from '../comps/Header';
import BaseComponent from '../../../../components/BaseComponent';
import GameData from '../GameData'

class AddMember extends React.PureComponent {

  state = {
    keyword: null,
  }

  gameData = GameData.instance()
  displayData = []

  componentDidMount() {
    this.props.getChallenges()
  }

  keyExtractor = (_, index) => "grid item " + index

  renderItem = ({item, index}) => (
    <CardBasicInfo
      index={index}
      avatar={item.avatar} 
      name={item.name + " " + item.lastName[0]} 
      location={item.location} 
      rating={item.rating}
      onPress={(theIndex) => {
        const objectToCatch = this.displayData[theIndex]
        const player = {
          avatar: objectToCatch.avatar,
          name: objectToCatch.name,
          lastName: objectToCatch.lastName
        }

        const where = this.props.navigation.getParam('where')

        if (where === "A") {
          this.gameData.playerA = player
        }
        else if (where === "B") {
          this.gameData.playerB = player
        }
        else if (where === "C") {
          this.gameData.playerC = player
        }
        else if (where === "D") {
          this.gameData.playerD = player
        }
        
        this.props.navigation.goBack()
      }}
    />
  );

  isSameWithA(x) {
    return this.isSameWith(x, this.gameData.playerA)
  }

  isSameWithB(x) {
    return this.isSameWith(x, this.gameData.playerB)
  }

  isSameWithC(x) {
    return this.isSameWith(x, this.gameData.playerC)
  }

  isSameWithD(x) {
    return this.isSameWith(x, this.gameData.playerD)
  }

  isSameWith(x, t) {
    if (t) {
      return x.name == t.name && x.avatar == t.avatar
    }
    
    return false
  }

  renderContent() {
    if (this.props.challenges.isLoading || this.props.challenges.data == null) {
      return <ActivityIndicator style={{ marginTop: 40, alignSelf: 'center' }} size='large' color='white' />
    }

    const rawData= this.props.challenges.data
    this.displayData = []

    rawData.forEach(d => {
      if (this.state.keyword == null || d.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) >= 0) {
        const isSameWithOld = this.isSameWithA(d) || this.isSameWithB(d) || this.isSameWithC(d) || this.isSameWithD(d)
        if (!isSameWithOld) {
          this.displayData.push(d)
        }
      }      
    });
    
    return <FlatList 
      keyExtractor={this.keyExtractor}
      numColumns={2}
      renderItem={this.renderItem}
      data={this.displayData}
    />
  }

  onSearchKeywordChanged = (kw) => {
    if (kw === "") {
      this.setState({keyword: null})
      return
    }

    this.setState({keyword: kw})
  }

  render() {
    return (
      <BaseComponent>
        <Header withSearch onSearchKeywordChanged={this.onSearchKeywordChanged} />
        {this.renderContent()}
      </BaseComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  challenges: state.challenges
})

const mapDispatchToProps = (dispatch) => ({
  getChallenges: () => dispatch(getChallenges())
})

export default connect(mapStateToProps, mapDispatchToProps)(AddMember)