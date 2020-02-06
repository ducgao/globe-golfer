import { GET_AVATAR } from "../Endpoints"

export default class SimpleMatchResultBinder {
  bind(input) {
    try {
      const data = input.data 
      return {
        from: {
          avatar: data.profileUserFirst.avatar ? GET_AVATAR.replace("{id}", data.profileUserFirst.avatar) : null,
          name: data.profileUserFirst.first_name,
          lastName: data.profileUserFirst.last_name
        },
        to: {
          avatar: data.profileUserSecond.avatar ? GET_AVATAR.replace("{id}", data.profileUserSecond.avatar) : null,
          name: data.profileUserSecond.first_name,
          lastName: data.profileUserSecond.last_name
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