// simple tunnel, which wraps multitude to simplytude
export default class EntityConnector {
  get list() {
    return this.objects;
  }

  constructor(objects, objectType, entityProps) {
    this.objects = objects;
    this.objectType = objectType;
    this.entityProps = entityProps;
  }

  filter(query) {
    const object = this.objects.filter(object => {
      Object.keys(query).map(key => {
        if (object[key] !== query[key]) {
          return false;
        }
      });
      return true;
    })[0];
    return object;
  }

  async retrieve(query = {}, opts = {}) {
    const options = { shallow: true, ...opts };

    // default behaviour, fetches a shallow copy
    if (options.shallow) {
      const object = this.filter(query);
      return object || null;
    }

    // when option shallow is disabled, we'll fetch the actual deep copy
    const entity = new this.objectType(...this.entityProps);
    const object = await entity.retrieve(query);
    return object;
  }

  async create(data) {
    const entity = new this.objectType(...this.entityProps);
    const obj = await entity.create(data);
    this.create.objects.push(obj);
    return obj;
  }

  async update(query, data) {
    const object = this.filter(query);
    return object.update(data);
  }
}
