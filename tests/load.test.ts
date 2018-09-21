import { load } from "../src/load";

import { getFixture, getFixturePath, setEnvironment } from "./helpers";

describe("load", () => {
  it("reads configuration from a file", () => {
    const fixturePath = getFixturePath("load/load/read/actual.json");
    const expected = getFixture("load/load/read/expected.json");

    expect(load(fixturePath)).toEqual(expected);
  });

  describe("validates root configuration", () => {
    it("throws an error", () => {
      const fixturePath = getFixturePath(
        "load/load/root-validation/actual.json"
      );

      expect(() => load(fixturePath)).toThrowErrorMatchingSnapshot();
    });
  });

  describe("validates providers options before processing", () => {
    it("throws an error", () => {
      const rollupSchemaPath = getFixturePath(
        "load/load/loose-providers-validation/rollup-schema.json"
      );
      const webpackSchemaPath = getFixturePath(
        "load/load/loose-providers-validation/webpack-schema.json"
      );
      const fixturePath = getFixturePath(
        "load/load/loose-providers-validation/actual.json"
      );

      expect(() =>
        load(fixturePath, {
          rollup: { loose: rollupSchemaPath, strict: "" },
          webpack: { loose: webpackSchemaPath, strict: "" }
        })
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("with an environment variable", () => {
    let restoreEnvironment: () => void;

    afterEach(() => {
      if (restoreEnvironment) {
        restoreEnvironment();
      }
    });

    it("don't merge options if an environment variable isn't set", () => {
      const fixturePath = getFixturePath("load/load/environment/actual.json");
      const expected = getFixture(
        "load/load/environment/expected-default.json"
      );

      expect(load(fixturePath)).toEqual(expected);
    });

    it("merge options if an environment variable is set", () => {
      restoreEnvironment = setEnvironment({ ASSETER_ENV: "production" });

      const fixturePath = getFixturePath("load/load/environment/actual.json");
      const expected = getFixture(
        "load/load/environment/expected-production.json"
      );

      expect(load(fixturePath)).toEqual(expected);
    });
  });

  describe("validates providers options after merging options", () => {
    it("throws an error", () => {
      const looseRollupSchemaPath = getFixturePath(
        "load/load/strict-providers-validation/loose-rollup-schema.json"
      );
      const strictRollupSchemaPath = getFixturePath(
        "load/load/strict-providers-validation/strict-rollup-schema.json"
      );
      const looseWebpackSchemaPath = getFixturePath(
        "load/load/strict-providers-validation/loose-webpack-schema.json"
      );
      const strictWebpackSchemaPath = getFixturePath(
        "load/load/strict-providers-validation/strict-webpack-schema.json"
      );
      const fixturePath = getFixturePath(
        "load/load/strict-providers-validation/actual.json"
      );

      expect(() =>
        load(fixturePath, {
          rollup: {
            loose: looseRollupSchemaPath,
            strict: strictRollupSchemaPath
          },
          webpack: {
            loose: looseWebpackSchemaPath,
            strict: strictWebpackSchemaPath
          }
        })
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("with environment variables", () => {
    let restoreEnvironment: () => void;

    afterEach(() => {
      if (restoreEnvironment) {
        restoreEnvironment();
      }
    });

    it("merge options from environment variables", () => {
      restoreEnvironment = setEnvironment(getFixture(
        "load/load/environment-options/environment.json"
      ) as Record<string, string>);
      const fixturePath = getFixturePath(
        "load/load/environment-options/actual.json"
      );
      const expected = getFixture(
        "load/load/environment-options/expected.json"
      );

      expect(load(fixturePath)).toEqual(expected);
    });
  });

  describe("validates providers options after merging environment options", () => {
    let restoreEnvironment: () => void;

    afterEach(() => {
      if (restoreEnvironment) {
        restoreEnvironment();
      }
    });

    it("throws an error", () => {
      restoreEnvironment = setEnvironment(getFixture(
        "load/load/strict-environment-validation/environment.json"
      ) as Record<string, string>);

      const looseRollupSchemaPath = getFixturePath(
        "load/load/strict-environment-validation/loose-rollup-schema.json"
      );
      const strictRollupSchemaPath = getFixturePath(
        "load/load/strict-environment-validation/strict-rollup-schema.json"
      );
      const looseWebpackSchemaPath = getFixturePath(
        "load/load/strict-environment-validation/loose-webpack-schema.json"
      );
      const strictWebpackSchemaPath = getFixturePath(
        "load/load/strict-environment-validation/strict-webpack-schema.json"
      );
      const fixturePath = getFixturePath(
        "load/load/strict-environment-validation/actual.json"
      );

      expect(() =>
        load(fixturePath, {
          rollup: {
            loose: looseRollupSchemaPath,
            strict: strictRollupSchemaPath
          },
          webpack: {
            loose: looseWebpackSchemaPath,
            strict: strictWebpackSchemaPath
          }
        })
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
