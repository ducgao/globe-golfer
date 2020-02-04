import React, { PureComponent } from 'react'
import { StyleSheet, View, ActivityIndicator, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'

import Theme from '../../res/Theme'

import Header from './components/Header'
import TinderMode from './components/TinderMode'
import GridMode from './components/GridMode'
import { getChallenges } from '../../actions/getChallenges';
import DGText from '../../components/DGText'


class Challenge extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    isGridMode: false,
    showingItemIndex: undefined
  }

  componentDidMount() {
    this.props.getChallenges()
  }

  onViewModeChanged = () => {
    this.setState({
      isGridMode: !this.state.isGridMode
    })
  }

  onCardBasicInfoPress = (index, item) => {
    const theIndex = this.props.challenges.data.indexOf(item);
    
    this.setState({
      isGridMode: false,
      showingItemIndex: theIndex
    })
  }

  renderContent() {
    if (this.props.challenges.isLoading || this.props.challenges.data == null) {
      return <ActivityIndicator style={{ alignSelf: 'center' }} size='large' color='white' />
    }

    if (Array.isArray(this.props.challenges.data) && this.props.challenges.data.length == 0) {
      return <DGText style={{
        color: 'white'
      }}>There is no player around you :(</DGText>
    }

    if (this.state.isGridMode) {
      return <GridMode data={this.props.challenges.data} onItemSelected={this.onCardBasicInfoPress} /> 
    }
    else {
      return (
        <TinderMode 
          data={this.props.challenges.data} 
          showingItemIndex={this.state.showingItemIndex} 
          onReload={() => {
            this.setState({showingItemIndex: 0})
            this.props.getChallenges()
          }}
        />
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header isOn={this.state.isGridMode} onViewModeChanged={this.onViewModeChanged} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {this.renderContent()}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.mainBackground
  }
})

const mapStateToProps = (state) => ({
  challenges: state.challenges
})

const mapDispatchToProps = (dispatch) => ({
  getChallenges: () => dispatch(getChallenges())
})

export default connect(mapStateToProps, mapDispatchToProps)(Challenge)