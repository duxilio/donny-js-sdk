import Dispatcher from "./Dispatcher";
import Store from "./Store";

class Auth extends Dispatcher {
  constructor(http, horizon, store = null) {
    // pass the horizon trough to the super
    super(horizon);

    // we're hooked up, let the world know.
    this.emit("auth_init", Date.now());

    // use the passed trough http instance (this will make sure we have the right config)
    this.http = http;

    // mem store auth object, so we don't have to do a round-trip to the store every request
    this.authObject = null;

    // initialize the store with the used horizon
    this.store =
      store ||
      new Store(
        { provider: "donny", identifier: "auth", store: http.config.store },
        horizon
      );
  }

  async login(email, password) {
    try {
      this.emit("create_token", { date: Date.now() });
      const { data: auth } = await this.http.request("post", `/oauth/token`, {
        data: { email, password, grant_type: "password" },
        headers: {}
      });

      this.authObject = await this.store.writeToken(auth);
      return this.authObject.access_token.user;
    } catch (e) {
      // do something with the error
      console.log(e);
    }
  }

  async mfa(token) {
    try {
      const access = await this.retrieve();
      console.log(access);
      this.emit("create_token", { date: Date.now() });
      const { data: auth } = await this.http.request("post", `/oauth/token`, {
        data: {
          guid: access.guid,
          token,
          grant_type: "mfa",
          access_token: this.authObject.access_token.token
        },
        headers: {}
      });

      this.authObject = await this.store.writeToken(auth);
      if (!this.authObject.access_token) {
        throw Error("unauth");
      }
      return this.authObject.access_token.user;
    } catch (e) {
      // do something with the error
      console.log(e);
    }
  }

  // login, from a token instead of a user object
  async setAuth(token) {
    this.authObject = this.store.writeToken(token);
  }

  async logout() {
    await this.store.wipe();
    this.emit("destroy_token", {});
    return;
  }

  async refresh() {
    try {
      this.emit("refresh_token", { date: Date.now() });

      const { data: auth } = await this.http.request("post", `/oauth/token`, {
        data: {
          refresh_token: this.authObject.refresh_token.token,
          grant_type: "refresh_token"
        },
        headers: {}
      });

      this.authObject = await this.store.writeToken(auth);
    } catch (e) {
      // do something with the error
      console.log(e);
    }
  }

  async isAuthenticated() {
    if (!this.authObject) {
      this.authObject = await this.store.getToken();
    }

    const auth = this.authObject;
    if (!auth) {
      return false;
    }

    const now = Date.now();
    if (auth.access_token.expires_at > now) {
      return true;
    }

    if (auth.refresh_token.expires_at > now) {
      try {
        await this.refresh();
        return true;
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  // returns the auth user object from the authentication token
  async retrieve() {
    const isAuthenticated = await this.isAuthenticated();
    if (isAuthenticated) {
      return this.authObject.access_token && this.authObject.access_token.user
        ? this.authObject.access_token.user
        : false;
    }

    return false;
  }

  // gets the header, if authenticated, refreshes if not. errors if not.
  async getHeader() {
    return (await this.isAuthenticated())
      ? `${this.authObject.token_type} ${this.authObject.access_token.token}`
      : null;
  }
}

export default Auth;
