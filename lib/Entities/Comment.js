import Entity, { Types } from "../Base/Entity";

import PathConstructor from "../Utilities/PathConstructor";

const path = new PathConstructor([
  "organisations",
  ":organisationId|orgId:",
  "projects",
  ":projectSlug|projectguid|projectId:",
  "features",
  ":featureId|id|guid:",
  "comments",
  ":commentId|comId:"
]);

export default class Comment extends Entity {
  constructor(http, auth, horizon, props) {
    super(http, auth, horizon, props);

    this.structure = {
      id: Types.Integer,
      userId: Types.Integer
    };

    this.obj = props ? super.strip(this) : null;
  }

  async list(identifier = {}) {
    if (this.obj) {
      this.emit("from_object", "cached entity");
      return super.strip(this.obj);
    }

    Object.keys(identifier).forEach(k => (this[k] = identifier[k]));

    const objects = await super.__retrieve(path.construct(identifier));

    // retrieve the object; bind the right values; return a new instance
    const comments = objects.map(
      object =>
        new Comment(this.http, this.auth, this.horizon, {
          ...super.strip(object)
        })
    );

    return comments;
  }

  async create(data) {
    const object = await super.create(path.construct(data), data);
    return new Comment(this.http, this.auth, this.horizon, {
      ...object
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
}
