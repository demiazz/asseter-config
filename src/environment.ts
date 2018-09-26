import camelCase from "camel-case";
import constantCase from "constant-case";

import { JSONScalar } from "./types";

const isOctal = (value: string): boolean => /^[-+]?0\d+$/.test(value);

const isHexadecimal = (value: string): boolean =>
  /^[-+]?0(x|X)[0-9A-Fa-f]+$/.test(value);

const isDecimal = (value: string): boolean => /^[-+]?\d+$/.test(value);

const isFloat = (value: string): boolean =>
  /^[-+]?\d*\.?\d+([eE][-+]?\d+)?$/.test(value);

export const parse = (value: string): boolean | null | number | string => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "null") {
    return null;
  }

  if (isOctal(value)) {
    return parseInt(value, 8);
  }

  if (isHexadecimal(value)) {
    return parseInt(value, 16);
  }

  if (isDecimal(value)) {
    return parseInt(value, 10);
  }

  if (isFloat(value)) {
    return parseFloat(value);
  }

  return value;
};

export const extractFromEnvironment = (
  namespace: string
): Record<string, JSONScalar> => {
  const prefix = `ASSETER_${constantCase(namespace)}_`;
  const variables: Record<string, JSONScalar> = {};

  for (const variableName of Object.keys(process.env)) {
    if (!variableName.startsWith(prefix)) {
      continue;
    }

    const value = process.env[variableName];

    if (value == null) {
      continue;
    }

    const name = camelCase(variableName.substr(prefix.length));

    variables[name] = parse(value);
  }

  return variables;
};
