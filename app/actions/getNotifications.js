import { GET_NOTIFICATIONS } from './types'
import Api from '../api'

export const getNewNotificationsBegin = (tag) => {
  return {
    type: GET_NOTIFICATIONS.NEW.BEGIN,
    tag
  }
}

export const getNewNotificationsFinish = (notifications, tag) => {
  return {
    type: GET_NOTIFICATIONS.NEW.FINISH,
    payload: notifications,
    tag
  }
}

export const getNewNotificationsError = (error, tag) => {
  return {
    type: GET_NOTIFICATIONS.NEW.ERROR,
    payload: error,
    tag
  }
}

export const getHistoryNotificationsBegin = tag => {
  return {
    type: GET_NOTIFICATIONS.HISTORY.BEGIN,
    tag
  }
}

export const getHistoryNotificationsFinish = (notifications, tag) => {
  return {
    type: GET_NOTIFICATIONS.HISTORY.FINISH,
    payload: notifications,
    tag
  }
}

export const getHistoryNotificationsError = (error, tag) => {
  return {
    type: GET_NOTIFICATIONS.HISTORY.ERROR,
    payload: error,
    tag
  }
}

export function getNewNotifications(tag) {
  return function (dispatch) {
    dispatch(getNewNotificationsBegin(tag))
    return Api.instance()
      .getNewNotifications(tag)
      .then(notifications => dispatch(getNewNotificationsFinish(notifications, tag)))
      .catch(error => dispatch(getNewNotificationsError(error, tag)))
  }
}

export function getHistoryNotifications(tag) {
  return function (dispatch) {
    dispatch(getHistoryNotificationsBegin(tag))
    return Api.instance()
      .getHistoryNotifications(tag)
      .then(notifications => dispatch(getHistoryNotificationsFinish(notifications, tag)))
      .catch(error => dispatch(getHistoryNotificationsError(error, tag)))
  }
}