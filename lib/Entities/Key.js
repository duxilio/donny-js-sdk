import Entity, { Types } from "../Base/Entity";

import PathConstructor from "../Utilities/PathConstructor";

const path = new PathConstructor([
  "organisations",
  ":organisationId|orgId:",
  "keys",
  ":guid|id|tokenId|keyId:"
]);
export default class Key extends Entity {
  constructor(http, auth, horizon, props) {
    super(http, auth, horizon, props);

    this.structure = {
      id: Types.Integer,
      applicationName: Types.String,
      type: Types.String,
      publicKey: Types.String,
      privateKey: Types.String,
      organisationId: Types.Integer,
      status: Types.String
    };

    this.obj = props ? super.strip(this) : null;
  }

  // list
  async list(data) {
    return super.retrieve(path.construct(data));
  }

  async create(data) {
    const x = path.construct(data);
    const object = await super.create(x, data);
    return new Key(this.http, this.auth, this.horizon, {
      ...object
    });
  }

  async update(identifier = {}, data) {
    // construct path
    const object = await super.update(path.construct(identifier), data);
    return new Key(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });
  }

  async save() {
    // construct path
    return super.save(path.construct(this));
  }

  async delete(identifier = {}) {
    return super.delete(path.construct({ ...this, ...identifier }));
  }
}
