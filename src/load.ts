import { ValidateFunction } from "ajv";
import { resolve } from "path";

import { extractFromEnvironment } from "./environment";
import { read, readSchema } from "./read";
import { Configuration, JSONValue, RawConfiguration } from "./types";
import { validate } from "./validate";
import { ValidationError } from "./validation-error";

const isRawConfiguration = (
  _: JSONValue,
  errors: string[]
): _ is RawConfiguration => {
  return errors.length === 0;
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

export const load = (
  configurationPath: string,
  providerType: string,
  looseSchemaPath: string,
  strictSchemaPath: string
): Configuration => {
  const data = read(configurationPath);
  const rootSchema = readSchema(resolve(__dirname, "../schema.json"));
  const looseSchema = readSchema(looseSchemaPath);
  const strictSchema = readSchema(strictSchemaPath);

  const rootErrors = validate(rootSchema, data);

  if (!isRawConfiguration(data, rootErrors)) {
    throw new ValidationError(rootErrors);
  }

  const allProvidersNames = Object.keys(data.providers);

  for (const providerName of allProvidersNames) {
    const { type } = data.providers[providerName];

    if (type !== providerType) {
      delete data.providers[providerName];
    }
  }

  looseValidate(data, looseSchema);

  const currentEnvironment =
    process.env[data.environmentVariable] || data.defaultEnvironment;

  const providersNames = Object.keys(data.providers);

  for (const providerName of providersNames) {
    const provider = data.providers[providerName];

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

  strictValidate(data, strictSchema);

  for (const providerName of providersNames) {
    const provider = data.providers[providerName];
    const environmentOptions = extractFromEnvironment(providerName);

    provider.options = { ...provider.options, ...environmentOptions };
  }

  strictValidate(data, strictSchema);

  return data;
};
