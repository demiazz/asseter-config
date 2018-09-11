import { ErrorObject } from "ajv";
import { resolve } from "path";

import { readSchema } from "./read";

const formatErrors = (root: string, errors: ErrorObject[]): string[] => {
  return errors.map(
    ({ dataPath, message }) => `${root}${dataPath}: ${message}`
  );
};

export const validate = (data: JSON): string[] => {
  const schema = readSchema(resolve(__dirname, "../schema.json"));

  schema(data);

  return formatErrors("configuration", schema.errors || []);
};
