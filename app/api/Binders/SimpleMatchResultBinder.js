import { GET_AVATAR } from "../Endpoints"

export default class SimpleMatchResultBinder {
  bind(input) {
    try {
      const data = input.data 
      return {
        from: {
          avatar: data.profileUserFirst.avatar ? GET_AVATAR.replace("{id}", data.profileUserFirst.avatar) : null
        },
        to: {
          avatar: data.profileUserSecond.avatar ? GET_AVATAR.replace("{id}", data.profileUserSecond.avatar) : null
        },
        score1: data.scoreUserFirst,
        score2: data.scoreUserSecond
      }
    }
    catch {
      return {
        result: false
      }
    }
  }
}