import { resolve } from "path";

import { JSONObject, JSONScalar, JSONValue } from "./json";
import { read, readSchema } from "./read";
import { reduceKeys } from "./utils";
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

const toProvider = (
  { environment = {}, options, type }: RawProvider,
  currentEnvironment: string
): Provider => {
  const environmentOptions = environment[currentEnvironment] || {};

  return { options: { ...options, ...environmentOptions }, type };
};

const toProviders = (
  rawProviders: RawProviders,
  currentEnvironment: string
): Providers => {
  const providers = {
    default: toProvider(rawProviders.default, currentEnvironment)
  };

  return reduceKeys<Providers>(
    rawProviders,
    (result, providerName) => {
      if (providerName !== "default") {
        const rawProvider = rawProviders[providerName];

        result[providerName] = toProvider(rawProvider, currentEnvironment);
      }

      return result;
    },
    providers
  );
};

const toConfiguration = ({
  defaultEnvironment,
  environmentVariable,
  packageManager,
  providers
}: RawConfiguration): Configuration => {
  const currentEnvironment =
    process.env[environmentVariable] || defaultEnvironment;

  return {
    defaultEnvironment,
    environmentVariable,
    packageManager,
    providers: toProviders(providers, currentEnvironment)
  };
};

export const load = (filePath: string): Configuration => {
  const data: JSONValue = read(filePath);
  const rawConfigurationErrors: Errors = validate(readSchema(schemaPath), data);

  if (!isRawConfiguration(data, rawConfigurationErrors)) {
    throw new ValidationError(rawConfigurationErrors);
  }

  return toConfiguration(data);
};
