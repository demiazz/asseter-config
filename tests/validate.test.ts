import { readSchema } from "../src/read";
import { validate, ValidationError } from "../src/validate";

import { forEachJSONType, getFixture, getFixturePath } from "./helpers";

describe("validate", () => {
  const schemaPath = getFixturePath("validate/validate/schema.json");
  const validFixture = "validate/validate/valid.json";
  const invalidFixture = "validate/validate/invalid.json";

  forEachJSONType((type, value) => {
    describe(`given value of type '${type}'`, () => {
      it("throws an error", () => {
        const schema = readSchema(schemaPath);

        expect(() => validate(schema, value)).toThrowError(
          "Value must be an object"
        );
      });
    });
  });

  describe("when given path doesn't exist", () => {
    it("throws an error", () => {
      const schema = readSchema(schemaPath);
      const data = {
        bar: [{ baz: "foo" }]
      };

      expect(() => validate(schema, data, ["bar", "baz"])).toThrowError(
        "Path 'bar.baz' doesn't exists"
      );
    });
  });

  describe("when path is empty", () => {
    it("returns empty list of errors when data is valid", () => {
      const schema = readSchema(schemaPath);
      const data = getFixture(validFixture);

      expect(validate(schema, data)).toEqual([]);
    });

    it("returns list of errors when data is invalid", () => {
      const schema = readSchema(schemaPath);
      const data = getFixture(invalidFixture);

      expect(validate(schema, data)).toEqual([
        {
          message: "should NOT have additional properties",
          path: ""
        },
        {
          message: "should be string",
          path: ".foo"
        },
        {
          message: "should be string",
          path: ".bar"
        }
      ]);
    });
  });

  describe("when given path is not empty", () => {
    it("returns empty list of errors when data by path is valid", () => {
      const schema = readSchema(schemaPath);
      const data = {
        firstLevel: {
          secondLevel: getFixture(validFixture)
        }
      };

      expect(validate(schema, data, ["firstLevel", "secondLevel"])).toEqual([]);
    });

    it("returns list of errors when data is invalid", () => {
      const schema = readSchema(schemaPath);
      const data = {
        firstLevel: {
          secondLevel: getFixture(invalidFixture)
        }
      };

      expect(validate(schema, data, ["firstLevel", "secondLevel"])).toEqual([
        {
          message: "should NOT have additional properties",
          path: ".firstLevel.secondLevel"
        },
        {
          message: "should be string",
          path: ".firstLevel.secondLevel.foo"
        },
        {
          message: "should be string",
          path: ".firstLevel.secondLevel.bar"
        }
      ]);
    });
  });
});

describe("ValidationError", () => {
  describe(".constructor", () => {
    it("assembles message error from errors list", () => {
      const schema = readSchema(
        getFixturePath("validate/validation-error/schema.json")
      );
      const data = getFixture("validate/validation-error/invalid.json");
      const errors = validate(schema, data);
      const error = new ValidationError(errors);

      expect(error.message).toEqual(
        [
          "Invalid configuration:",
          "  root should NOT have additional properties",
          "  root.foo should be string",
          "  root.bar should be string"
        ].join("\n")
      );
    });
  });
});
