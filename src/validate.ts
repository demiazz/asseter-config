import { ValidateFunction } from "ajv";
import { resolve } from "path";

import { readSchema } from "./read";
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

const rootSchema = readSchema(resolve(__dirname, "../schema.json"));

export const validateRoot = (data: JSONValue): Errors =>
  validate(rootSchema, data);

export const newValidate = (
  schema: ValidateFunction,
  data: JSONValue,
  namespace?: string
): string[] => {
  schema(data);

  if (!schema.errors) {
    return [];
  }

  const root = namespace ? `root.${namespace}` : "root";
  const hash: Record<string, boolean> = {};
  const errors: string[] = [];

  for (const { dataPath, message } of schema.errors) {
    if (!message) {
      continue;
    }

    const key = `${dataPath}/${message}`;

    if (hash[key]) {
      continue;
    }

    errors.push(`${root}${dataPath} ${message}`);

    hash[key] = true;
  }

  return errors;
};
