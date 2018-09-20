import { readFileSync } from "fs";
import { join } from "path";

import { JSONValue } from "../src/json";

export const forEachFormat = (callback: (format: string) => void) => {
  ["json", "toml", "yaml", "yml"].forEach(callback);
};

export const getFixturePath = (fileName: string): string => {
  return join(__dirname, "fixtures", fileName);
};

export const getFixture = (fileName: string): JSONValue => {
  const fixturePath = getFixturePath(fileName);
  const content = readFileSync(fixturePath, { encoding: "utf8" });

  return JSON.parse(content);
};

interface IEnvironmentVariables {
  [index: string]: void | null | boolean | number | string;
}

const applyPatchToEnvironment = (
  variables: IEnvironmentVariables
): IEnvironmentVariables => {
  return Object.keys(variables).reduce<IEnvironmentVariables>(
    (patch, variable) => {
      const previousValue = process.env[variable];
      const nextValue = variables[variable];

      patch[variable] = previousValue;

      if (nextValue == null) {
        delete process.env[variable];
      } else {
        process.env[variable] = `${nextValue}`;
      }

      return patch;
    },
    {}
  );
};

export const setEnvironment = (variables: IEnvironmentVariables) => {
  const restorePatch = applyPatchToEnvironment(variables);

  return () => applyPatchToEnvironment(restorePatch);
};
