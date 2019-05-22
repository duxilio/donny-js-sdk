export default class Dispatcher {
  constructor(horizon) {
    this.events = horizon || new Horizon();
  }

  emit(event, ...args) {
    const callbacks = [
      ...this.events.getEvent(event),
      ...this.events.getEvent("*")
    ];
    if (callbacks.length) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  on(event, callback) {
    this.events.setEvent(event, callback);
  }

  remove(event) {
    this.events.void(event);
  }
}

export class Horizon {
  constructor() {
    this.events = {};
  }

  getEvent(type) {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    return this.events[type] || [];
  }

  setEvent(type, callback) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(callback);
  }
}
