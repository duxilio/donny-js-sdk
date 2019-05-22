import Entity, { Types } from "../Base/Entity";

import Feature from "./Feature";

import PathConstructor from "../Utilities/PathConstructor";
const path = new PathConstructor([
  "users",
  ":organisationId|orgId:",
  "projects",
  ":guid|id|projectId:"
]);
export default class Project extends Entity {
  constructor(http, auth, horizon, props) {
    super(http, auth, horizon, props);

    this.structure = {
      id: Types.Integer,
      guid: Types.UUID,
      name: Types.String,
      Features: [Feature]
    };

    this.obj = props ? super.strip(this) : null;
  }

  async retrieve(identifier = {}) {
    if (this.obj) {
      this.emit("from_object", "cached entity");
      return super.strip(this.obj);
    }

    const object = await super.retrieve(path.construct(identifier));

    // retrieve the object; bind the right values; return a new instance
    const project = new Project(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });

    return project;
  }

  async create(data) {
    const x = path.construct(data);
    console.log(x, data);
    const object = await super.create(x, data);
    return new Project(this.http, this.auth, this.horizon, {
      ...object
    });
  }

  async update(identifier = {}, data) {
    // construct path
    const object = await super.update(path.construct(identifier), data);
    return new Project(this.http, this.auth, this.horizon, {
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
}
