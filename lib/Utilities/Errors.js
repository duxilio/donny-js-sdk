export class HTTPError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError);
    }

    this.response = params[0].response;

    this.name = "HTTPError";

    this.date = new Date();
  }
}

export default { HTTPError };
