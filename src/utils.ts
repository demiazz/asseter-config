import Ajv from "ajv";
import { readFileSync } from "fs";

export const readJSON = (fileName: string): JSON => {
  const content = readFileSync(fileName, { encoding: "utf8" });

  return JSON.parse(content) as JSON;
};

export const readSchema = (fileName: string): Ajv.ValidateFunction => {
  const definition = readJSON(fileName);
  const schema = new Ajv({
    allErrors: true,
    jsonPointers: false,
  });

  return schema.compile(definition);
};

class ValidationError extends Error {
  constructor(errors: Ajv.ErrorObject[]) {
    super();

    this.message = errors.reduce<string[]>(
      (messages: string[], error: Ajv.ErrorObject) => {
        messages.push(`configuration${error.dataPath} ${error.message}\n`);

        return messages;
      },
      ["Asseter Invalid Configuration\n\n"]
    ).join('').trim();

    Error.captureStackTrace(this, this.constructor);
  }
}

export const validate = (
  schemaFileName: string,
  configurationFileName: string
): void => {
  const schema = readSchema(schemaFileName);
  const configuration = readJSON(configurationFileName);

  if (!schema(configuration)) {
    throw new ValidationError(schema.errors || []);
  }
};
