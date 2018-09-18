import { ErrorObject } from "ajv";

import { readSchema } from "./read";
import { JSONValue } from "./types";
import { getByPath } from "./utils";

type Errors = Array<{ message: string; path: string }>;

const processErrors = (errors: ErrorObject[], path: string[]): Errors => {
  const prepend = path.length > 0 ? `.${path.join(".")}` : "";

  return errors.map(({ dataPath, message = "" }) => ({
    message,
    path: `${prepend}${dataPath}`
  }));
};

export const validate = (
  definition: string,
  data: JSONValue,
  path: string[] = []
): Errors => {
  const schema = readSchema(definition);

  schema(getByPath(data, path));

  return processErrors(schema.errors || [], path);
};
