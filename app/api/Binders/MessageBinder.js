import { GET_AVATAR } from "../Endpoints"

export default class MessageBinder {
  bind(input) {
    try {
      const data = input.data 
      const preReturnValue = data.map(i => {
        return {
          first: {
            id: i.user_first_id
          },
          second: {
            id: i.user_second_id
          },
          name: i.name,
          avatar: i.avatar ? GET_AVATAR.replace("{id}", i.avatar) : null,
          id: i.conversationId,
          message: i.data_message,
          createAt: i.time
        }
      })

      preReturnValue.sort((a, b) => b.message[0].time - a.message[0].time)

      return preReturnValue
    }
    catch {
      return {
        result: false
      }
    }
  }
}