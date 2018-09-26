import { ValidateFunction } from "ajv";
import { resolve } from "path";

import { extractFromEnvironment } from "./environment";
import { read, readSchema } from "./read";
import { Configuration, JSONValue, RawConfiguration } from "./types";
import { validate } from "./validate";
import { ValidationError } from "./validation-error";

const rootValidate = (data: JSONValue): RawConfiguration => {
  const schema = readSchema(resolve(__dirname, "../schema.json"));
  const errors = validate(schema, data);

  if (!isRawConfiguration(data, errors)) {
    throw new ValidationError(errors);
  }

  return data as RawConfiguration;
};

const isRawConfiguration = (
  _: JSONValue,
  errors: string[]
): _ is RawConfiguration => {
  return errors.length === 0;
};

const filterProviders = (
  configuration: RawConfiguration,
  allowedType: string
): void => {
  const allProvidersNames = Object.keys(configuration.providers);

  for (const providerName of allProvidersNames) {
    const { type } = configuration.providers[providerName];

    if (type !== allowedType) {
      delete configuration.providers[providerName];
    }
  }
};

const looseValidate = (
  { providers }: RawConfiguration,
  schema: ValidateFunction
): void => {
  const providersNames = Object.keys(providers);
  const errors: string[] = [];

  for (const providerName of providersNames) {
    const { options, environment } = providers[providerName];

    errors.push(
      ...validate(schema, options, `providers.${providerName}.options`)
    );

    if (!environment) {
      continue;
    }

    const environmentsNames = Object.keys(environment);

    for (const environmentName of environmentsNames) {
      errors.push(
        ...validate(
          schema,
          environment[environmentName],
          `providers.${providerName}.environment.${environmentName}`
        )
      );
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
};

const mergeOptions = ({
  defaultEnvironment,
  environmentVariable,
  providers
}: RawConfiguration): void => {
  const currentEnvironment =
    process.env[environmentVariable] || defaultEnvironment;

  const providersNames = Object.keys(providers);

  for (const providerName of providersNames) {
    const provider = providers[providerName];

    if (!provider.environment) {
      continue;
    }

    const overrides = provider.environment[currentEnvironment];

    if (!overrides) {
      continue;
    }

    provider.options = { ...provider.options, ...overrides };

    delete provider.environment;
  }
};

const strictValidate = (
  { providers }: RawConfiguration,
  schema: ValidateFunction
): void => {
  const providersNames = Object.keys(providers);
  const errors: string[] = [];

  for (const providerName of providersNames) {
    const { options } = providers[providerName];

    errors.push(
      ...validate(schema, options, `providers.${providerName}.options`)
    );
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
};

const mergeFromEnvironment = ({ providers }: RawConfiguration): void => {
  const providersNames = Object.keys(providers);

  for (const providerName of providersNames) {
    const provider = providers[providerName];
    const environmentOptions = extractFromEnvironment(providerName);

    provider.options = { ...provider.options, ...environmentOptions };
  }
};

export const load = (
  configurationPath: string,
  providerType: string,
  looseSchemaPath: string,
  strictSchemaPath: string
): Configuration => {
  const data = read(configurationPath);
  const looseSchema = readSchema(looseSchemaPath);
  const strictSchema = readSchema(strictSchemaPath);
  const configuration = rootValidate(data);

  filterProviders(configuration, providerType);
  looseValidate(configuration, looseSchema);
  mergeOptions(configuration);
  strictValidate(configuration, strictSchema);
  mergeFromEnvironment(configuration);
  strictValidate(configuration, strictSchema);

  return configuration;
};
