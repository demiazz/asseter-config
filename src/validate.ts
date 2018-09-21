import { ValidateFunction } from "ajv";

import { JSONValue } from "./json";

export type Errors = Array<{ message: string; path: string }>;

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

export const validate = (schema: ValidateFunction, data: JSONValue): Errors => {
  schema(data);

  return (schema.errors || []).map(({ dataPath: path, message = "" }) => ({
    message,
    path
  }));
};
