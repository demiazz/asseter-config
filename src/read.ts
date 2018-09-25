import Ajv, { ValidateFunction } from "ajv";
import { readFileSync } from "fs";

import { JSONValue } from "./types";

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
