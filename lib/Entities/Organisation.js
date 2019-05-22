import Entity, { Types } from "../Base/Entity";
import Project from "./Project";

import PathConstructor from "../Utilities/PathConstructor";
const path = new PathConstructor([
  "organisation",
  ":id|slug|guid|organisationId|orgId:"
]);

export default class Organisation extends Entity {
  constructor(http, auth, horizon, props) {
    super(http, auth, horizon, props);

    this.structure = {
      id: Types.Integer,
      guid: Types.UUID,
      name: Types.String,
      Projects: [Project]
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
    return new Organisation(this.http, this.auth, this.horizon, {
      ...object
    });
  }

  async create(data) {
    const object = await super.create(path.construct(), data);
    return new Organisation(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });
  }

  async update(identifier = {}, data) {
    // construct path
    const object = await super.update(path.construct(identifier), data);
    return new Organisation(this.http, this.auth, this.horizon, {
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

  // payouts, part of org, since it's not manipulateable in rest props

  async createStripeAccount(identifier = {}, data = {}) {
    const pc = new PathConstructor(["users", ":id|organisationId:", "payouts"]);
    return super.update(pc.construct(identifier), { ...data });
  }

  async payouts(identifier = {}) {
    const pc = new PathConstructor(["users", ":id|organisationId:", "payouts"]);
    return super.__retrieve(pc.construct(identifier));
  }
}
