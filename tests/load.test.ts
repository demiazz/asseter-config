import { load, loadProvider } from "../src/load";

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

describe("loadProvider", () => {
  const data = getFixturePath("load/load-provider/data.json");
  const looseSchema = getFixturePath("load/load-provider/loose-schema.json");
  const strictSchema = getFixturePath("load/load-provider/strict-schema.json");

  let restoreEnvironment: void | (() => void);

  afterEach(() => {
    if (restoreEnvironment) {
      restoreEnvironment();

      restoreEnvironment = undefined;
    }
  });

  it("reads configuration from a file", () => {
    const expected = getFixture("load/load-provider/read/expected.json");

    expect(loadProvider(data, "webpack", looseSchema, strictSchema)).toEqual(
      expected
    );
  });

  describe("root validation", () => {
    it("throws an error when configuration is invalid", () => {
      const actual = getFixturePath(
        "load/load-provider/root-validation/actual.json"
      );
      expect(() =>
        loadProvider(actual, "webpack", looseSchema, strictSchema)
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("loose validation", () => {
    it("throws an error when data is invalid", () => {
      const actualLooseSchema = getFixturePath(
        "load/load-provider/loose-validation/loose-schema.json"
      );

      expect(() => {
        loadProvider(data, "webpack", actualLooseSchema, strictSchema);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("options merge", () => {
    describe("when environment variable do not exist", () => {
      it("merge options based on default environment", () => {
        const expected = getFixture(
          "load/load-provider/options-merge/default-expected.json"
        );

        expect(
          loadProvider(data, "webpack", looseSchema, strictSchema)
        ).toEqual(expected);
      });
    });

    describe("when environment variable is exist", () => {
      it("merge options based on environment variable", () => {
        restoreEnvironment = setEnvironment({
          ASSETER_ENV: "production"
        });

        const expected = getFixture(
          "load/load-provider/options-merge/variable-expected.json"
        );

        expect(
          loadProvider(data, "webpack", looseSchema, strictSchema)
        ).toEqual(expected);
      });
    });
  });

  describe("strict validation after options merge", () => {
    it("throws an error when data is invalid", () => {
      restoreEnvironment = setEnvironment({
        ASSETER_ENV: "invalid"
      });

      const actual = getFixturePath(
        "load/load-provider/options-strict-validation/actual.json"
      );

      expect(() => {
        loadProvider(actual, "webpack", looseSchema, strictSchema);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("environment merge", () => {
    it("merges environment variables as options", () => {
      restoreEnvironment = setEnvironment(getFixture(
        "load/load-provider/environment-merge/environment.json"
      ) as Record<string, string>);

      const emptySchema = getFixturePath(
        "load/load-provider/environment-merge/empty-schema.json"
      );
      const expected = getFixture(
        "load/load-provider/environment-merge/expected.json"
      );

      expect(loadProvider(data, "webpack", emptySchema, emptySchema)).toEqual(
        expected
      );
    });
  });

  describe("strict validation after environment merge", () => {
    it("merges environment variables as options", () => {
      restoreEnvironment = setEnvironment(getFixture(
        "load/load-provider/environment-strict-validation/environment.json"
      ) as Record<string, string>);

      const emptySchema = getFixturePath(
        "load/load-provider/environment-strict-validation/empty-schema.json"
      );

      expect(() => {
        loadProvider(data, "webpack", emptySchema, strictSchema);
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
