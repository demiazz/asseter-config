import { ValidateFunction } from "ajv";
import camelCase from "camel-case";
import constantCase from "constant-case";
import { resolve } from "path";

import { parse } from "./parse";
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
): string[] => {
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

  return errors;
};

const strictValidate = (
  { providers }: RawConfiguration,
  schema: ValidateFunction
): string[] => {
  const providersNames = Object.keys(providers);
  const errors: string[] = [];

  for (const providerName of providersNames) {
    const { options } = providers[providerName];

    errors.push(
      ...validate(schema, options, `providers.${providerName}.options`)
    );
  }

  return errors;
};

export const load = (
  configurationPath: string,
  providerType: string,
  looseSchemaPath: string,
  strictSchemaPath: string
): Configuration => {
  // 1. read data from a file.

  const data = read(configurationPath);

  // 2. load root schema.

  const rootSchema = readSchema(resolve(__dirname, "../schema.json"));

  // 3. validate a file with the root schema.

  const rootErrors = validate(rootSchema, data);

  // 4. if errors then throw exception.

  if (!isRawConfiguration(data, rootErrors)) {
    throw new ValidationError(rootErrors);
  }

  // 5. filter providers by types.

  const allProvidersNames = Object.keys(data.providers);

  for (const providerName of allProvidersNames) {
    const { type } = data.providers[providerName];

    if (type !== providerType) {
      delete data.providers[providerName];
    }
  }

  // 6. load loose schema.

  const looseSchema = readSchema(looseSchemaPath);

  // 7. validate options with the loose schema.

  const looseErrors = looseValidate(data, looseSchema);

  // 8. if errors then throw exception.

  if (looseErrors.length > 0) {
    throw new ValidationError(looseErrors);
  }

  // 9. detect current environment.

  const currentEnvironment =
    process.env[data.environmentVariable] || data.defaultEnvironment;

  // 10. merge options based on environment.

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

  // 11. load strict schema.

  const strictSchema = readSchema(strictSchemaPath);

  // 12. validate options with the strict schema.

  const mergeErrors = strictValidate(data, strictSchema);

  // 13. if errors then throw exception.

  if (mergeErrors.length > 0) {
    throw new ValidationError(mergeErrors);
  }

  // 14. merge options from environment variables.

  for (const providerName of providersNames) {
    const options = data.providers[providerName].options;
    const prefix = `ASSETER_${constantCase(providerName)}_`;

    Object.keys(process.env).forEach(variable => {
      if (!variable.startsWith(prefix)) {
        return;
      }

      const value = process.env[variable];

      if (value == null) {
        return;
      }

      const name = camelCase(variable.substr(prefix.length));

      options[name] = parse(value);
    });
  }

  // 15. validate options with the strict schema.

  const environmentErrors = strictValidate(data, strictSchema);

  // 16. if errors then throw exception.

  if (environmentErrors.length > 0) {
    throw new ValidationError(environmentErrors);
  }

  // 17. return result.

  return data;
};
