import { readSchema } from "./read";
import { JSONValue } from "./types";

interface IValidationError {
  path: string;
  message: string;
}

export const validate = (
  definition: string,
  data: JSONValue
): IValidationError[] => {
  const schema = readSchema(definition);

  schema(data);

  return (schema.errors || []).map(({ dataPath, message = "" }) => ({
    message,
    path: dataPath
  }));
};
