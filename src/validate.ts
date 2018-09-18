import { readSchema } from "./read";
import { JSONValue } from "./types";

export const validate = (
  definition: string,
  data: JSONValue
): Array<{ message: string, path: string }> => {
  const schema = readSchema(definition);

  schema(data);

  return (schema.errors || []).map(({ dataPath, message = "" }) => ({
    message,
    path: dataPath
  }));
};
