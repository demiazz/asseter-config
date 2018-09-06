import { ErrorObject } from "ajv";

import { read, readSchema } from './read';

export class ValidationError extends Error {
  constructor(errors: ErrorObject[]) {
    super();

    this.message = errors
      .reduce<string[]>(
        (messages: string[], error: ErrorObject) => {
          messages.push(`configuration${error.dataPath} ${error.message}\n`);

          return messages;
        },
        ["Asseter Invalid Configuration\n\n"]
      )
      .join("")
      .trim();

    Error.captureStackTrace(this, this.constructor);
  }
}

export const validate = (
  schemaFileName: string,
  configurationFileName: string
): void => {
  const schema = readSchema(schemaFileName);
  const configuration = read(configurationFileName);

  if (!schema(configuration)) {
    throw new ValidationError(schema.errors || []);
  }
};
