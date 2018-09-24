import camelCase from "camel-case";
import constantCase from "constant-case";
import { resolve } from "path";

import { read, readSchema, readSchemas } from "./read";
import { Configuration, JSONValue, RawConfiguration } from "./types";
import { Errors, validate } from "./validate";
import { ValidationError } from "./validation-error";

const rootSchema = readSchema(resolve(__dirname, "../schema.json"));

const isRawConfiguration = (
  _: JSONValue,
  errors: Errors
): _ is RawConfiguration => {
  return errors.length === 0;
};

const prefixErrors = (errors: Errors, namespace: string): Errors => {
  return errors.map(({ message, path }) => ({
    message,
    path: `.${namespace}${path}`
  }));
};

const getCurrentEnvironment = ({
  defaultEnvironment,
  environmentVariable
}: RawConfiguration): string => {
  return process.env[environmentVariable] || defaultEnvironment;
};

export const load = (
  filePath: string,
  providersSchemas?: Record<string, { loose: string; strict: string }>
): Configuration => {
  // Step 1: read data from a file.

  const data: JSONValue = read(filePath);

  // Step 2: validate with root schema.

  const rootErrors: Errors = validate(rootSchema, data);

  if (!isRawConfiguration(data, rootErrors)) {
    throw new ValidationError(rootErrors);
  }

  // Step 3: validate with providers schemas.

  const providersNames = Object.keys(data.providers);

  if (providersSchemas) {
    const looseSchemas = Object.keys(providersSchemas).reduce<
      Record<string, string>
    >((result, providerName) => {
      result[providerName] = providersSchemas[providerName].loose;

      return result;
    }, {});
    const schemas = readSchemas(looseSchemas);
    const providersErrors: Errors = [];

    for (const providerName of providersNames) {
      const provider = data.providers[providerName];
      const schema = schemas[provider.type];

      if (!schema) {
        continue;
      }

      providersErrors.push(
        ...prefixErrors(
          validate(schema, provider.options),
          `providers.${providerName}.options`
        )
      );

      if (!provider.environment) {
        continue;
      }

      const environments = Object.keys(provider.environment);

      for (const environment of environments) {
        providersErrors.push(
          ...prefixErrors(
            validate(schema, provider.environment),
            `providers.${providerName}.environment.${environment}`
          )
        );
      }
    }

    if (providersErrors.length > 0) {
      throw new ValidationError(providersErrors);
    }
  }

  // Step 4: merge options based on environment.

  const currentEnvironment = getCurrentEnvironment(data);

  for (const providerName of providersNames) {
    const provider = data.providers[providerName];

    if (!provider.environment) {
      continue;
    }

    const environmentOptions = provider.environment[currentEnvironment];

    delete provider.environment;

    if (environmentOptions) {
      provider.options = { ...provider.options, ...environmentOptions };
    }
  }

  // Step 5: validate with providers schemas.

  if (providersSchemas) {
    const strictSchemas = Object.keys(providersSchemas).reduce<
      Record<string, string>
    >((result, providerName) => {
      result[providerName] = providersSchemas[providerName].strict;

      return result;
    }, {});
    const schemas = readSchemas(strictSchemas);
    const providersErrors: Errors = [];

    for (const providerName of providersNames) {
      const provider = data.providers[providerName];
      const schema = schemas[provider.type];

      if (!schema) {
        continue;
      }

      providersErrors.push(
        ...prefixErrors(
          validate(schema, provider.options),
          `providers.${providerName}.options`
        )
      );
    }

    if (providersErrors.length > 0) {
      throw new ValidationError(providersErrors);
    }
  }

  // Step 6: merge options from environment variables.

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

      if (value === "true") {
        options[name] = true;
      } else if (value === "false") {
        options[name] = false;
      } else if (value === "null") {
        options[name] = null;
      } else if (/^\d+$/.test(value)) {
        options[name] = parseInt(value, 10);
      } else {
        options[name] = value;
      }
    });
  }

  // Step 7: validate with providers schema.

  if (providersSchemas) {
    const strictSchemas = Object.keys(providersSchemas).reduce<
      Record<string, string>
    >((result, providerName) => {
      result[providerName] = providersSchemas[providerName].strict;

      return result;
    }, {});
    const schemas = readSchemas(strictSchemas);
    const providersErrors: Errors = [];

    for (const providerName of providersNames) {
      const provider = data.providers[providerName];
      const schema = schemas[provider.type];

      if (!schema) {
        continue;
      }

      providersErrors.push(
        ...prefixErrors(
          validate(schema, provider.options),
          `providers.${providerName}.options`
        )
      );
    }

    if (providersErrors.length > 0) {
      throw new ValidationError(providersErrors);
    }
  }

  return data;
};
