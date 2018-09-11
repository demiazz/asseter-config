import { ErrorObject, ValidateFunction } from "ajv";
import { resolve } from "path";

import { readSchema } from "./read";

const formatErrors = (root: string, errors: ErrorObject[]): string[] => {
  return errors.map(
    ({ dataPath, message }) => `${root}${dataPath}: ${message}`
  );
};

const validatePath = (schema: ValidateFunction, data: JSON): string[] => {
  schema(data);

  return formatErrors("configuration", schema.errors || []);
};

export const validate = (data: JSON): string[] => {
  const schema = readSchema(resolve(__dirname, "../schema.json"));

  return validatePath(schema, data);
};
