import Ajv, { ValidateFunction } from "ajv";
import { readFileSync } from "fs";
import { safeLoad as parseYAML } from "js-yaml";
import { extname } from "path";
import { parse as parseTOML } from "toml";

import { JSONValue } from './types';

type Parser = (content: string) => JSONValue;

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

export const read = (fileName: string): JSONValue => {
  const parse = getParser(fileName);

  if (!parse) {
    throw new Error("Supported only JSON, YAML and TOML file types");
  }

  const content = readFileSync(fileName, { encoding: "utf8" });

  return parse(content);
};

export const readSchema = (definitionPath: string): ValidateFunction => {
  const definition = read(definitionPath);
  const compiler = new Ajv({
    allErrors: true,
    jsonPointers: false,
  });

  return compiler.compile(definition as object);
}
