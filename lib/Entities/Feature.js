import Entity, { Types } from "../Base/Entity";
import PathConstructor from "../Utilities/PathConstructor";
const path = new PathConstructor([
  "users",
  ":organisationId|orgId:",
  "projects",
  ":projectSlug|projectguid|projectId:",
  "features",
  ":featureId|id|guid:"
]);

export default class Feature extends Entity {
  constructor(http, auth, horizon, props) {
    super(http, auth, horizon, props);

    this.structure = {
      id: Types.Integer,
      guid: Types.UUID,
      name: Types.String
      // comments: [Comment]
    };

    this.obj = props ? super.strip(this) : null;
  }

  async retrieve(identifier = {}) {
    if (this.obj) {
      this.emit("from_object", "cached entity");
      return super.strip(this.obj);
    }

    Object.keys(identifier).forEach(k => (this[k] = identifier[k]));

    const object = await super.retrieve(path.construct(identifier));

    // retrieve the object; bind the right values; return a new instance
    const project = new Project(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });

    return project;
  }

  async create(data) {
    const object = await super.create(path.construct(data), data);
    return new Feature(this.http, this.auth, this.horizon, {
      ...object
    });
  }

  async update(identifier = {}, data) {
    Object.keys(identifier).forEach(k => (this[k] = identifier[k]));

    // construct path
    const object = await super.update(path.construct(identifier), data);
    return new Feature(this.http, this.auth, this.horizon, {
      ...super.strip(object)
    });
  }

  async save() {
    // construct path
    return super.save(path.construct(this));
  }

  async delete(identifier = {}) {
    Object.keys(identifier).forEach(k => (this[k] = identifier[k]));

    return super.delete(path.construct({ ...identifier, ...this }));
  }

  async vote(identifer = {}) {
    const p = new PathConstructor([
      "organisations",
      ":organisationId|orgId:",
      "projects",
      ":projectSlug|projectguid|projectId:",
      "features",
      ":featureId|id|guid:"
    ]);

    return super.create(`${p.construct({ ...this, ...identifer })}/votes`, {});
  }
}
