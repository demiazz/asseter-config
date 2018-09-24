import { Errors } from "./validate";

export class ValidationError extends Error {
  constructor(errors: Errors) {
    super();

    this.message = errors
      .reduce(
        (messages, { message, path }) => {
          messages.push(`  root${path} ${message}`.trimRight());

          return messages;
        },
        ["Invalid configuration:"]
      )
      .join("\n");

    Error.captureStackTrace(this, this.constructor);
  }
}
