import { create } from "axios";
import Dispatcher from "./Dispatcher";

export default class HTTP extends Dispatcher {
  constructor(config, horizon) {
    super(horizon);

    this.config = config;
    this.client = create({
      baseURL: config.api_uri,
      headers: {
        // api_version: config.api_version, // the server needs to suppor this for cors
        // donny_header: `${config.api_version}-js-sdk`, // the server needs to support this for cors
        "content-type": "application/json"
      }
    });
  }

  request(method, url, options = {}) {
    return this.client.request({
      method,
      url,
      data: options.data || null,
      headers: { ...this.client.defaults.headers.common, ...options.headers }
    });
  }
}
