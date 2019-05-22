import * as Entities from "./Entities";

import Auth from "./Base/Auth";
import Dispatcher from "./Base/Dispatcher";
import HTTP from "./Base/HTTP";

class Donny extends Dispatcher {
  constructor(config, horizon) {
    super(horizon);
    this.config = config;

    // give the horizon some love.
    this.horizon = horizon;

    // setup the http insance, we'll use this for both the default module and the auth
    // this is a private instance; no reason to use this outside of the elements.
    this.__http = new HTTP(this.config, horizon);

    // as part of the Donny setup, we'll include Auth (other objects will automagically be included as entities)
    this.Auth = new Auth(this.__http, horizon);

    // initialize the modules;
    this.initializeEntities(Entities);
  }

  initializeEntities(entities) {
    for (let entity in entities) {
      this[entity] = new entities[entity](this.__http, this.Auth, this.horizon);
    }
  }
}

export default Donny;
