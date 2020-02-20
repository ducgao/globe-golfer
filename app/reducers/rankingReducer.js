import { GET_RANKING } from '../actions/types'

const initialState = {
  favorite: {
    isLoading: false,
    data: null
  },
  all: {
    isLoading: false,
    data: null
  }
}

export default raningReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_RANKING.FAVORITE.BEGIN:
      return {
        ...state,
        favorite: {
          ...state.favorite,
          isLoading: true
        }
      }
    case GET_RANKING.FAVORITE.FINISH: 
      return {
        ...state,
        favorite: {
          isLoading: false,
          data: action.payload
        }
      }
    case GET_RANKING.ALL.BEGIN:
      return {
        ...state,
        all: {
          ...state.all,
          isLoading: true
        }
      }
    case GET_RANKING.ALL.FINISH: 
      return {
        ...state,
        all: {
          isLoading: false,
          data: action.payload
        }
      }
    default:
      return state
  }
}