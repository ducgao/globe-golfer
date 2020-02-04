export default class MessageRepository {
  static _instance = null
  static instance() {
      if (this._instance == null) {
          this._instance = new MessageRepository()
      }
      
      return this._instance
  }

  userId = 0
  messages = []
  subscriptions = []

  setUserId(id) {
    this.userId = id
  }

  addSubscription(s) {
    if (this.subscriptions.indexOf(s) >= 0) {
      return
    }

    this.subscriptions.push(s)

    s(this.getUnreadMessage())
  }

  removeSubscription(s) {
    const index = this.subscriptions.indexOf(s)

    if (index < 0) {
      return
    }

    this.subscriptions.splice(index, 1)
  }

  getUnreadMessage() {
    let returnValue = 0
    this.messages.forEach(m => {
      if (m.first.id == this.userId) {
        returnValue += m.first.unread != 0 ? 1 : 0
      } else {
        returnValue += m.second.unread != 0 ? 1 : 0
      }
    })

    return returnValue
  }

  updateMessages(m) {
    if (!Array.isArray(m)) {
      return
    }

    this.messages = m

    this.subscriptions.forEach(s => s(this.getUnreadMessage()))
  }
}