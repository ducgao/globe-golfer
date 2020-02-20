import { 
  GET_NOTIFICATIONS
} from '../actions/types'
import NotificationRepository from '../repository/NotificationRepository'

const initialState = {
  new: {
    1: {
      isLoading: false,
      data: null  
    },
    2: {
      isLoading: false,
      data: null  
    },
    3: {
      isLoading: false,
      data: null  
    },
    4: {
      isLoading: false,
      data: null  
    }
  },
  history: {
    1: {
      isLoading: false,
      data: null  
    },
    2: {
      isLoading: false,
      data: null  
    },
    3: {
      isLoading: false,
      data: null  
    },
    4: {
      isLoading: false,
      data: null  
    }
  }
}

export default notificcationReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_NOTIFICATIONS.NEW.BEGIN: {
      const tag = action.tag + 1
      const cloneNewState = {...state.new}

      cloneNewState[tag] = {
        ...cloneNewState[tag],
        isLoading: true
      }

      return {
        ...state,
        new: cloneNewState
      }
    }
    case GET_NOTIFICATIONS.HISTORY.BEGIN: {
      const tag = action.tag + 1
      const cloneHistoryState = {...state.history}

      cloneHistoryState[tag] = {
        ...cloneHistoryState[tag],
        isLoading: true
      }

      return {
        ...state,
        history: cloneHistoryState
      }
    }
    case GET_NOTIFICATIONS.NEW.FINISH: {
      NotificationRepository.instance().updateNotifications(action.payload)

      const tag = action.tag + 1
      const cloneNewState = {...state.new}

      cloneNewState[tag] = {
        data: action.payload,
        isLoading: false
      }

      return {
        ...state,
        new: cloneNewState
      }
    }
    case GET_NOTIFICATIONS.HISTORY.FINISH: {
      const tag = action.tag + 1
      const cloneHistoryState = {...state.history}

      cloneHistoryState[tag] = {
        data: action.payload,
        isLoading: false
      }

      return {
        ...state,
        history: cloneHistoryState
      }
    }
    default:
      return state
  }
}