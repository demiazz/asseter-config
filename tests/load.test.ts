import { load } from "../src/load";

import {
  forEachFormat,
  getFixture,
  getFixturePath,
  setEnvironment
} from "./helpers";

describe("load", () => {
  forEachFormat(format => {
    describe(`when given file with '.${format}' extension`, () => {
      it("reads a raw configuration from a file", () => {
        const expected = getFixture(`load/valid-expected.json`);
        const actual = load(getFixturePath(`load/valid.${format}`));

        expect(actual).toEqual(expected);
      });

      describe("when given file has a wrong format", () => {
        const configurationPath = getFixturePath(`load/invalid.${format}`);

        expect(() => load(configurationPath)).toThrowErrorMatchingSnapshot();
      });

      describe("with environment", () => {
        let restoreEnvironment: () => {};

        afterEach(() => {
          if (!restoreEnvironment) {
            return;
          }

          restoreEnvironment();
        });

        describe("when environment variable is not set", () => {
          it("merges options for default environment", () => {
            restoreEnvironment = setEnvironment({ ASSETER_ENV: undefined });

            const configurationPath = getFixturePath(
              `load/environment.${format}`
            );
            const expected = getFixture("load/default-environment.json");

            expect(load(configurationPath)).toEqual(expected);
          });
        });

        describe("when environment variable is set", () => {
          it("merges options for environment", () => {
            restoreEnvironment = setEnvironment({ ASSETER_ENV: "production" });

            const configurationPath = getFixturePath(
              `load/environment.${format}`
            );
            const expected = getFixture("load/production-environment.json");

            expect(load(configurationPath)).toEqual(expected);
          });
        });
      });
    });
  });
});
