import { resolve } from "path";

import { read } from "./read";
import { JSONValue, RawConfiguration } from "./types";
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

  const rawConfiguration: RawConfiguration = data;

  return rawConfiguration;
};
