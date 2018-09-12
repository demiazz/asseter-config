import { readSchema } from "./read";

interface IValidationError {
  path: string;
  message: string;
}

export const validate = (
  definition: string | JSON,
  data: JSON
): IValidationError[] => {
  const schema = readSchema(definition);

  schema(data);

  return (schema.errors || []).map(({ dataPath, message = "" }) => ({
    message,
    path: dataPath
  }));
};
