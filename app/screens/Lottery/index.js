import React, { PureComponent } from 'react'
import { FlatList, Dimensions, View, TouchableWithoutFeedback } from 'react-native'

import BaseComponent from '../../components/BaseComponent'
import LoadingModal from '../../components/LoadingModal'
import Api from '../../api'
import LoadableImage from '../../components/LoadableImage'
import Theme from '../../res/Theme'
import { useNavigation } from 'react-navigation-hooks'
import DGButtonV2 from '../../components/DGButtonV2'

const ITEM_WIDTH = Dimensions.get('window').width / 2
const Lottery = React.memo(({data}) => {

  const {navigate} = useNavigation()

  const onPress = React.useCallback(() => {
    navigate("LotteryDetail", {data: data})
  }, [])

  return (
    <TouchableWithoutFeedback style={{
      width: ITEM_WIDTH,
      height: ITEM_WIDTH,
    }} onPress={onPress}>
      <View style={{
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LoadableImage  
          style={{
            width: ITEM_WIDTH - 32,
            height: ITEM_WIDTH - 32,
            borderRadius: (ITEM_WIDTH - 32) / 2,
            backgroundColor: Theme.buttonPrimary
          }}
          source={{uri: data.image}}
        />
      </View>
    </TouchableWithoutFeedback>
  )
})

const Footer = React.memo(({id}) => {

  const [state, setState] = React.useState({loading: false})

  const {navigate} = useNavigation()

  const onGetTicket = React.useCallback(() => {
    setState({loading: true})
    Api.instance().getLotteryTicket(id).then(res => {
      setState({loading: false})
      if (res) {
        navigate("YouIn", {code: res})
      }
      else {
        alert("Can not get ticket, may you have gotten before. Please try again!")  
      }
    }).catch(_ => {
      navigate("YouIn", {code: "ABC-ACB-BAC"})
      // alert("Can not get ticket, may you have gotten before. Please try again!")
      setState({loading: false})
    })
  }, [])

  return (
    <View style={{paddingTop: 12}}>
      <DGButtonV2
          style={{ 
            width: Dimensions.get('window').width - 32,
            backgroundColor: Theme.buttonPrimary 
          }}
          text={"Get Ticket"}
          loading={state.loading}
          onPress={onGetTicket}
          />
    </View>
  )
})

export default class LotteryList extends PureComponent {
  static navigationOptions = { header: null }

  state = {
    loading: true,
    data: null
  }

  componentDidMount() {
    const id = this.props.navigation.getParam("id")
    Api.instance().getLotteryDetail(id).then(res => {
      this.setState({
        loading: false,
        data: res
      })
    })
  }

  renderItem = ({item}) => {
    return <Lottery data={item} />
  }

  keyExtractor = (_, index) => "lottery index: " + index

  render() {
    const id = this.props.navigation.getParam("id")

    return (
      <BaseComponent toolbar={{
        title: "Lottery",
        onBack: this.props.navigation.goBack,
      }}>
        <FlatList 
          keyExtractor={this.keyExtractor}
          data={this.state.data}
          renderItem={this.renderItem}
          numColumns={2}
        />
        <Footer id={id}/>
        <LoadingModal visible={this.state.loading} />
      </BaseComponent>
    )
  }
}