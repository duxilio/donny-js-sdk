import Dispatcher from "./Dispatcher";
import EntityConnector from "./EntityConnector";
import { HTTPError } from "../Utilities/Errors";
export default class Entity extends Dispatcher {
  constructor(http, auth, horizon, props = {}) {
    super(horizon);
    Object.keys(props).forEach(key => (this[key] = props[key]));

    this.http = http;
    this.auth = auth;
    this.horizon = horizon;

    this.structure = {};
  }

  raw() {
    const resp = {};
    Object.keys(this.structure).forEach(key => (resp[key] = this[key]));
    return resp;
  }

  strip(obj) {
    const object = { ...obj, obj: null };
    delete object.obj;
    return object;
  }

  async create(path, data) {
    try {
      this.emit("create_entity", path);
      const authHeader = await this.auth.getHeader();

      const { data: entity } = await this.http.request("post", path, {
        headers: {
          Authorization: authHeader
        },
        data
      });

      return entity;
    } catch (e) {
      throw new HTTPError(e);
    }
  }

  async retrieve(path) {
    try {
      this.emit("fetch_entity", path);
      const authHeader = await this.auth.getHeader();

      const { data: entity } = await this.http.request("get", path, {
        headers: {
          Authorization: authHeader
        }
      });

      Object.keys(this.structure).forEach(key => {
        const isArray = Array.isArray(this.structure[key]);
        const type = isArray ? this.structure[key][0] : this.structure[key];

        if (!isArray) {
          if (typeof type === "function") {
            const obj = new type(this.http, this.auth, this.horizon, {
              ...object[key]
            });

            entity[key] = obj;
            return;
          }
          return;
        }

        entity[key] = entity[key].map(ob => {
          return new type(this.http, this.auth, this.horizon, {
            ...ob
          });
        });

        entity[type.name] = new EntityConnector(entity[key], type, [
          this.http,
          this.auth,
          this.horizon
        ]);
        this.structure[type.name] = "type.generated";
        this.emit("connect_entity", {
          name: type.name,
          items: entity[key].length
        });
      });

      Object.keys(this.structure).map(k => (this[k] = entity[k] || this[k]));
      return entity;
    } catch (e) {
      // do something with the error
      throw new HTTPError("retrieve unsuccesfull", "entity");
      console.log(e);
    }
  }

  async __retrieve(path) {
    try {
      const authHeader = await this.auth.getHeader();
      const { data: entity } = await this.http.request("get", path, {
        headers: {
          Authorization: authHeader
        }
      });
      return entity;
    } catch (e) {
      console.log(e);
    }
  }

  async update(path, data) {
    try {
      this.emit("update_entity", path);
      const authHeader = await this.auth.getHeader();

      const { data: entity } = await this.http.request("PUT", path, {
        headers: {
          Authorization: authHeader
        },
        data
      });

      return entity;
    } catch (e) {
      console.log(e);
    }
  }

  async delete(path) {
    try {
      this.emit("delete_entity", path);
      const authHeader = await this.auth.getHeader();

      const { data: entity } = await this.http.request("DELETE", path, {
        headers: {
          Authorization: authHeader
        }
      });

      return entity;
    } catch (e) {
      console.log(e);
    }
  }

  // if the entity is an entity you can save it :shrug:
  async save(path) {
    try {
      this.emit("save_entity", path);
      const authHeader = await this.auth.getHeader();

      const { data: entity } = await this.http.request("PUT", path, {
        headers: {
          Authorization: authHeader
        },
        data: this.raw()
      });

      return this;
    } catch (e) {
      console.log(e);
    }
  }

  // Entity Methods
}

// simple types
export const Types = {
  String: "type.string",
  Integer: "type.integer",
  Float: "type.float",
  Boolean: "type.boolean",
  UUID: "type.uuid"
};
