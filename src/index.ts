import Ajv from "ajv";
import { readFileSync } from "fs";
import { safeLoad as parseYAML } from "js-yaml";
import { extname } from "path";
import { parse as parseTOML } from "toml";

type Parser = (content: string) => JSON;

const getParser = (fileName: string): Parser | null => {
  switch (extname(fileName)) {
    case ".json":
      return JSON.parse;
    case ".yml":
    case ".yaml":
      return parseYAML;
    case ".toml":
      return parseTOML;
    default:
      return null;
  }
};

export const read = (fileName: string): JSON => {
  const parse = getParser(fileName);

  if (!parse) {
    throw new Error("Supported only JSON, YAML and TOML file types");
  }

  const content = readFileSync(fileName, { encoding: "utf8" });

  return parse(content);
};

export const readSchema = (fileName: string): Ajv.ValidateFunction => {
  const definition = read(fileName);
  const schema = new Ajv({
    allErrors: true,
    jsonPointers: false
  });

  return schema.compile(definition);
};

class ValidationError extends Error {
  constructor(errors: Ajv.ErrorObject[]) {
    super();

    this.message = errors
      .reduce<string[]>(
        (messages: string[], error: Ajv.ErrorObject) => {
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
