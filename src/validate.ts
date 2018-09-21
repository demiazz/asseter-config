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

  if (!schema.errors) {
    return [];
  }

  const errors: Errors = [];
  const hash: Record<string, boolean> = {};

  for (const { dataPath: path, message } of schema.errors) {
    if (!message) {
      continue;
    }

    const key = `${path}/${message}`;

    if (hash[key]) {
      continue;
    }

    errors.push({ message, path });

    hash[key] = true;
  }

  return errors;
};
