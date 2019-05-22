/*

  The pathconstructor will build the underlaying paths for the entity modeler
  it will take in props and map them to REST objects.

 */

export default class PathConstructor {
  // initialize
  constructor(schema) {
    this.schema = schema;
  }

  // construct the actual path
  construct(id = {}) {
    const parts = this.schema.map(chunk => {
      // it's a var
      if (chunk[0] === ":") {
        const p = chunk.replace(/:/g, "").split("|");
        const v = p.map(check => id[check]).filter(x => x);
        console.log(p, v);
        return v[0];
      }

      // it's not a var
      return chunk;
    });

    console.log(parts, "pathc");

    return `/${parts.join("/").replace(/\/$/, "")}`;
  }
}
