import { load } from "../src/load";

import { getFixture, getFixturePath, setEnvironment } from "./helpers";

describe("load", () => {
  const data = getFixturePath("load/data.json");
  const looseSchema = getFixturePath("load/loose-schema.json");
  const strictSchema = getFixturePath("load/strict-schema.json");

  let restoreEnvironment: void | (() => void);

  afterEach(() => {
    if (restoreEnvironment) {
      restoreEnvironment();

      restoreEnvironment = undefined;
    }
  });

  it("reads configuration from a file", () => {
    const expected = getFixture("load/read/expected.json");

    expect(load(data, "webpack", looseSchema, strictSchema)).toEqual(expected);
  });

  describe("root validation", () => {
    it("throws an error when configuration is invalid", () => {
      const actual = getFixturePath("load/root-validation/actual.json");
      expect(() =>
        load(actual, "webpack", looseSchema, strictSchema)
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("loose validation", () => {
    it("throws an error when data is invalid", () => {
      const actualLooseSchema = getFixturePath(
        "load/loose-validation/loose-schema.json"
      );

      expect(() => {
        load(data, "webpack", actualLooseSchema, strictSchema);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("options merge", () => {
    describe("when environment variable do not exist", () => {
      it("merge options based on default environment", () => {
        const expected = getFixture("load/options-merge/default-expected.json");

        expect(load(data, "webpack", looseSchema, strictSchema)).toEqual(
          expected
        );
      });
    });

    describe("when environment variable is exist", () => {
      it("merge options based on environment variable", () => {
        restoreEnvironment = setEnvironment({
          ASSETER_ENV: "production"
        });

        const expected = getFixture(
          "load/options-merge/variable-expected.json"
        );

        expect(load(data, "webpack", looseSchema, strictSchema)).toEqual(
          expected
        );
      });
    });
  });

  describe("strict validation after options merge", () => {
    it("throws an error when data is invalid", () => {
      restoreEnvironment = setEnvironment({
        ASSETER_ENV: "invalid"
      });

      const actual = getFixturePath(
        "load/options-strict-validation/actual.json"
      );

      expect(() => {
        load(actual, "webpack", looseSchema, strictSchema);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("environment merge", () => {
    it("merges environment variables as options", () => {
      restoreEnvironment = setEnvironment(getFixture(
        "load/environment-merge/environment.json"
      ) as Record<string, string>);

      const emptySchema = getFixturePath(
        "load/environment-merge/empty-schema.json"
      );
      const expected = getFixture("load/environment-merge/expected.json");

      expect(load(data, "webpack", emptySchema, emptySchema)).toEqual(expected);
    });
  });

  describe("strict validation after environment merge", () => {
    it("merges environment variables as options", () => {
      restoreEnvironment = setEnvironment(getFixture(
        "load/environment-strict-validation/environment.json"
      ) as Record<string, string>);

      const emptySchema = getFixturePath(
        "load/environment-strict-validation/empty-schema.json"
      );

      expect(() => {
        load(data, "webpack", emptySchema, strictSchema);
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
