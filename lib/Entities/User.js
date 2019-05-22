import Entity, { Types } from "../Base/Entity";
import Organisation from "./Organisation";

import PathConstructor from "../Utilities/PathConstructor";
const path = new PathConstructor(["users", ":id|slug|guid|userId:"]);

export default class User extends Entity {
  constructor(http, auth, horizon, props) {
    super(http, auth, horizon, props);

    this.structure = {
      id: Types.Integer,
      guid: Types.UUID,
      firstName: Types.String,
      lastName: Types.String,
      email: Types.String,
      password: Types.String,
      organisations: [Organisation],
      companyName: Types.String,
      displayName: Types.String,
      notificationSettings: Types.JSON,
      image: Types.JSON,
      imageObject: Types.JSON,
      visibility: Types.String
    };

    // enable quick responses from the entity
    this.obj = props ? super.strip(this) : null;
  }

  async retrieve(identifier = {}) {
    if (this.obj) {
      this.emit("from_object", "cached entity");
      return super.strip(this.obj);
    }

    const object = await super.retrieve(path.construct(identifier));

    // retrieve the object; bind the right values; return a new instance
    return new User(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });
  }

  async create(data) {
    const object = await super.create(path.construct(), data);
    return new User(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });
  }

  async update(identifier = {}, data) {
    // construct path
    const object = await super.update(path.construct(identifier), data);
    return new User(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });
  }

  async save() {
    // construct path
    return super.save(path.construct(this));
  }

  async delete(identifier = {}) {
    return super.delete(path.construct({ ...identifier, ...this }));
  }

  // added methods for specific entities

  // activate an email account
  async activate(token) {
    return super.update(`/activate-mail/${token}`, { token });
  }

  async resendActivation(identifer = {}) {
    return super.update(`${path.construct(identifer)}/resend-activation-mail`, {
      token
    });
  }

  async sendResetToken(email) {
    return super.create(`/reset-password`, { email });
  }

  async resetPassword(token, data) {
    return super.create(`/reset-password/${token}`, data);
  }

  async uploadPermissions({ userId }) {
    return super.create("/sign", { userId });
  }
}
