import { ValidateFunction } from "ajv";

import { JSONValue } from "./types";

export const validate = (
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
