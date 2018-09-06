import Ajv, { ValidateFunction } from "ajv";
import { readFileSync } from "fs";
import { safeLoad as parseYAML } from "js-yaml";
import { extname } from "path";
import { parse as parseTOML } from "toml";

type Parser = (content: string) => JSON;

const getParser = (fileName: string): Parser | void => {
  switch (extname(fileName)) {
    case ".json":
      return JSON.parse;
    case ".yml":
    case ".yaml":
      return parseYAML;
    case ".toml":
      return parseTOML;
    default:
      return undefined;
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

export const readSchema = (source: string | JSON): ValidateFunction => {
  const definition = typeof source === "string" ? read(source) : source;
  const schema = new Ajv({
    allErrors: true,
    jsonPointers: false
  });

  return schema.compile(definition);
};
