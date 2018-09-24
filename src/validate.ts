import { ValidateFunction } from "ajv";

import { JSONValue } from "./types";

export type Errors = Array<{ message: string; path: string }>;

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
