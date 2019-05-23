// since we don't have anything usefull to extend, we'll just extend the dispatcher so we have access to events
import Dispatcher from "./Dispatcher";

class MemoryStore {
  constructor() {
    this.prefix = Date.now();
    this.store = {};
  }

  async setItem(key, value) {
    this.store[this.prefix + key] = value;
  }
  async getItem(key) {
    return this.store[this.prefix + key];
  }
  async removeItem() {
    delete this.store[this.prefix + key];
  }
  async clear() {
    this.store = {};
  }
}

/*
  The token store does object manipulation and storing, it does not checking of values
*/
export default class TokenStore extends Dispatcher {
  constructor(config, horizon) {
    super(horizon);
    this.config = config;

    this.storage = config.store === "mem" ? new MemoryStore() : null;
  }

  getStorage() {
    return this.storage || localStorage;
  }

  async getToken() {
    const token = await this.getStorage().getItem(
      `${this.config.provider || "donny"}.${this.config.identifier || "auth"}`
    );
    if (!token) {
      return false;
    }
    return JSON.parse(token);
  }

  // unix time gets handled in ms, token time happens in s; simply fix it by doing it *1000
  fixTokenTime(time) {
    return time * 1000;
  }

  // decodes the actual token
  decodeToken(token) {
    const now = Date.now();
    const response = { token };

    // spit the token in it's parts
    const [header, payload, signature] = token.split(".");

    const data = JSON.parse(Buffer.from(payload, "base64").toString());

    response.user = { ...data };

    response.expires_at = now + this.fixTokenTime(data.exp - data.iat);

    return response;
  }

  // before wringing, we'll expand it with the propper information
  expandTokenObject(token) {
    const response = { ...token };
    ["access_token", "refresh_token"].forEach(
      key => (response[key] = token[key] ? this.decodeToken(token[key]) : {})
    );

    return response;
  }

  async writeToken(token) {
    const auth = this.expandTokenObject(token);
    await this.getStorage().setItem(
      `${this.config.provider || "donny"}.${this.config.identifier || "auth"}`,
      JSON.stringify(auth)
    );
    return auth;
  }

  async wipe() {
    await this.getStorage().clear();
  }
}
