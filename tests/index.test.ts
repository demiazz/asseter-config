import { validate } from "../src";

import { getFixturePath } from "./helpers";

describe("validate", () => {
  describe("when configuration is valid", () => {
    it("doesn't throw an error", () => {
      const schemaPath = getFixturePath("index/schema.json");
      const configurationPath = getFixturePath("index/valid.json");

      expect(() => {
        validate(schemaPath, configurationPath);
      }).not.toThrowError();
    });
  });

  describe("when configuration is invalid", () => {
    it("throws an error", () => {
      const schemaPath = getFixturePath("index/schema.json");
      const configurationPath = getFixturePath("index/invalid.json");

      expect(() => {
        validate(schemaPath, configurationPath);
      }).toThrowError();
    });

    it("throws an error with all errors information", () => {
      const schemaPath = getFixturePath("index/schema.json");
      const configurationPath = getFixturePath("index/invalid.json");

      expect(() => {
        validate(schemaPath, configurationPath);
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
