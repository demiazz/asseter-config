import { read, readSchema } from "./read";
import { ValidationError } from "./validate";

export const validate = (
  schemaFileName: string,
  configurationFileName: string
): void => {
  const schema = readSchema(schemaFileName);
  const configuration = read(configurationFileName);

  if (!schema(configuration)) {
    throw new ValidationError(
      (schema.errors || []).map(({ dataPath, message = "" }) => ({
        message,
        path: dataPath
      }))
    );
  }
};
