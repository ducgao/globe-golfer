import { GET_AVATAR } from "../Endpoints"

export default class MessageBinder {
  bind(input) {
    try {

      const data = input.data 
      const preReturnValue = data.map(i => {
        return {
          first: {
            id: i.user_first_id,
            unread: i.unread_user_first
          },
          second: {
            id: i.user_second_id,
            unread: i.unread_user_second
          },
          name: i.name,
          avatar: i.avatar ? GET_AVATAR.replace("{id}", i.avatar) : null,
          id: i.conversationId,
          message: i.data_message,
          createAt: i.time
        }
      })

      preReturnValue.sort((a, b) => {
        const aTime = (Array.isArray(a.message) && a.message.length > 0) ? a.message[0].time : 0
        const bTime = (Array.isArray(b.message) && b.message.length > 0) ? b.message[0].time : 0

        return bTime - aTime
      })

      return preReturnValue
    }
    catch {
      return {
        result: false
      }
    }
  }
}