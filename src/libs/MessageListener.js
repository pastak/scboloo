export default class MessageListener {
  constructor (name) {
    this.name = name
    this.listeners = {}
  }
  add (action, func) {
    if (this.listeners[action]) {
      this.listeners[action].push(func)
    } else {
      this.listeners[action] = [func]
    }
  }

  listen (message, sender, sendResponse) {
    if (this.name && this.name !== message.target) return true
    const listeners = this.listeners[message.action]
    if (listeners && listeners.length > 0) {
      listeners.forEach((func) => func(message, sender, sendResponse))
    }
    return true
  }
}
