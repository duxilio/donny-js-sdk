import Entity, { Types } from "../Base/Entity";

import PathConstructor from "../Utilities/PathConstructor";

const path = new PathConstructor([
  "organisations",
  ":organisationId|orgId:",
  "projects",
  ":projectSlug|projectguid|projectId:",
  "features",
  ":featureId|id|guid:",
  "donations",
  ":donationId|dId:"
]);

export default class Donation extends Entity {
  constructor(http, auth, horizon, props) {
    super(http, auth, horizon, props);

    this.structure = {
      id: Types.Integer,
      userId: Types.Integer
    };

    this.obj = props ? super.strip(this) : null;
  }

  async create(data) {
    const object = await super.create(path.construct(data), data);
    return new Donation(this.http, this.auth, this.horizon, {
      ...object
    });
  }

  async save() {
    // construct path
    return super.save(path.construct(this));
  }

  async update(identifier = {}, data) {
    // construct path
    const object = await super.update(path.construct(identifier), data);
    return new Donation(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });
  }
}
