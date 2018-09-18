import { resolve } from "path";

import { JSONObject, JSONScalar, JSONValue } from "./json";
import { read } from "./read";
import { Errors, validate, ValidationError } from "./validate";

type ProviderOptions = Record<string, JSONScalar>;

interface Provider {
  options: ProviderOptions;
  type: string;
}

interface Providers extends Record<string, Provider> {
  default: Provider;
}

interface Configuration {
  defaultEnvironment: string;
  environmentVariable: string;
  packageManager: "npm" | "yarn";
  providers: Providers;
}

interface RawProvider extends JSONObject {
  environment?: Record<string, ProviderOptions>;
  options: ProviderOptions;
  type: string;
}

interface RawProviders extends Record<string, RawProvider> {
  default: RawProvider;
}

interface RawConfiguration extends JSONObject {
  defaultEnvironment: string;
  environmentVariable: string;
  packageManager: "npm" | "yarn";
  providers: RawProviders;
}

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
