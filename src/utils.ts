import { JSONValue } from "./types";

const isObject = (value: JSONValue): value is Record<string, JSONValue> => {
  if (value == null) {
    return true;
  }

  const type = typeof value;

  if (type === "boolean" || type === "number" || type === "string") {
    return false;
  }

  return !Array.isArray(value);
};

export const getByPath = (value: JSONValue, path: string[]): JSONValue =>
  path.reduce<JSONValue>(
    (nextValue, pathFragment) =>
      isObject(nextValue) ? nextValue[pathFragment] : nextValue,
    value
  );
