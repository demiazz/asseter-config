import { ErrorObject, ValidateFunction } from "ajv";

import { JSONValue } from "./json";
import { getByPath } from "./utils";

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

const processErrors = (errors: ErrorObject[], path: string[]): Errors => {
  const prepend = path.length > 0 ? `.${path.join(".")}` : "";

  return errors.map(({ dataPath, message = "" }) => ({
    message,
    path: `${prepend}${dataPath}`
  }));
};

export const validate = (
  schema: ValidateFunction,
  data: JSONValue,
  path: string[] = []
): Errors => {
  schema(getByPath(data, path));

  return processErrors(schema.errors || [], path);
};
