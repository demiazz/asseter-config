import { JSONValue } from "./json";

const isObject = (value: JSONValue): value is Record<string, JSONValue> => {
  if (value == null) {
    return false;
  }

  const type = typeof value;

  if (type === "boolean" || type === "number" || type === "string") {
    return false;
  }

  return !Array.isArray(value);
};

export const getByPath = (value: JSONValue, path: string[]): JSONValue => {
  if (!isObject(value)) {
    throw new Error("Value must be an object");
  }

  if (path.length === 0) {
    return value;
  }

  let nextValue: JSONValue = value;

  for (let i = 0; i < path.length; i += 1) {
    const pathFragment = path[i];

    if (!isObject(nextValue)) {
      throw new Error(
        `Path '${path.slice(0, i + 1).join(".")}' doesn't exists`
      );
    }

    nextValue = nextValue[pathFragment];
  }

  return nextValue;
};

export const reduceKeys = <U>(
  object: Record<string, any>,
  callback: (
    previousValue: U,
    currentValue: string,
    currentIndex: number,
    array: string[]
  ) => U,
  initialValue: U
) => Object.keys(object).reduce<U>(callback, initialValue);
