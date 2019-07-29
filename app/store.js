import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import placeReducer from './reducers/placeReducer'
import countriesReducer from './reducers/countriesReducer'
import regionsReducer from './reducers/regionsReducer'
import clubsReducer from './reducers/clubsReducer'
import authenticationReducer from './reducers/authenticationReducer'
import challengesReducer from './reducers/challengesReducer'

const rootReducer = combineReducers({
  places: placeReducer,
  countries: countriesReducer,
  regions: regionsReducer,
  clubs: clubsReducer,
  authentication: authenticationReducer,
  challenges: challengesReducer
})

export default configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk))
}