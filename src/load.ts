import camelCase from "camel-case";
import constantCase from "constant-case";
import { resolve } from "path";

import { read, readSchema, readSchemas } from "./read";
import { Configuration, JSONValue, RawConfiguration } from "./types";
import { validate } from "./validate";
import { ValidationError } from "./validation-error";

const isRawConfiguration = (
  _: JSONValue,
  errors: string[]
): _ is RawConfiguration => {
  return errors.length === 0;
};

const getCurrentEnvironment = ({
  defaultEnvironment,
  environmentVariable
}: RawConfiguration): string => {
  return process.env[environmentVariable] || defaultEnvironment;
};

export const loadProvider = (
  configurationPath: string,
  providerType: string,
  looseSchemaPath: string,
  strictSchemaPath: string
) => {
  // 1. read data from a file.

  const data = read(configurationPath);

  // 2. load root schema.

  const rootSchema = readSchema(resolve(__dirname, "../new-schema.json"));

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

  const providersNames = Object.keys(data.providers);
  const looseErrors: string[] = [];

  for (const providerName of providersNames) {
    const provider = data.providers[providerName];

    looseErrors.push(
      ...validate(
        looseSchema,
        provider.options,
        `providers.${providerName}.options`
      )
    );

    if (!provider.environment) {
      continue;
    }

    const environments = Object.keys(provider.environment);

    for (const environment of environments) {
      looseErrors.push(
        ...validate(
          looseSchema,
          provider.environment[environment],
          `providers.${providerName}.environment.${environment}`
        )
      );
    }
  }

  // 8. if errors then throw exception.

  if (looseErrors.length > 0) {
    throw new ValidationError(looseErrors);
  }

  // 9. detect current environment.

  const currentEnvironment =
    process.env[data.environmentVariable] || data.defaultEnvironment;

  // 10. merge options based on environment.

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

  const mergeErrors: string[] = [];

  for (const providerName of providersNames) {
    const provider = data.providers[providerName];

    mergeErrors.push(
      ...validate(
        strictSchema,
        provider.options,
        `providers.${providerName}.options`
      )
    );
  }

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

  // 15. validate options with the strict schema.

  const environmentErrors: string[] = [];

  for (const providerName of providersNames) {
    const provider = data.providers[providerName];

    environmentErrors.push(
      ...validate(
        strictSchema,
        provider.options,
        `providers.${providerName}.options`
      )
    );
  }

  // 16. if errors then throw exception.

  if (environmentErrors.length > 0) {
    throw new ValidationError(environmentErrors);
  }

  // 17. return result.

  return data;
};

export const load = (
  filePath: string,
  providersSchemas?: Record<string, { loose: string; strict: string }>
): Configuration => {
  // Step 1: read data from a file.

  const data: JSONValue = read(filePath);

  // Step 2: validate with root schema.

  const rootSchema = readSchema(resolve(__dirname, "../schema.json"));
  const rootErrors = validate(rootSchema, data);

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
    const providersErrors: string[] = [];

    for (const providerName of providersNames) {
      const provider = data.providers[providerName];
      const schema = schemas[provider.type];

      if (!schema) {
        continue;
      }

      providersErrors.push(
        ...validate(
          schema,
          provider.options,
          `providers.${providerName}.options`
        )
      );

      if (!provider.environment) {
        continue;
      }

      const environments = Object.keys(provider.environment);

      for (const environment of environments) {
        providersErrors.push(
          ...validate(
            schema,
            provider.environment[environment],
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
    const providersErrors: string[] = [];

    for (const providerName of providersNames) {
      const provider = data.providers[providerName];
      const schema = schemas[provider.type];

      if (!schema) {
        continue;
      }

      providersErrors.push(
        ...validate(
          schema,
          provider.options,
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
    const providersErrors: string[] = [];

    for (const providerName of providersNames) {
      const provider = data.providers[providerName];
      const schema = schemas[provider.type];

      if (!schema) {
        continue;
      }

      providersErrors.push(
        ...validate(
          schema,
          provider.options,
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
