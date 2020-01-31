import { GET_AVATAR } from "../Endpoints"

export default class MatchInfoBinder {
  bind(input) {
    try {
      const data = input.data
      return data.map(i => {
        return {
          from: {
            id: i.id_user_from,
            name: i.name_user_from,
            lastName: i.lastName_user_from,
            index: i.index_user_from,
            avatar: i.avatar_user_from ? GET_AVATAR.replace("{id}", i.avatar_user_from) : null
          },
          to: {
            id: i.id_user_to,
            name: i.name_user_to,
            lastName: i.lastName_user_to,
            index: i.index_user_to,
            avatar: i.avatar_user_to ? GET_AVATAR.replace("{id}", i.avatar_user_to) : null
          },
          id: i.id_challenge
        }
      })
    }
    catch {
      return {
        result: false
      }
    }
  }
}