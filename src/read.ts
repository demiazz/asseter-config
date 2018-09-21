import Ajv, { ValidateFunction } from "ajv";
import { readFileSync } from "fs";

import { JSONValue } from "./json";
import { reduceKeys } from "./utils";

export const read = (fileName: string): JSONValue => {
  const content = readFileSync(fileName, { encoding: "utf8" });

  return JSON.parse(content);
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
