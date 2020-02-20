import { GET_CHALLENGES_BEGIN, GET_CHALLENGES_FINISH, GET_CHALLENGES_ERROR } from '../actions/types'

const initialState = {
  isLoading: false,
  data: null
}

export default challengesReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_CHALLENGES_BEGIN:
      return {
        ...state,
        isLoading: true
      }
    case GET_CHALLENGES_FINISH: 
      return {
        isLoading: false,
        data: action.payload
      }
    default:
      return state
  }
}