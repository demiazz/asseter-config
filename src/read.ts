import Ajv, { ValidateFunction } from "ajv";
import { readFileSync } from "fs";
import { extname } from "path";

import { JSONValue } from "./json";
import { reduceKeys } from "./utils";

type Parser = (content: string) => JSONValue;

const getParser = (fileName: string): Parser | void => {
  switch (extname(fileName)) {
    case ".json":
      return JSON.parse;
    default:
      return undefined;
  }
};

export const read = (fileName: string): JSONValue => {
  const parse = getParser(fileName);

  if (!parse) {
    throw new Error("Supported only JSON file types");
  }

  const content = readFileSync(fileName, { encoding: "utf8" });

  return parse(content);
};

export const readSchema = (definitionPath: string): ValidateFunction => {
  const definition = read(definitionPath);
  const compiler = new Ajv({
    allErrors: true,
    jsonPointers: false
  });

  return compiler.compile(definition as object);
};

export const readSchemas = (
  definitionPaths: Record<string, string>
): Record<string, ValidateFunction> => {
  const schemas: Record<string, ValidateFunction> = {};

  return reduceKeys(
    definitionPaths,
    (result, schemaName) => {
      const definitionPath = definitionPaths[schemaName];

      result[schemaName] = readSchema(definitionPath);

      return result;
    },
    schemas
  );
};
