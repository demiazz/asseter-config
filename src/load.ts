import { resolve } from "path";

import { JSONValue } from "./json";
import { read } from "./read";
import { RawConfiguration } from "./types";
import { Errors, validate, ValidationError } from "./validate";

const schemaPath = resolve(__dirname, "../schema.json");

const isRawConfiguration = (
  _: JSONValue,
  errors: Errors
): _ is RawConfiguration => {
  return errors.length === 0;
};

export const load = (filePath: string): RawConfiguration => {
  const data: JSONValue = read(filePath);
  const rawConfigurationErrors: Errors = validate(schemaPath, data);

  if (!isRawConfiguration(data, rawConfigurationErrors)) {
    throw new ValidationError(rawConfigurationErrors);
  }

  return data;
};
